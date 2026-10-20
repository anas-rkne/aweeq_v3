import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { HDRLoader } from "three/addons/loaders/HDRLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

/*
 * The hero's 3D bottle (v3) — the same product as the hands finale
 * (`/models/bottle-mid.glb`, Draco + WebP), standalone on a transparent canvas
 * over the hero's navy stage.
 *
 * Approach mined from v2's praised hero scene, kept because it works:
 *   - the untouched baked GLB material (baseColor + metallicRoughness);
 *   - studio `RoomEnvironment` reflections from the very first frame as the
 *     safe default, swapped to the brand HDR gradient
 *     (`GRADIENT_01_01_comp.hdr`) the moment it arrives — three converts an
 *     equirect `envMap` internally, so no PMREM pass is needed for it (the
 *     handsScene pattern);
 *   - the golden Fresnel rim injected into the standard shader;
 *   - the interaction grammar: MOVE follows the cursor, DRAG spins the bottle
 *     with release momentum and an elastic pitch settle. Mouse-only, so touch
 *     keeps scrolling the page.
 *
 * v3 differences from v2:
 *   - `onReady`/`onFail` callbacks, so the hero choreographs its entrance
 *     (loader → bottle → copy) and falls back to the static poster;
 *   - calmer pointer-follow ceiling (the v3 brief asks for restraint);
 *   - every async landing is guarded against dispose-while-loading.
 */

/** Vertical field of view and camera distance — the fit math depends on both. */
const FOV = 35;
const CAMERA_Z = 4;
/** Share of the container's visible height the 45°-tilted bottle fills.
 *  `(size.x + size.y) * √½` is the tilted extent, so the lean never clips. */
const FIT_SHARE = 0.8;
/** The lean: top of the bottle toward the RIGHT (three.js z is CCW). */
const TILT_Z = -Math.PI / 4;
/** Idle spin — one full turn ≈ 21s. */
const SPIN_SPEED = 0.005;
/** Pointer-follow ceilings (radians) and drag sensitivities. */
const FOLLOW_YAW = 0.5;
const FOLLOW_PITCH = 0.32;
const PITCH_MAX = 0.6;
const DRAG_YAW = 0.01;
const DRAG_PITCH = 0.006;
const SPIN_DECAY = 0.92;

export type HeroBottleCallbacks = {
  /** The model is in the scene and the first frames will paint from now on. */
  onReady: () => void;
  /** The GLB failed to load — the caller should settle on the poster. */
  onFail: () => void;
};

export type HeroBottleHandle = {
  dispose: () => void;
};

const clampN = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

export function createHeroBottleScene(
  container: HTMLElement,
  callbacks: HeroBottleCallbacks
): HeroBottleHandle {
  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const isMobile = window.matchMedia("(max-width: 1023px)").matches;
  /** Phones render the bottle big (~86vw square), so the shaded area grew —
   *  1.25 keeps the frame budget while staying invisible on a ~390px screen
   *  (MASTER-PLAN 5.4: DPR ≤ 1.5 on mobile). */
  const dprCap = window.matchMedia("(max-width: 479px)").matches
    ? 1.25
    : isMobile
      ? 1.5
      : 2;
  const dpr = Math.min(window.devicePixelRatio || 1, dprCap);

  let disposed = false;

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(dpr);
  renderer.setSize(width, height);
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  renderer.domElement.style.display = "block";
  renderer.domElement.style.pointerEvents = "auto";
  renderer.domElement.style.touchAction = "pan-y";
  renderer.domElement.dataset.heroBottle = "1";
  container.appendChild(renderer.domElement);
  const dom = renderer.domElement;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(FOV, width / height, 0.1, 100);
  camera.position.set(0, 0, CAMERA_Z);
  camera.lookAt(0, 0, 0);

  // Studio "softbox" reflections — instant, offline-safe default.
  const pmrem = new THREE.PMREMGenerator(renderer);
  const studioEnv = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  let hdrEnv: THREE.Texture | null = null;
  let envForMats: THREE.Texture = studioEnv;

  // The lean (fixed) → the pitch (drag/follow wobble) → the spin (the bottle's
  // own axis). The innermost yaw spins WITHIN the tilt.
  const tilt = new THREE.Group();
  tilt.rotation.z = TILT_Z;
  scene.add(tilt);
  const pitchG = new THREE.Group();
  tilt.add(pitchG);
  const spin = new THREE.Group();
  pitchG.add(spin);

  // Golden Fresnel rim, injected into the standard shader.
  const rimUniforms = {
    uRimColor: { value: new THREE.Color(0xcd9e61) },
    uRimPower: { value: 3.0 },
    uRimStrength: { value: 0.55 },
  };
  const bottleMats: THREE.MeshStandardMaterial[] = [];

  const applyEnv = (tex: THREE.Texture) => {
    envForMats = tex;
    for (let i = 0; i < bottleMats.length; i++) {
      bottleMats[i].envMap = tex;
      bottleMats[i].needsUpdate = true;
    }
  };

  // Brand HDR gradient, when it arrives (falls back silently to the studio).
  new HDRLoader().load(
    "/hdr/GRADIENT_01_01_comp.hdr",
    (tex) => {
      if (disposed) {
        tex.dispose();
        return;
      }
      tex.mapping = THREE.EquirectangularReflectionMapping;
      hdrEnv = tex;
      applyEnv(tex);
    },
    undefined,
    () => {
      /* keep the studio default — reflections only */
    }
  );

  let modelReady = false;
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  const gltfLoader = new GLTFLoader();
  gltfLoader.setDRACOLoader(dracoLoader);
  gltfLoader.load(
    "/models/bottle-mid.glb",
    (gltf) => {
      if (disposed) return;
      const bottle = gltf.scene;
      bottle.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (!mesh.isMesh) return;
        if (!mesh.geometry.getAttribute("normal"))
          mesh.geometry.computeVertexNormals();
        const mat = mesh.material as THREE.MeshStandardMaterial | undefined;
        if (!mat) return;
        mat.envMap = envForMats;
        mat.envMapIntensity = 0.7;
        mat.envMapRotation = new THREE.Euler(0, 0, 0);
        mat.onBeforeCompile = (shader) => {
          Object.assign(shader.uniforms, rimUniforms);
          shader.vertexShader = shader.vertexShader
            .replace(
              "#include <common>",
              "#include <common>\nvarying vec3 vRimNormal;\nvarying vec3 vRimViewPos;"
            )
            .replace(
              "#include <begin_vertex>",
              "#include <begin_vertex>\nvRimNormal = normalize( normalMatrix * objectNormal );\nvRimViewPos = ( modelViewMatrix * vec4( transformed, 1.0 ) ).xyz;"
            );
          shader.fragmentShader = shader.fragmentShader
            .replace(
              "#include <common>",
              "#include <common>\nvarying vec3 vRimNormal;\nvarying vec3 vRimViewPos;\nuniform vec3 uRimColor;\nuniform float uRimPower;\nuniform float uRimStrength;"
            )
            .replace(
              "#include <emissivemap_fragment>",
              "#include <emissivemap_fragment>\nfloat vRim = pow( 1.0 - clamp( dot( normalize( vRimNormal ), normalize( -vRimViewPos ) ), 0.0, 1.0 ), uRimPower );\ntotalEmissiveRadiance += uRimColor * ( vRim * uRimStrength );"
            );
        };
        mat.customProgramCacheKey = () => "heroBottleRim";
        mat.needsUpdate = true;
        bottleMats.push(mat);
      });
      // Recentre on the bbox, then fit the TILTED diagonal to the view.
      const bbox = new THREE.Box3().setFromObject(bottle);
      const center = bbox.getCenter(new THREE.Vector3());
      const size = bbox.getSize(new THREE.Vector3());
      bottle.position.sub(center);
      const visibleH = 2 * CAMERA_Z * Math.tan((FOV * Math.PI) / 360);
      const tiltedExtent = (size.x + size.y) * Math.SQRT1_2 || 1;
      bottle.scale.setScalar((visibleH * FIT_SHARE) / tiltedExtent);
      spin.add(bottle);
      modelReady = true;
      dom.style.cursor = "grab";
      callbacks.onReady();
    },
    undefined,
    (err) => {
      if (disposed) return;
      console.error("[hero-bottle] load failed", err);
      callbacks.onFail();
    }
  );

  // Interaction state.
  const clock = new THREE.Clock();
  let raf = 0;
  let ioVisible = true;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let followYaw = 0;
  let followPitch = 0;
  let targetFollowYaw = 0;
  let targetFollowPitch = 0;
  let pointerNX = 0;
  let pointerNY = 0;
  let idle = 0;
  let dragYaw = 0;
  let dragPitch = 0;
  let spinVel = 0;

  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType !== "mouse" || !modelReady) return;
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    spinVel = 0;
    try {
      dom.setPointerCapture(e.pointerId);
    } catch {
      /* noop */
    }
    dom.style.cursor = "grabbing";
  };
  const onPointerMove = (e: PointerEvent) => {
    const r = container.getBoundingClientRect();
    if (r.width > 0 && r.height > 0) {
      pointerNX = clampN(((e.clientX - r.left) / r.width) * 2 - 1, -1, 1);
      pointerNY = clampN(((e.clientY - r.top) / r.height) * 2 - 1, -1, 1);
    }
    if (!dragging) {
      targetFollowYaw = pointerNX * FOLLOW_YAW;
      targetFollowPitch = pointerNY * FOLLOW_PITCH;
      return;
    }
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    dragYaw += dx * DRAG_YAW;
    dragPitch += dy * DRAG_PITCH;
    spinVel = dx * DRAG_YAW;
  };
  const onPointerLeave = () => {
    targetFollowYaw = 0;
    targetFollowPitch = 0;
  };
  const onPointerUp = (e: PointerEvent) => {
    if (!dragging) return;
    dragging = false;
    dom.style.cursor = modelReady ? "grab" : "";
    try {
      dom.releasePointerCapture(e.pointerId);
    } catch {
      /* noop */
    }
  };
  dom.addEventListener("pointerdown", onPointerDown);
  dom.addEventListener("pointermove", onPointerMove);
  dom.addEventListener("pointerup", onPointerUp);
  dom.addEventListener("pointercancel", onPointerUp);
  dom.addEventListener("pointerleave", onPointerLeave);

  const io = new IntersectionObserver(
    (entries) => {
      ioVisible = entries[0]?.isIntersecting ?? true;
    },
    { rootMargin: "120px" }
  );
  io.observe(container);

  const resize = () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(container);

  const animate = () => {
    raf = requestAnimationFrame(animate);
    if (!ioVisible || document.hidden) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    if (!reducedMotion) idle += SPIN_SPEED * Math.min(dt * 60, 1.5);

    // Release momentum + elastic pitch settle.
    if (!dragging && spinVel !== 0) {
      dragYaw += spinVel;
      spinVel *= SPIN_DECAY;
      if (Math.abs(spinVel) < 0.0004) spinVel = 0;
    }
    if (!dragging) dragPitch += (0 - dragPitch) * 0.07;

    followYaw += (targetFollowYaw - followYaw) * 0.08;
    followPitch += (targetFollowPitch - followPitch) * 0.08;
    spin.rotation.y = idle + dragYaw + followYaw;
    pitchG.rotation.x = clampN(dragPitch + followPitch, -PITCH_MAX, PITCH_MAX);

    // Sweep the reflections with the cursor — a light streak roams the glass.
    for (let i = 0; i < bottleMats.length; i++) {
      bottleMats[i].envMapRotation.set(pointerNY * 0.35, pointerNX * 0.5, 0);
    }

    renderer.render(scene, camera);
  };
  animate();

  return {
    dispose() {
      disposed = true;
      ioVisible = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      dom.removeEventListener("pointerdown", onPointerDown);
      dom.removeEventListener("pointermove", onPointerMove);
      dom.removeEventListener("pointerup", onPointerUp);
      dom.removeEventListener("pointercancel", onPointerUp);
      dom.removeEventListener("pointerleave", onPointerLeave);
      spin.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (!mesh.isMesh) return;
        mesh.geometry?.dispose?.();
        const mat = mesh.material as THREE.MeshStandardMaterial | undefined;
        if (mat) {
          mat.map?.dispose?.();
          mat.normalMap?.dispose?.();
          mat.roughnessMap?.dispose?.();
          mat.metalnessMap?.dispose?.();
          mat.dispose();
        }
      });
      dracoLoader.dispose();
      hdrEnv?.dispose();
      studioEnv.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}

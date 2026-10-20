import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { HDRLoader } from "three/addons/loaders/HDRLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

/*
 * The cinematic hero's 3D bottle. Loads the real `/models/bottle-mid.glb`
 * (Draco + WebP) on a transparent canvas, lit by the brand HDR gradient with a
 * studio RoomEnvironment as the instant offline default. Idle slow spin only —
 * the parallax and the descent into the story section are driven by GSAP on the
 * React wrapper, not here.
 */

const FOV = 35;
const CAMERA_Z = 4;

export type NewHeroBottleHandle = {
  /**
   * Extra idle-spin speed driven by the page scroll. `0` is the resting slow
   * spin; higher values spin faster. Player-set on every scroll frame by the
   * wrapper's ScrollTrigger, so the glass accelerates as you move down the page.
   */
  setScrollSpin: (value: number) => void;
  dispose: () => void;
};

export function createNewHeroBottleScene(
  container: HTMLElement
): NewHeroBottleHandle {
  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const isMobile = window.matchMedia("(max-width: 1023px)").matches;
  const dprCap = isMobile ? 1.5 : 2;

  let disposed = false;

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(dpr, dprCap));
  renderer.setSize(width, height);
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  renderer.domElement.style.display = "block";
  renderer.domElement.style.pointerEvents = "none";
  container.appendChild(renderer.domElement);
  const dom = renderer.domElement;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(FOV, width / height, 0.1, 100);
  camera.position.set(0, 0, CAMERA_Z);
  camera.lookAt(0, 0, 0);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const studioEnv = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  let hdrEnv: THREE.Texture | null = null;
  let envForMats: THREE.Texture = studioEnv;

  const group = new THREE.Group();
  scene.add(group);

  const bottleMats: THREE.MeshStandardMaterial[] = [];

  const applyEnv = (tex: THREE.Texture) => {
    envForMats = tex;
    for (let i = 0; i < bottleMats.length; i++) {
      bottleMats[i].envMap = tex;
      bottleMats[i].needsUpdate = true;
    }
  };

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
      /* keep the studio default */
    }
  );

  const draco = new DRACOLoader();
  draco.setDecoderPath("/draco/");
  const loader = new GLTFLoader();
  loader.setDRACOLoader(draco);
  loader.load(
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
        mat.envMapIntensity = 0.8;
        mat.needsUpdate = true;
        bottleMats.push(mat);
      });
      const box = new THREE.Box3().setFromObject(bottle);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      bottle.position.sub(center);
      const visibleH = 2 * CAMERA_Z * Math.tan((FOV * Math.PI) / 360);
      bottle.scale.setScalar((visibleH * 0.82) / (size.y || 1));
      group.add(bottle);
    },
    undefined,
    (err) => {
      if (disposed) return;
      console.error("[new-hero-bottle] load failed", err);
    }
  );

  const clock = new THREE.Clock();
  let raf = 0;
  let idle = 0;
  // Scroll-driven spin speed, eased toward its target so the change is smooth
  // rather than stepped with the (coarse) scrub updates.
  let spinTarget = 0;
  let spinCurrent = 0;
  // The render loop is paused entirely while the canvas is offscreen — two
  // full scenes rendering forever on a phone is what starves the scroll.
  let running = false;
  const animate = () => {
    if (!running) return;
    raf = requestAnimationFrame(animate);
    if (document.hidden) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    spinCurrent += (spinTarget - spinCurrent) * Math.min(dt * 6, 1);
    idle += dt * (0.4 + spinCurrent);
    group.rotation.y = idle;
    renderer.render(scene, camera);
  };
  const startLoop = () => {
    if (running || disposed) return;
    running = true;
    clock.getDelta();
    raf = requestAnimationFrame(animate);
  };
  const stopLoop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };
  startLoop();

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) startLoop();
        else stopLoop();
      }
    },
    { rootMargin: "10% 0px" }
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

  return {
    setScrollSpin(value: number) {
      spinTarget = Math.max(0, value);
    },
    dispose() {
      disposed = true;
      stopLoop();
      io.disconnect();
      ro.disconnect();
      group.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (!mesh.isMesh) return;
        mesh.geometry?.dispose?.();
        const mat = mesh.material as THREE.MeshStandardMaterial | undefined;
        mat?.dispose?.();
      });
      draco.dispose();
      hdrEnv?.dispose();
      studioEnv.dispose();
      pmrem.dispose();
      renderer.dispose();
      dom.remove();
    },
  };
}

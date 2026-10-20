import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

export type CivilizationKey = "egypt" | "babylon" | "greece" | "china";

const CIV_MATERIALS: Record<CivilizationKey, { color: number; roughness: number; metalness: number }> = {
  egypt: { color: 0xcd9e61, roughness: 0.35, metalness: 0.7 },
  babylon: { color: 0xb07a4a, roughness: 0.5, metalness: 0.5 },
  greece: { color: 0xe8e2d4, roughness: 0.75, metalness: 0.1 },
  china: { color: 0x7fa3c4, roughness: 0.55, metalness: 0.2 },
};

export function createStoryBottleScene(container: HTMLElement) {
  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(dpr);
  renderer.setSize(width, height);
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  renderer.domElement.style.display = "block";
  renderer.domElement.style.pointerEvents = "none";
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
  camera.position.set(0, 0, 4);
  camera.lookAt(0, 0, 0);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const tilt = new THREE.Group();
  tilt.rotation.z = -Math.PI / 4;
  scene.add(tilt);
  const spin = new THREE.Group();
  tilt.add(spin);

  const bottleMats: THREE.MeshStandardMaterial[] = [];

  const applyMaterial = (key: CivilizationKey) => {
    const c = CIV_MATERIALS[key];
    for (const mat of bottleMats) {
      mat.color.setHex(c.color);
      mat.roughness = c.roughness;
      mat.metalness = c.metalness;
      mat.envMap = env;
      mat.envMapIntensity = 0.7;
      mat.needsUpdate = true;
    }
  };

  let ready = false;
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  const gltfLoader = new GLTFLoader();
  gltfLoader.setDRACOLoader(dracoLoader);
  gltfLoader.load(
    "/models/bottle-mid.glb",
    (gltf) => {
      const bottle = gltf.scene;
      bottle.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (!mesh.isMesh) return;
        if (!mesh.geometry.getAttribute("normal")) mesh.geometry.computeVertexNormals();
        const mat = mesh.material as THREE.MeshStandardMaterial | undefined;
        if (!mat) return;
        mat.envMap = env;
        mat.envMapIntensity = 0.7;
        mat.needsUpdate = true;
        bottleMats.push(mat);
      });
      const bbox = new THREE.Box3().setFromObject(bottle);
      const center = bbox.getCenter(new THREE.Vector3());
      const size = bbox.getSize(new THREE.Vector3());
      bottle.position.sub(center);
      const visibleH = 2 * 4 * Math.tan((35 * Math.PI) / 360);
      const tiltedExtent = (size.x + size.y) * Math.SQRT1_2 || 1;
      bottle.scale.setScalar((visibleH * 0.8) / tiltedExtent);
      spin.add(bottle);
      ready = true;
      applyMaterial("egypt");
    }
  );

  let idle = 0;
  let raf = 0;
  const animate = () => {
    raf = requestAnimationFrame(animate);
    if (!ready) return;
    idle += 0.002;
    spin.rotation.y = idle;
    renderer.render(scene, camera);
  };
  animate();

  const resize = () => {
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(container);

  return {
    setMaterial: applyMaterial,
    dispose() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}

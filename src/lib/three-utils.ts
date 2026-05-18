import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  AmbientLight,
  PointLight,
  NoToneMapping,
  MeshStandardMaterial,
} from 'three';

// ── Cached checks ──

let _reducedMotion: boolean | null = null;
export function prefersReducedMotion(): boolean {
  if (_reducedMotion === null) {
    _reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  return _reducedMotion;
}

export function isMobile(): boolean {
  return window.innerWidth < 768;
}

// ── Renderer factory ──

export function createRenderer(canvas: HTMLCanvasElement): WebGLRenderer {
  const renderer = new WebGLRenderer({
    canvas,
    alpha: true,
    antialias: !isMobile(),
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = NoToneMapping;
  return renderer;
}

// ── Resize handler ──

export function setupResize(
  renderer: WebGLRenderer,
  camera: PerspectiveCamera,
  container: HTMLElement
): () => void {
  const onResize = () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };

  const observer = new ResizeObserver(onResize);
  observer.observe(container);
  onResize();

  return () => observer.disconnect();
}

// ── Visibility controller ──

export function createVisibilityController(
  onVisible: () => void,
  onHidden: () => void
): { dispose: () => void } {
  const handler = () => {
    if (document.hidden) onHidden();
    else onVisible();
  };
  document.addEventListener('visibilitychange', handler);
  return {
    dispose: () => document.removeEventListener('visibilitychange', handler),
  };
}

// ── Lights ──

export function createAmbientLight(color: number, intensity: number): AmbientLight {
  return new AmbientLight(color, intensity);
}

export function createPointLight(
  color: number,
  intensity: number,
  distance: number,
  x = 0,
  y = 0,
  z = 0
): PointLight {
  const light = new PointLight(color, intensity, distance);
  light.position.set(x, y, z);
  return light;
}

// ── Fallout-themed material ──

export function createGreenPhosphorMaterial(intensity = 0.3): MeshStandardMaterial {
  return new MeshStandardMaterial({
    color: 0x00ff41,
    emissive: 0x00ff41,
    emissiveIntensity: intensity,
    roughness: 0.3,
    metalness: 0.2,
  });
}

// ── Disposal ──

export function disposeScene(scene: Scene): void {
  scene.traverse((obj) => {
    const mesh = obj as any;
    if (mesh.geometry) mesh.geometry.dispose();
    if (mesh.material) {
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((m: any) => m.dispose());
      } else {
        mesh.material.dispose();
      }
    }
  });
}

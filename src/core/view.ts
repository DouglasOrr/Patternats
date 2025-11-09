import * as G from "./game";
import * as THREE from "three";

export function start(game: G.Game): void {
  new Renderer(
    game,
    document.getElementById("canvas-main") as HTMLCanvasElement
  );
}

class Renderer {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene: THREE.Scene;
  private readonly camera: THREE.OrthographicCamera;
  private lastTime: number | null = null;

  constructor(game: G.Game, canvas: HTMLCanvasElement) {
    void game; // TODO

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.camera = new THREE.OrthographicCamera();
    this.camera.near = 0.1;
    this.camera.far = 1000;
    this.camera.position.z = 10;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(
      getComputedStyle(document.body).backgroundColor
    );
    this.onResize();
    window.addEventListener("resize", this.onResize.bind(this));
    requestAnimationFrame(this.onAnimate.bind(this));

    // Dummy content
    const w = window.innerWidth;
    const h = window.innerHeight;
    const planeGeometry = new THREE.PlaneGeometry(w / 4, h / 4);
    const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.set(w / 2, h / 2, 0);
    this.scene.add(plane);
  }

  private onResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(w, h, false);
    this.camera.left = 0;
    this.camera.right = w;
    this.camera.top = h;
    this.camera.bottom = 0;
    this.camera.updateProjectionMatrix();
  }

  private onAnimate(time: number) {
    if (this.lastTime === null) {
      this.lastTime = time;
    }
    // const dt = (time - this.lastTime) / 1000;
    this.lastTime = time;
    // TODO - update animations
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.onAnimate.bind(this));
  }
}

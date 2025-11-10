import * as G from "./game";
import * as THREE from "three";

export function start(game: G.Game): void {
  new Renderer(
    game,
    document.getElementById("canvas-main") as HTMLCanvasElement
  );
}

type Box = { left: number; right: number; bottom: number; top: number };

class Logger {
  private trigger: boolean = false;
  constructor() {
    window.addEventListener("click", () => {
      this.trigger = true;
    });
  }
  log(...args: any[]) {
    if (this.trigger) {
      console.log(...args);
    }
  }
  tick() {
    this.trigger = false;
  }
}
const LOG = new Logger();

class GridView {
  private readonly mesh: THREE.InstancedMesh;
  private readonly frameAttr: THREE.InstancedBufferAttribute;

  constructor(private readonly game: G.Game, scene: THREE.Scene) {
    const texture = new THREE.TextureLoader().load("img/cells.png");
    const material = new THREE.ShaderMaterial({
      uniforms: {
        map: { value: texture },
      },
      vertexShader: `
        attribute float tile;
        varying float vTile;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vTile = tile;
          gl_Position = projectionMatrix * viewMatrix * instanceMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D map;
        varying vec2 vUv;
        varying float vTile;
        void main() {
          vec2 uv = vUv;
          uv.y = uv.y / 3.0 + vTile;
          vec4 c = texture2D(map, uv);
          if (c.a < 0.01) discard;
          gl_FragColor = c;
        }
      `,
      transparent: true,
    });
    this.mesh = new THREE.InstancedMesh(
      new THREE.PlaneGeometry(1, 1),
      material,
      game.grid.cells.length
    );
    this.frameAttr = new THREE.InstancedBufferAttribute(
      new Float32Array(this.mesh.count).fill(0),
      /*itemSize*/ 1
    );
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.mesh.geometry.setAttribute("tile", this.frameAttr);
    scene.add(this.mesh);
  }

  // Update instance matrices to match layout.grid and the current game.grid
  update(bounds: Box): void {
    const grid = this.game.grid;
    const cellSize = Math.min(
      (bounds.right - bounds.left) / grid.cols,
      (bounds.top - bounds.bottom) / grid.rows
    );

    const frameArr = this.frameAttr.array as Float32Array;
    const mat = new THREE.Matrix4();
    const pos = new THREE.Vector3();
    const scale = new THREE.Vector3(cellSize, cellSize, 1);
    for (let i = 0; i < grid.cells.length; i++) {
      // Position
      const row = Math.floor(i / grid.cols);
      const col = i % grid.cols;
      const x = bounds.left + (col + 0.5) * cellSize;
      const y = bounds.bottom + (row + 0.5) * cellSize;
      mat.compose(pos.set(x, y, 0), new THREE.Quaternion(), scale);
      this.mesh.setMatrixAt(i, mat);

      // Frame
      const cell = grid.cells[i];
      switch (cell) {
        case G.Cell.O:
          frameArr[i] = 2 / 3;
          break;
        case G.Cell.X:
          frameArr[i] = 1 / 3;
          break;
        case G.Cell.W:
          frameArr[i] = 0 / 3;
          break;
      }
    }
    this.mesh.instanceMatrix.needsUpdate = true;
    this.frameAttr.needsUpdate = true;
  }
}

class Renderer {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene: THREE.Scene;
  private readonly camera: THREE.OrthographicCamera;
  private lastTime: number | null = null;

  private readonly gridView: GridView;

  constructor(private readonly game: G.Game, canvas: HTMLCanvasElement) {
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

    // Views
    this.gridView = new GridView(this.game, this.scene);
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
    // Preamble
    if (this.lastTime === null) {
      this.lastTime = time;
    }
    // const dt = (time - this.lastTime) / 1000; // TODO: animate
    this.lastTime = time;

    // Update views
    const layout = this.topLevelLayout();
    this.gridView.update(layout.grid);

    // Render
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.onAnimate.bind(this));
    LOG.tick();
  }

  private topLevelLayout(): { grid: Box; panel: Box } {
    const w = this.camera.right - this.camera.left;
    const h = this.camera.top - this.camera.bottom;
    const pad = 0.02 * w;
    const panelW = 0.3 * w;
    const gridSize = Math.min(h - 2 * pad, w - panelW - 3 * pad);
    const y = h / 2 - gridSize / 2;
    return {
      grid: {
        left: pad,
        right: pad + gridSize,
        bottom: y,
        top: y + gridSize,
      },
      panel: {
        left: pad + gridSize + pad,
        right: pad + gridSize + pad + panelW,
        bottom: y,
        top: y + gridSize,
      },
    };
  }
}

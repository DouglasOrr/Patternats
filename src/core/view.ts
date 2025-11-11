import * as G from "./game";
import * as THREE from "three";

export function start(game: G.Game): void {
  new Renderer(
    game,
    document.getElementById("canvas-main") as HTMLCanvasElement
  );
}

// Utility

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

type Box = { left: number; right: number; bottom: number; top: number };

function backgroundColor(): THREE.Color {
  return new THREE.Color(getComputedStyle(document.body).backgroundColor);
}

// Views

class InstancedSpriteSheet {
  private readonly mesh: THREE.InstancedMesh;
  private readonly tileAttr: THREE.InstancedBufferAttribute;
  private readonly tileArray: Float32Array;
  private readonly tintAttr: THREE.InstancedBufferAttribute;
  private readonly tintArray: Float32Array;

  // Temporaries
  private readonly mat = new THREE.Matrix4();
  private readonly pos = new THREE.Vector3();
  private readonly quat = new THREE.Quaternion();
  private readonly scale = new THREE.Vector3();

  constructor(
    texturePath: string,
    tiles: [number, number],
    instanceCount: number,
    scene: THREE.Scene
  ) {
    const material = new THREE.ShaderMaterial({
      uniforms: {
        tex: {
          value: new THREE.TextureLoader().load(
            texturePath,
            undefined,
            undefined,
            (err) => console.error(`Error loading texture ${texturePath}`, err)
          ),
        },
        texTiles: { value: new THREE.Vector2(tiles[0], tiles[1]) },
      },
      vertexShader: `
        attribute vec2 tile;
        attribute vec3 tint;
        uniform vec2 texTiles;

        varying vec2 vUv;
        varying vec3 vTint;

        void main() {
          vUv = (uv + tile) / texTiles;
          vTint = tint;
          gl_Position = projectionMatrix * viewMatrix * instanceMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tex;
        varying vec2 vUv;
        varying vec3 vTint;
        void main() {
          vec4 c = texture2D(tex, vUv);
          if (c.a < 0.01) discard;
          gl_FragColor = vec4(c.rgb * vTint, c.a);
        }
      `,
      transparent: true,
    });
    this.mesh = new THREE.InstancedMesh(
      new THREE.PlaneGeometry(1, 1),
      material,
      instanceCount
    );
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    this.tileArray = new Float32Array(2 * this.mesh.count).fill(0);
    this.tileAttr = new THREE.InstancedBufferAttribute(this.tileArray, 2);
    this.tileAttr.setUsage(THREE.DynamicDrawUsage);
    this.mesh.geometry.setAttribute("tile", this.tileAttr);

    this.tintArray = new Float32Array(3 * this.mesh.count).fill(1);
    this.tintAttr = new THREE.InstancedBufferAttribute(this.tintArray, 3);
    this.tintAttr.setUsage(THREE.DynamicDrawUsage);
    this.mesh.geometry.setAttribute("tint", this.tintAttr);

    scene.add(this.mesh);
  }

  get instanceCount(): number {
    return this.mesh.count;
  }

  update(
    index: number,
    pos: [number, number],
    scale: [number, number],
    rot: number,
    tile: [number, number],
    tint: [number, number, number]
  ): void {
    this.mat.compose(
      this.pos.set(pos[0], pos[1], 0),
      this.quat.setFromAxisAngle(new THREE.Vector3(0, 0, -1), rot),
      this.scale.set(scale[0], scale[1], 1)
    );
    this.mesh.setMatrixAt(index, this.mat);
    this.tileArray[index * 2] = tile[0];
    this.tileArray[index * 2 + 1] = tile[1];
    this.tintArray[index * 3] = tint[0];
    this.tintArray[index * 3 + 1] = tint[1];
    this.tintArray[index * 3 + 2] = tint[2];
    this.mesh.instanceMatrix.needsUpdate = true;
    this.tileAttr.needsUpdate = true;
    this.tintAttr.needsUpdate = true;
  }
}

class GridView {
  private readonly cells: InstancedSpriteSheet;
  private readonly carets: InstancedSpriteSheet;

  constructor(private readonly game: G.Game, scene: THREE.Scene) {
    this.cells = new InstancedSpriteSheet(
      "img/cells.png",
      [1, 3],
      game.grid.cells.length,
      scene
    );
    this.carets = new InstancedSpriteSheet(
      "img/caret.png",
      [1, 1],
      2 * (game.grid.rows + game.grid.cols),
      scene
    );
  }

  // Update instance matrices to match layout.grid and the current game.grid
  update(bounds: Box): void {
    const markSizeRatio = 0.5;
    const caretColor: [number, number, number] = [0.3, 0.4, 0.3];

    const grid = this.game.grid;
    const cellSize = Math.min(
      (bounds.right - bounds.left) / (grid.cols + 2),
      (bounds.top - bounds.bottom) / (grid.rows + 2)
    );
    const markSize = markSizeRatio * cellSize;

    // Cells
    for (let i = 0; i < grid.cells.length; i++) {
      const row = Math.floor(i / grid.cols);
      const col = i % grid.cols;
      const x = bounds.left + (col + 1.5) * cellSize;
      const y = bounds.bottom + (row + 1.5) * cellSize;
      this.cells.update(
        i,
        /*pos*/ [x, y],
        /*scale*/ [markSize, markSize],
        /*rot*/ 0,
        /*tile*/ [0, 2 - grid.cells[i]],
        /*tint*/ [1, 1, 1]
      );
    }

    // Carets
    let caretIndex = 0;
    const addCaret = (row: number, col: number, rot: number) => {
      this.carets.update(
        caretIndex++,
        /*pos*/ [
          bounds.left + (col + 1.5) * cellSize,
          bounds.bottom + (row + 1.5) * cellSize,
        ],
        /*scale*/ [markSize, 0.5 * markSize],
        /*rot*/ rot,
        /*tile*/ [0, 0],
        /*tint*/ caretColor
      );
    };
    for (let i = 0; i < grid.cols; i++) {
      addCaret(-1, i, 0);
      addCaret(grid.rows, i, Math.PI);
    }
    for (let i = 0; i < grid.rows; i++) {
      addCaret(i, -1, Math.PI / 2);
      addCaret(i, grid.cols, -Math.PI / 2);
    }
  }
}

class ProgressView {
  private readonly outline: THREE.Mesh;
  private readonly background: THREE.Mesh;
  private readonly fill0: THREE.Mesh;
  private readonly fill1: THREE.Mesh;

  constructor(private readonly game: G.Game, scene: THREE.Scene) {
    this.outline = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({ color: 0x161616 })
    );
    this.background = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({ color: backgroundColor().getHex() })
    );
    this.fill0 = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({ color: 0x610003 })
    );
    this.fill1 = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({ color: 0xb37e1d })
    );
    this.outline.position.z = 0;
    this.background.position.z = 0.01;
    this.fill0.position.z = this.fill1.position.z = 0.02;
    scene.add(this.outline, this.background, this.fill0, this.fill1);
  }

  update(bounds: Box): void {
    // Basic layout
    const w = bounds.right - bounds.left;
    const h = 0.85 * (bounds.top - bounds.bottom);
    const inset = 0.2 * Math.min(w, h);
    const innerW = w - 2 * inset;
    const innerH = h - 2 * inset;
    const cx = (bounds.left + bounds.right) / 2;
    const cy = (bounds.bottom + bounds.top) / 2;

    // Progress
    const progress01 = Math.max(
      0,
      this.game.targetScore - this.game.roundScore
    );
    const progress0 = Math.max(0, progress01 - this.game.score.total);
    const h0 = (innerH * progress0) / this.game.targetScore;
    const h1 = (innerH * (progress01 - progress0)) / this.game.targetScore;

    // Set positions
    this.outline.position.set(cx, cy, this.outline.position.z);
    this.outline.scale.set(w, h, 1);
    this.background.position.set(cx, cy, this.background.position.z);
    this.background.scale.set(innerW, innerH, 1);
    this.fill0.position.set(
      cx,
      cy - innerH / 2 + h0 / 2,
      this.fill0.position.z
    );
    this.fill0.scale.set(innerW, h0, 1);
    this.fill1.position.set(
      cx,
      cy - innerH / 2 + h0 + h1 / 2,
      this.fill1.position.z
    );
    this.fill1.scale.set(innerW, h1, 1);
  }
}

// Core rendering

class Renderer {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene: THREE.Scene;
  private readonly camera: THREE.OrthographicCamera;
  private lastTime: number | null = null;

  private readonly gridView: GridView;
  private readonly progressView: ProgressView;

  constructor(private readonly game: G.Game, canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.camera = new THREE.OrthographicCamera();
    this.camera.near = 0.1;
    this.camera.far = 1000;
    this.camera.position.z = 10;
    this.scene = new THREE.Scene();
    this.scene.background = backgroundColor();
    this.onResize();
    window.addEventListener("resize", this.onResize.bind(this));
    requestAnimationFrame(this.onAnimate.bind(this));

    // Views
    this.gridView = new GridView(this.game, this.scene);
    this.progressView = new ProgressView(this.game, this.scene);

    // Keyboard controls
    window.addEventListener("keydown", (e) => {
      if (e.key === " ") {
        e.preventDefault();
        this.game.submit();
      }
    });
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
    this.progressView.update(layout.progress);

    // Render
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.onAnimate.bind(this));
    LOG.tick();
  }

  private topLevelLayout(): { grid: Box; progress: Box; panel: Box } {
    const w = this.camera.right - this.camera.left;
    const h = this.camera.top - this.camera.bottom;
    const pad = 0.02 * w;
    const panelW = 0.25 * w;
    const progressW = Math.min(0.03 * w, 0.03 * (h - 2 * pad));
    const gridSize = Math.min(h - 2 * pad, w - panelW - progressW - 4 * pad);
    const y = h / 2 - gridSize / 2;
    return {
      grid: {
        left: pad,
        right: pad + gridSize,
        bottom: y,
        top: y + gridSize,
      },
      progress: {
        left: pad + gridSize + pad,
        right: pad + gridSize + pad + progressW,
        bottom: y,
        top: y + gridSize,
      },
      panel: {
        left: pad + gridSize + pad + progressW + pad,
        right: pad + gridSize + pad + progressW + pad + panelW,
        bottom: y,
        top: y + gridSize,
      },
    };
  }
}

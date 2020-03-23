const THREE = global.THREE;
const OrbitControls = require("three-orbit-controls")(THREE);
const loadFont = require("load-bmfont");
const createText = require("three-bmfont-text");
const MSDFShader = require("three-bmfont-text/shaders/msdf");



// Nice colors
const colors = require("nice-color-palettes");
const palette = colors[20];
const background = palette[0];
const fontColor = parseInt(palette[2].replace("#", "0x"));

export default class WebGLFont {
  constructor(opts = {}) {
    // Options obj
    this.options = opts;

    const {
      scene,
      camera,
      renderer,
      zoom,
      // pos,
      // rot,
      // vert,
      // frag
    } = opts

    // Variables
    // this.vars = {
    //   word: this.options.word,
    //   position: [...this.options.position],
    //   rotation: [...this.options.rotation],
    //   zoom: this.options.zoom,
    //   vertex: this.options.vertex,
    //   fragment: this.options.fragment
    // };

    // Scene
    this.scene = scene;

    // Camera
    this.camera = camera;
    this.camera.position.z = zoom;

    // Renderer
    this.renderer = renderer;
    this.renderer.setClearColor(background);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    // Clock
    this.clock = new THREE.Clock();

    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    // Load font files to initialize renderer
    this.loadBMF();
  }

  loadBMF() {
    // Create geometry of packed glyphs
    const self = this;
    const text = this.options.text;
    loadFont(this.options.fontFile, function (err, font) {
      console.log({text})
      self.geometry = createText({
        font,
        text,
        width: 300,
      });
    });

    // Load texture containing font glyphs
    this.loader = new THREE.TextureLoader();
    this.loader.load(this.options.fontAtlas, texture => {
      setTimeout(() => {
        this.init(this.geometry, texture);
        this.animate();
      }, 1); //1500);
    });
  }

  init(geometry, texture) {
    this.createMesh(geometry, texture);
    this.onResize();
    window.addEventListener("resize", () => this.onResize(), false);
    this.render();
  }

  createMesh(geometry, texture) {
    // Material
    this.material = new THREE.RawShaderMaterial(
      MSDFShader({
        vertexShader: this.options.vert,
        // fragmentShader: this.options.frag,
        color: fontColor,
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        negate: false
      })
    );

    // Create time variable from prestablished shader uniforms
    this.material.uniforms.time = { type: "f", value: 0.0 };

    // Mesh
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.mesh.position.set(...this.options.pos);
    this.mesh.rotation.set(...this.options.rot);
    this.scene.add(this.mesh);
  }

  onResize() {
    let w = window.innerWidth;
    let h = window.innerHeight;

    w < 640
      ? (this.camera.position.z = 250)
      : (this.camera.position.z = this.options.zoom);

    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(w, h);
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.render();
  }

  render() {
    // Update time uniform
    this.mesh.material.uniforms.time.value = this.clock.getElapsedTime();
    this.mesh.material.uniformsNeedUpdate = true;

    this.renderer.render(this.scene, this.camera);
  }
}


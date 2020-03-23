
// import "./styles.css";
import WebGLFont from "./components/WebGLFont/WebGLFont.mjs";
import { shaders } from "./components/WebGLFont/shaders.mjs";

const w = window.innerWidth;
const h = window.innerHeight
const aspect = w / h;

const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(
//   75, // fov — Camera frustum vertical field of view.
//   aspect, // aspect — Camera frustum aspect ratio.
//   0.1, // near — Camera frustum near plane.
//   5000 // far — Camera frustum far plane.
// );
const cam_ortho = new THREE.OrthographicCamera (
  -w>>1,// left — Camera frustum left plane.
  w>>1,// right — Camera frustum right plane.
  h>>1,// top — Camera frustum top plane.
  -h>>1,// bottom — Camera frustum bottom plane.
  1,// near — Camera frustum near plane.
  1000,// far — Camera frustum far plane.
)
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#app"),
  antialias: true
});

const fontFile = `${__dirname}/src/assets/Lato-Black.fnt` //"/usr/local/d4/aether/ui/pkg/three-txt/src/assets/Lato-Black.fnt";
const fontAtlas = `${__dirname}/src/assets/Lato-Black.png` //"/usr/local/d4/aether/ui/pkg/three-txt/src/assets/Lato-Black.png";

const type = new WebGLFont({
  scene,
  camera:cam_ortho,
  renderer,

  fontFile, fontAtlas,

  zoom: 1000,
  text: "Carl \n Chouiard asdlfkja sdfllja slkdjf",
  pos: [-62.5, -10, 0],
  rot: [Math.PI, 0, 0],
  vert: shaders[2].vertex,
  frag: shaders[2].fragment
});

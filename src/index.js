import "./styles.css";
import WebGLFont from "./components/WebGLFont/WebGLFont";
import { shaders } from "./components/WebGLFont/shaders";

const type = new WebGLFont({
  word: "FLUID",
  position: [-62.5, -10, 0],
  rotation: [Math.PI, 0, 0],
  zoom: 100,
  vertex: shaders[2].vertex,
  fragment: shaders[2].fragment
});

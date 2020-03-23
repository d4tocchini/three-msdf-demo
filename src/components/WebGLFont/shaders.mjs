const vert_glsl = `
attribute vec2 uv;
attribute vec4 position;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
varying vec2 vUv;
uniform float time;

void main() {
  vUv = uv;
  vec3 p = vec3(position.x, position.y, position.z);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}`
// import vertex2 from "./vertex/demo-02.glsl";
// import vertex3 from "./vertex/demo-03.glsl";
// import vertex4 from "./vertex/demo-04.glsl";
// import vertex5 from "./vertex/demo-05.glsl";
// import vertex6 from "./vertex/demo-06.glsl";


const frag_glsl = `
#ifdef GL_OES_standard_derivatives
#extension GL_OES_standard_derivatives : enable
#endif

// Variable qualifiers that come with the shader
precision highp float;
uniform float opacity;
uniform vec3 color;
uniform sampler2D map;
varying vec2 vUv;
// We passed this one
uniform float time;

// HSL to RGB color conversion module
float hue2rgb(float f1, float f2, float hue) {
    if (hue < 0.0)
        hue += 1.0;
    else if (hue > 1.0)
        hue -= 1.0;
    float res;
    if ((6.0 * hue) < 1.0)
        res = f1 + (f2 - f1) * 6.0 * hue;
    else if ((2.0 * hue) < 1.0)
        res = f2;
    else if ((3.0 * hue) < 2.0)
        res = f1 + (f2 - f1) * ((2.0 / 3.0) - hue) * 6.0;
    else
        res = f1;
    return res;
}

vec3 hsl2rgb(vec3 hsl) {
    vec3 rgb;

    if (hsl.y == 0.0) {
        rgb = vec3(hsl.z); // Luminance
    } else {
        float f2;

        if (hsl.z < 0.5)
            f2 = hsl.z * (1.0 + hsl.y);
        else
            f2 = hsl.z + hsl.y - hsl.y * hsl.z;

        float f1 = 2.0 * hsl.z - f2;

        rgb.r = hue2rgb(f1, f2, hsl.x + (1.0/3.0));
        rgb.g = hue2rgb(f1, f2, hsl.x);
        rgb.b = hue2rgb(f1, f2, hsl.x - (1.0/3.0));
    }
    return rgb;
}

vec3 hsl2rgb(float h, float s, float l) {
    return hsl2rgb(vec3(h, s, l));
}

float median(float r, float g, float b) {
  return max(min(r, g), min(max(r, g), b));
}

void main() {
  // This is the code that comes to produce msdf
  vec3 sample = texture2D(map, vUv).rgb;
  float sigDist = median(sample.r, sample.g, sample.b) - 0.5;
  float alpha = clamp(sigDist/fwidth(sigDist) + 0.5, 0.0, 1.0);

  // Colors
  vec3 lightBlue = hsl2rgb(202.0 / 360.0, 1.0, 0.5);
  vec3 navyBlue = hsl2rgb(238.0 / 360.0, 0.47, 0.31);

  // Goes from 1.0 to 0.0 and vice versa
  float t = cos(time) * 0.5 + 0.5;

  // Interpolate from light to navy blue
  vec3 newColor = mix(lightBlue, navyBlue, t);

  gl_FragColor = vec4(newColor, alpha * opacity);
  if (gl_FragColor.a < 0.0001) discard;
}`
// import fragment2 from "./fragment/demo-02.glsl";
// import fragment3 from "./fragment/demo-03.glsl";
// import fragment4 from "./fragment/demo-04.glsl";
// import fragment5 from "./fragment/demo-05.glsl";
// import fragment6 from "./fragment/demo-06.glsl";

export const shaders = [
  { vertex: vert_glsl, fragment: frag_glsl },
  { vertex: vert_glsl, fragment: frag_glsl },
  { vertex: vert_glsl, fragment: frag_glsl },
  { vertex: vert_glsl, fragment: frag_glsl },
  { vertex: vert_glsl, fragment: frag_glsl },
  { vertex: vert_glsl, fragment: frag_glsl }
];


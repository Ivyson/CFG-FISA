const fsShader = `
precision mediump float;
varying vec3 color;
void main()
{
    gl_FragColor = vec4(color, 1.0);
}
`;
const vsShader = `
precision highp float;
attribute vec2 vecposition;
uniform mat4 rotatex;
uniform mat4 rotatey;
uniform mat4 rotatez;
void main()
{
    gl_Position = rotatex*rotatey*rotatez*vec4(vecposition,0.0, 1.0);
}
`;


export {fsShader, vsShader};
let webgl;
function createCanvas() {
  let canvas = document.querySelector("canvas");
  if (canvas == null) {
    canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
  }
  webgl = canvas.getContext("webgl");
  webgl.viewport(0, 0, canvas.width, canvas.height);
}
createCanvas();
function Buffer() {
  let buffer = webgl.createBuffer();
  webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
  webgl.bufferData(
    webgl.ARRAY_BUFFER,
    new Float32Array(vertices),
    webgl.STATIC_DRAW
  );
  const errors = webgl.getError();
  //if no errors present then webgl.getError() should return the same value as webgl.NO_ERROR
  if (errors !== webgl.NO_ERROR) {
    //There is an error with a buffer binding
    console.log("There was an error", errors);
    return null;
  }
  return buffer;
}
function compileShader(webgl, source, type) {
  const shader = webgl.createShader(type);
  webgl.shaderSource(shader, source);
  webgl.compileShader(shader);

  if (!webgl.getShaderParameter(shader, webgl.COMPILE_STATUS)) {
    console.error(`Error compiling shader: ${webgl.getShaderInfoLog(shader)}`);
    webgl.deleteShader(shader);
    return null;
  }

  return shader;
}
function createProgram(webgl, vertexShader, fragmentShader) {
  const program = webgl.createProgram();
  webgl.attachShader(program, vertexShader);
  webgl.attachShader(program, fragmentShader);
  webgl.linkProgram(program);

  if (!webgl.getProgramParameter(program, webgl.LINK_STATUS)) {
    console.error(`Error linking program: ${webgl.getProgramInfoLog(program)}`);
    webgl.deleteProgram(program);
    return null;
  }
  webgl.useProgram(program);
  return program;
}

let vertices = [0.0, 0.5, 0.5, -0.5, -0.5, -0.5];
let buffer = Buffer();
let vsShader = `
precision highp float;
attribute vec2 vecposition;
void main(){
gl_Position = vec4(vecposition, 1.0, 1.0);
gl_PointSize = 5.1;
}
`;

let fsShader = `
precision highp float;
void main(){
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`;
webgl.clearColor(0.8, 0.8, 0.1, 1);
webgl.clear(webgl.COLOR_BUFFER_BIT);
let vShader = compileShader(webgl, vsShader, webgl.VERTEX_SHADER);
let fShader = compileShader(webgl, fsShader, webgl.FRAGMENT_SHADER);
let program = createProgram(webgl, vShader, fShader);
let position = webgl.getAttribLocation(program, "vecposition");
console.log(position);
webgl.enableVertexAttribArray(position);
webgl.vertexAttribPointer(position, 2, webgl.FLOAT, false, 0, 0);
webgl.drawArrays(webgl.TRIANGLES, 0, 3);
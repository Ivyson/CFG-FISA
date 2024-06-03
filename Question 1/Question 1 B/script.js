/**
 *    Name: Samukelo Gift
 *    Surname: Msimanga
 *    S.Number: 223146145
 *    Date: 3 June 2024
 * 
 */
let vertices = new Float32Array([
  -0.5,
  -0.5, // Third Quadrant
  0.5,
  -0.5, // 4 quadrant
  0.5,
  0.5, //First Quadrant
  0.5,
  0.5, //First Quadrant
  -0.5,
  0.5, // 4 quadrant
  -0.5,
  -0.5, // Third Quadrant
]);
let Cverteces = new Float32Array([
  1.0, 0.0,  0.0, // Third Quadrant //Yellow
  0.0, 1, 0.0, // 4 quadrant 
  0, 0, 1.0, // First Quadrant
  0.0, 0.0, 1.0, //First Quadrant
  1.0, 1, 0.0, // 4 quadrant
  1.0, 0, 0.0, // Third Quadrant //Yellow
]);

let canvas = document.querySelector("canvas");
canvas.width = "700";
canvas.height = "500";
const webgl = canvas.getContext("webgl");

let buffer = webgl.createBuffer();
webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
webgl.bufferData(webgl.ARRAY_BUFFER, vertices, webgl.STATIC_DRAW);

let cbuffer = webgl.createBuffer();
webgl.bindBuffer(webgl.ARRAY_BUFFER, cbuffer);
webgl.bufferData(webgl.ARRAY_BUFFER, Cverteces, webgl.STATIC_DRAW);

let vShaderSrc, fShaderSrc;
fetch("vsShader.glsl")
  .then((response) => {
    if (response.ok) {
      // vShaderSrc =  response.text();
      console.log("success");
      return response.text();
    } else {
      console.error("There is an error loading a vs Shader File");
      vShaderSrc = vsShader; //
      return;
    }
  })
  .then((vertexShaderSource) => {
    let vShader = webgl.createShader(webgl.VERTEX_SHADER);
    webgl.shaderSource(vShader, vertexShaderSource);
    webgl.compileShader(vShader);
    if (!webgl.getShaderParameter(vShader, webgl.COMPILE_STATUS)) {
      console.log("error! ", webgl.getShaderInfoLog(vShader));
    }
    return fetch("fsShader.glsl")
      .then((response) => {
        if (response.ok) {
          // fsShader =  response.text();
          console.log("success");
          return response.text();
        }
      })
      .then((fragSource) => {
        let fShader = webgl.createShader(webgl.FRAGMENT_SHADER);
        webgl.shaderSource(fShader, fragSource);
        webgl.compileShader(fShader);
        if (!webgl.getShaderParameter(fShader, webgl.COMPILE_STATUS)) {
          console.log("error! ", webgl.getShaderInfoLog(fShader));
        }
        let program = webgl.createProgram();
        webgl.attachShader(program, vShader);
        webgl.attachShader(program, fShader);
        webgl.linkProgram(program);
        webgl.useProgram(program);
        if (!webgl.getProgramParameter(program, webgl.LINK_STATUS)) {
          console.log("error! ", webgl.getProgramInfoLog(program));
        }
        let Position = webgl.getAttribLocation(program, "vecposition");
        if (Position < 0) {
          console.log("Position is invalid");
        }
        let cPosition = webgl.getAttribLocation(program, "vcolor");
        if (cPosition < 0) {
          console.log("Position Color is invalid");
        }
        webgl.enableVertexAttribArray(cPosition);
        webgl.vertexAttribPointer(cPosition, 3, webgl.FLOAT, false, 0, 0);

        webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
        webgl.enableVertexAttribArray(Position);
        webgl.clearColor(0.8, 0.8, 0.1, 1.0);

        webgl.vertexAttribPointer(Position, 2, webgl.FLOAT, false, 0, 0);
        let theta = Math.PI;
        let angle = theta / 50;
        let aspectloc = webgl.getUniformLocation(program, 'aspect');
        function draw() {
          let aspect = canvas.width/canvas.height;
          webgl.uniform1f(aspectloc, aspect);
          webgl.clear(webgl.COLOR_BUFFER_BIT);
          webgl.drawArrays(webgl.TRIANGLES, 0, 6);
          window.requestAnimationFrame(draw);
        }
        draw();
      });
  });

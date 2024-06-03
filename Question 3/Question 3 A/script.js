/*
*   Name: Samukelo Gift 
*   Surname: Msimanga
*   S.Number: 223146145
*/



let canvas = document.querySelector('canvas');
let webgl = canvas.getContext('webgl');
// let image = document.querySelector('img');
let vertices = [
      // Front face
      0.5, 0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5,
      // Back face
      0.5, 0.5, -0.5, 0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5,
      // Top face
      0.5, 0.5, 0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5,
      // Bottom face
      0.5, -0.5, 0.5, 0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, 0.5,
      // Right face
       0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5,
      // Left face
     -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5,
];
let tVertices = [
    //Front Face
    1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0,
    //Back Face
    1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0,
    //Top Face
    1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0,
    //Bottom Face
    1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0,
    //Right Face
    1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0,
    //Left Face
    1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0,
];
let proto = new WebGLAssist(webgl, canvas);
let tBuffer = proto.createBuffer(tVertices);
let texture = proto.TextureInit(document.querySelector('img'));
let buffer = proto.createBuffer(vertices);
console.log(buffer);


let vsShader = `
precision mediump float;
attribute vec3 vecposition;
attribute vec2 vTexture;
varying vec2 fTexture;
uniform mat4 zmat;
void main()
{
    fTexture = vTexture;
    gl_Position = zmat*vec4(vecposition,1.0);
}
`;

let fsShader = `
    precision mediump float;
    varying vec2 fTexture;
    uniform sampler2D fsampler;
    void main(){
        gl_FragColor = texture2D(fsampler,fTexture);
    }

`;

let vShader = proto.compileShader(vsShader, webgl.VERTEX_SHADER);
let fShader = proto.compileShader(fsShader, webgl.FRAGMENT_SHADER);
let program = proto.createProgram(vShader, fShader);
console.log(program);
let position = proto.PositionInit(program, "vecposition",3);
console.log(position);
let phi = 0;
webgl.bindBuffer(webgl.ARRAY_BUFFER, tBuffer);
let tPos = proto.PositionInit(program, 'vTexture',2);
let zmatloc = webgl.getUniformLocation(program, 'zmat');
function animate(){
    let mat4 = proto.rotateZ(proto.createIdentityMatrix(),phi);
    mat4 = proto.rotateY(mat4, phi);
    webgl.clear(webgl.COLOR_BUFFER_BIT);
    webgl.uniformMatrix4fv(zmatloc, false, mat4);
    // phi += 0.01;
    for(let i = 0; i < 6; i++){
        webgl.drawArrays(webgl.TRIANGLE_FAN, i*4, 4);
    }

    requestAnimationFrame(animate);
}
animate();

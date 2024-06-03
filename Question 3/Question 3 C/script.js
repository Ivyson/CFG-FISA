let canvas = document.querySelector('canvas');
let webgl = canvas.getContext('webgl');

let shifty = 0, shiftx = 0;
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

eventlisteners();
let vsShader = `
precision mediump float;
attribute vec3 vecposition;
attribute vec2 vTexture;
varying vec2 fTexture;
uniform mat4 zmat;
uniform mat4 xmat;
uniform mat4 ymat;
uniform float shiftx;
uniform float shifty;
void main()
{
    fTexture = vTexture;
    gl_Position = zmat*ymat*xmat*vec4(vecposition.x+shiftx, vecposition.y + shifty, vecposition.z ,1.0);
}
`;

let fsShader = `
    precision mediump float;
    uniform vec3 color;
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
let phi = 0, theta = 0, angle = 0;
webgl.bindBuffer(webgl.ARRAY_BUFFER, tBuffer);
let tPos = proto.PositionInit(program, 'vTexture',2);
let zmatloc = webgl.getUniformLocation(program, 'zmat');
let xmatloc = webgl.getUniformLocation(program, 'xmat');
let ymatloc = webgl.getUniformLocation(program, 'ymat');
let color = webgl.getUniformLocation(program, 'color');
function animate(){
    let matx = proto.rotateX(proto.createIdentityMatrix(),theta);
    let maty = proto.rotateY(proto.createIdentityMatrix(),angle);
    webgl.uniform1f(webgl.getUniformLocation(program, 'shiftx'), shiftx);
    webgl.uniform1f(webgl.getUniformLocation(program, 'shifty'), shifty);
    let mat4 = proto.rotateZ(proto.createIdentityMatrix(),phi);
    webgl.clear(webgl.COLOR_BUFFER_BIT);
    webgl.uniformMatrix4fv(zmatloc, false, mat4);
    webgl.uniformMatrix4fv(xmatloc, false, matx);
    webgl.uniformMatrix4fv(ymatloc, false, maty);
    // phi += 0.01;
    for(let i = 0; i < 6; i++){
        webgl.drawArrays(webgl.TRIANGLE_FAN, i*4, 4);
    }

    requestAnimationFrame(animate);
}
animate();
//Add event Listeners for buttons

function eventlisteners(){
    let buttons = document.querySelectorAll('button');
   buttons[0].addEventListener('click', (event) => { //Up
    if(shifty < 0.5){
        shifty += 0.1; 
    } 
        console.log(shifty);
   })
   buttons[1].addEventListener('click', (event) => { //Down
    if(shifty > -0.5){
        shifty -= 0.1; 
    } 
    console.log(shifty);
})
buttons[2].addEventListener('click', (event) => { //Left
    if(shiftx > -0.5){
        shiftx -= 0.1; 
    } 
    console.log(shiftx);
})
buttons[3].addEventListener('click', (event) => { //Right
    if(shiftx < 0.5){
        shiftx += 0.1; 
    }  
    console.log(shiftx);
})
document.addEventListener('keydown', (event) => {
    if(event.key == 'x')
    {
        theta += 0.05;
    }
    if(event.key == 'y')
    {
        angle += 0.05;
    }
    if(event.key == 'z')
    {
        phi += 0.05;
    }

})

}
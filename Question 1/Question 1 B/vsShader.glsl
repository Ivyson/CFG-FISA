precision highp float;
attribute vec2 vecposition;

attribute vec3 vcolor;
uniform float aspect;
varying vec3 color;
void main()
{
    color = vcolor;
    gl_Position = vec4(vecposition.x,vecposition.y*aspect,0.0, 1.0);
}
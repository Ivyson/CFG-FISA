/*
*   Name: Samukelo Gift 
*   Surname: Msimanga
*   S.Number: 223146145
*/ 
function multiplyMatrices(matrix1, matrix2) {
let result = []; 
for (let i = 0; i < 4; i++) {
for (let j = 0; j < 4; j++) {
 let sum = 0;
for (let k = 0; k < 4; k++) {
sum += matrix1[i * 4 + k] * matrix2[k * 4 + j];
 }
result.push(sum);
};
};
return result;
}
function rotateX(matrix, angle) {
const sinAngle = Math.sin(angle);
const cosAngle = Math.cos(angle);
 return multiplyMatrices(matrix, [
1, 0, 0, 0,
0, cosAngle, -sinAngle, 0,
0, sinAngle, cosAngle, 0,
0, 0, 0, 1,
0, 0, 0, 1
]);}

let mat1 = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
    ];
let mat2 = rotateX(mat1, 60);
console.log(mat2); //Working
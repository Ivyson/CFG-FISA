class WebGLAssist {
    constructor(webgl, canvas) {
        this.canvas = canvas || document.createElement('canvas');
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            document.body.appendChild(this.canvas);
        }
        this.webgl = webgl || this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
        this.createCanvas();
        if (!this.webgl) {
            throw new Error('No WebGL is supported here');
        }
        this.webgl.clearColor(0.0, 1.0, 0, 1);
        this.webgl.clear(this.webgl.COLOR_BUFFER_BIT || this.webgl.DEPTH_BUFFER_BIT);
    }
    createCanvas() {
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '50%';
        this.canvas.style.left = '50%';
        this.canvas.style.transform = 'translate(-50%, -50%)';
        this.canvas.style.height = '30vw';
        this.canvas.style.width = '30vw';
        this.canvas.style.backgroundColor = 'yellow';
        this.webgl.viewport(0, 0, this.canvas.width, this.canvas.height);
        this.webgl.enable(this.webgl.DEPTH_TEST);
    }
    createBuffer(vertices) {
        let buffer = this.webgl.createBuffer();
        this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER, buffer);
        this.webgl.bufferData(this.webgl.ARRAY_BUFFER, new Float32Array(vertices), this.webgl.STATIC_DRAW);
        const errors = this.webgl.getError();
        if (errors !== this.webgl.NO_ERROR) {
            console.error('There was an error:', errors);
            return null;
        }
        return buffer;
    }
    compileShader(source, type) {
        const shader = this.webgl.createShader(type);
        this.webgl.shaderSource(shader, source);
        this.webgl.compileShader(shader);
        if (!this.webgl.getShaderParameter(shader, this.webgl.COMPILE_STATUS)) {
            console.error(`Error compiling shader: ${this.webgl.getShaderInfoLog(shader)}`);
            this.webgl.deleteShader(shader);
            return null;
        }
        return shader;
    }
    createProgram(vertexShader, fragmentShader) {
        const program = this.webgl.createProgram();
        this.webgl.attachShader(program, vertexShader);
        this.webgl.attachShader(program, fragmentShader);
        this.webgl.linkProgram(program);
        if (!this.webgl.getProgramParameter(program, this.webgl.LINK_STATUS)) {
            console.error(`Error linking program: ${this.webgl.getProgramInfoLog(program)}`);
            this.webgl.deleteProgram(program);
            return null;
        }
        this.webgl.useProgram(program);
        return program;
    }
    PositionInit(program, name, ofsize) {
        let position = this.webgl.getAttribLocation(program, name);
        this.webgl.enableVertexAttribArray(position);
        this.webgl.vertexAttribPointer(position, ofsize, this.webgl.FLOAT, false, 0, 0);
        return position;
    }
    rotateX(matrix, angle) {
        const sinAngle = Math.sin(angle);
        const cosAngle = Math.cos(angle);
        return this.multiplyMatrices(matrix, [
            1, 0, 0, 0,
            0, cosAngle, -sinAngle, 0,
            0, sinAngle, cosAngle, 0,
            0, 0, 0, 1
        ]);
    }
    rotateY(matrix, angle) {
        const sinAngle = Math.sin(angle);
        const cosAngle = Math.cos(angle);
        return this.multiplyMatrices(matrix, [
            cosAngle, 0, sinAngle, 0,
            0, 1, 0, 0,
            -sinAngle, 0, cosAngle, 0,
            0, 0, 0, 1
        ]);
    }
    rotateZ(matrix, angle) {
        const sinAngle = Math.sin(angle);
        const cosAngle = Math.cos(angle);
        return this.multiplyMatrices(matrix, [
            cosAngle, -sinAngle, 0, 0,
            sinAngle, cosAngle, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
    }
    multiplyMatrices(matrix1, matrix2) {
        let result = new Float32Array(16);
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                result[i * 4 + j] = 0;
                for (let k = 0; k < 4; k++) {
                    result[i * 4 + j] += matrix1[i * 4 + k] * matrix2[k * 4 + j];
                }
            }
        }
        return result;
    }
    createIdentityMatrix() {
        return new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
    }
    isPowerOfTwo(value) {
        return (value & (value - 1)) === 0;
    }
    TextureInit(image) {
        let texture = this.webgl.createTexture();
        this.webgl.bindTexture(this.webgl.TEXTURE_2D, texture);
        if (this.isPowerOfTwo(image.width) && this.isPowerOfTwo(image.height)) {
            this.webgl.generateMipmap(this.webgl.TEXTURE_2D);
        } else {
            this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_WRAP_S, this.webgl.CLAMP_TO_EDGE);
            this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_WRAP_T, this.webgl.CLAMP_TO_EDGE);
            this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MAG_FILTER, this.webgl.LINEAR);
            this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MIN_FILTER, this.webgl.LINEAR);
        }
        this.webgl.texImage2D(this.webgl.TEXTURE_2D, 0, this.webgl.RGBA, this.webgl.RGBA, this.webgl.UNSIGNED_BYTE, image);
        return texture;
    }
}
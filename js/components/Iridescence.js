/**
 * Iridescence - WebGL Shader Effect
 * Vanilla JavaScript implementation (non-React)
 */

class Iridescence {
  constructor(options = {}) {
    this.container = options.container;
    this.color = options.color || [0.06274509803921569, 0.7254901960784313, 0.5058823529411764];
    this.mouseReact = options.mouseReact !== false;
    this.amplitude = options.amplitude || 0.1;
    this.speed = options.speed || 1;
    
    this.mousePos = { x: 0.5, y: 0.5 };
    this.animateId = null;
    this.gl = null;
    this.program = null;
    this.mesh = null;
    
    if (this.container) {
      this.init();
    }
  }

  init() {
    const canvas = document.createElement('canvas');
    this.gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!this.gl) {
      console.error('WebGL not supported');
      return;
    }

    this.container.appendChild(canvas);
    this.gl.clearColor(1, 1, 1, 1);

    const vertexShader = this.createShader(this.gl.VERTEX_SHADER, `
      attribute vec2 uv;
      attribute vec2 position;

      varying vec2 vUv;

      void main() {
        vUv = uv;
        gl_Position = vec4(position, 0, 1);
      }
    `);

    const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, `
      precision highp float;

      uniform float uTime;
      uniform vec3 uColor;
      uniform vec3 uResolution;
      uniform vec2 uMouse;
      uniform float uAmplitude;
      uniform float uSpeed;

      varying vec2 vUv;

      void main() {
        float mr = min(uResolution.x, uResolution.y);
        vec2 uv = (vUv.xy * 2.0 - 1.0) * uResolution.xy / mr;

        uv += (uMouse - vec2(0.5)) * uAmplitude;

        float d = -uTime * 0.5 * uSpeed;
        float a = 0.0;
        for (float i = 0.0; i < 8.0; ++i) {
          a += cos(i - d - a * uv.x);
          d += sin(uv.y * i + a);
        }
        d += uTime * 0.5 * uSpeed;
        vec3 col = vec3(cos(uv * vec2(d, a)) * 0.6 + 0.4, cos(a + d) * 0.5 + 0.5);
        col = cos(col * cos(vec3(d, a, 2.5)) * 0.5 + 0.5) * uColor;
        gl_FragColor = vec4(col, 1.0);
      }
    `);

    this.program = this.createProgram(this.gl, vertexShader, fragmentShader);
    
    this.setupGeometry();
    this.resize();
    this.setupEventListeners();
    this.animate();
  }

  createShader(type, source) {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return null;
    }

    return program;
  }

  setupGeometry() {
    const positions = new Float32Array([
      -1, -1,
      1, -1,
      -1, 1,
      1, 1
    ]);

    const uvs = new Float32Array([
      0, 0,
      1, 0,
      0, 1,
      1, 1
    ]);

    const posBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, posBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);

    const uvBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, uvBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, uvs, this.gl.STATIC_DRAW);

    const posLocation = this.gl.getAttribLocation(this.program, 'position');
    const uvLocation = this.gl.getAttribLocation(this.program, 'uv');

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, posBuffer);
    this.gl.enableVertexAttribArray(posLocation);
    this.gl.vertexAttribPointer(posLocation, 2, this.gl.FLOAT, false, 0, 0);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, uvBuffer);
    this.gl.enableVertexAttribArray(uvLocation);
    this.gl.vertexAttribPointer(uvLocation, 2, this.gl.FLOAT, false, 0, 0);
  }

  resize() {
    const canvas = this.gl.canvas;
    canvas.width = this.container.offsetWidth;
    canvas.height = this.container.offsetHeight;

    this.gl.viewport(0, 0, canvas.width, canvas.height);

    const uResolutionLoc = this.gl.getUniformLocation(this.program, 'uResolution');
    this.gl.uniform3f(uResolutionLoc, canvas.width, canvas.height, canvas.width / canvas.height);
  }

  setupEventListeners() {
    window.addEventListener('resize', () => this.resize());

    if (this.mouseReact && this.container) {
      this.container.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    }
  }

  handleMouseMove(e) {
    const rect = this.container.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = 1.0 - (e.clientY - rect.top) / rect.height;
    this.mousePos = { x, y };

    const uMouseLoc = this.gl.getUniformLocation(this.program, 'uMouse');
    this.gl.uniform2f(uMouseLoc, x, y);
  }

  animate = () => {
    this.animateId = requestAnimationFrame(this.animate);

    this.gl.useProgram(this.program);

    const uTimeLoc = this.gl.getUniformLocation(this.program, 'uTime');
    const uColorLoc = this.gl.getUniformLocation(this.program, 'uColor');
    const uMouseLoc = this.gl.getUniformLocation(this.program, 'uMouse');
    const uAmplitudeLoc = this.gl.getUniformLocation(this.program, 'uAmplitude');
    const uSpeedLoc = this.gl.getUniformLocation(this.program, 'uSpeed');

    const time = Date.now();
    this.gl.uniform1f(uTimeLoc, time);
    this.gl.uniform3f(uColorLoc, this.color[0], this.color[1], this.color[2]);
    this.gl.uniform2f(uMouseLoc, this.mousePos.x, this.mousePos.y);
    this.gl.uniform1f(uAmplitudeLoc, this.amplitude);
    this.gl.uniform1f(uSpeedLoc, this.speed);

    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
  }

  destroy() {
    if (this.animateId) {
      cancelAnimationFrame(this.animateId);
    }
    window.removeEventListener('resize', () => this.resize());
    if (this.mouseReact && this.container) {
      this.container.removeEventListener('mousemove', (e) => this.handleMouseMove(e));
    }
  }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Iridescence;
}

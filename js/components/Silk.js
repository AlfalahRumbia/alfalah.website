// Silk.js - Vanilla Three.js background shader
class Silk {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.options = Object.assign({
      speed: 5,
      scale: 1,
      color: '#04654d',
      noiseIntensity: 1.5,
      rotation: 0
    }, options);

    this.init();
  }

  init() {
    const THREE = window.THREE;
    if (!THREE) {
      console.error('Three.js is not loaded.');
      return;
    }

    const rect = this.canvas.getBoundingClientRect();
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true });
    this.renderer.setSize(rect.width, rect.height, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.scene = new THREE.Scene();
    
    // Orthographic camera covering [-1, 1] on both axes
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const vertexShader = `
      varying vec2 vUv;
      varying vec3 vPosition;

      void main() {
        vPosition = position;
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      varying vec2 vUv;
      varying vec3 vPosition;

      uniform float uTime;
      uniform vec3  uColor;
      uniform float uSpeed;
      uniform float uScale;
      uniform float uRotation;
      uniform float uNoiseIntensity;

      const float e = 2.71828182845904523536;

      float noise(vec2 texCoord) {
        float G = e;
        vec2  r = (G * sin(G * texCoord));
        return fract(r.x * r.y * (1.0 + texCoord.x));
      }

      vec2 rotateUvs(vec2 uv, float angle) {
        float c = cos(angle);
        float s = sin(angle);
        mat2  rot = mat2(c, -s, s, c);
        return rot * uv;
      }

      void main() {
        float rnd        = noise(gl_FragCoord.xy);
        vec2  uv         = rotateUvs(vUv * uScale, uRotation);
        vec2  tex        = uv * uScale;
        float tOffset    = uSpeed * uTime;

        tex.y += 0.03 * sin(8.0 * tex.x - tOffset);

        float pattern = 0.6 +
                        0.4 * sin(5.0 * (tex.x + tex.y +
                                         cos(3.0 * tex.x + 5.0 * tex.y) +
                                         0.02 * tOffset) +
                                 sin(20.0 * (tex.x + tex.y - 0.1 * tOffset)));

        vec4 col = vec4(uColor, 1.0) * vec4(pattern) - rnd / 15.0 * uNoiseIntensity;
        col.a = 1.0;
        gl_FragColor = col;
      }
    `;

    // Parse color
    const hex = this.options.color.replace('#', '');
    const r = parseInt(hex.slice(0, 2), 16) / 255;
    const g = parseInt(hex.slice(2, 4), 16) / 255;
    const b = parseInt(hex.slice(4, 6), 16) / 255;

    this.uniforms = {
      uSpeed: { value: this.options.speed },
      uScale: { value: this.options.scale },
      uNoiseIntensity: { value: this.options.noiseIntensity },
      uColor: { value: new THREE.Color(r, g, b) },
      uRotation: { value: this.options.rotation },
      uTime: { value: 0 }
    };

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      depthWrite: false,
      depthTest: false
    });

    const mesh = new THREE.Mesh(geometry, material);
    this.scene.add(mesh);

    this.clock = new THREE.Clock();

    const animate = () => {
      this.animationFrameId = requestAnimationFrame(animate);
      const delta = this.clock.getDelta();
      // uTime += 0.1 * delta to match the original React code's speed multiplier
      this.uniforms.uTime.value += 0.1 * delta;
      this.renderer.render(this.scene, this.camera);
    };

    animate();

    this.resizeHandler = () => {
      const parent = this.canvas.parentElement;
      if (parent) {
        const width = parent.clientWidth;
        const height = parent.clientHeight;
        this.renderer.setSize(width, height, false);
      }
    };

    window.addEventListener('resize', this.resizeHandler);
    this.resizeHandler(); // Initial size
  }

  destroy() {
    cancelAnimationFrame(this.animationFrameId);
    window.removeEventListener('resize', this.resizeHandler);
  }
}

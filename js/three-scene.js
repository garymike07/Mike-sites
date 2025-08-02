// Three.js 3D Scene Integration

class ThreeScene {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.windowHalf = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        
        this.init();
        this.animate();
        this.setupEventListeners();
    }

    init() {
        // Check if Three.js is available
        if (typeof THREE === 'undefined') {
            console.warn('Three.js not loaded, falling back to CSS animations');
            this.createFallbackBackground();
            return;
        }

        // Scene setup
        this.scene = new THREE.Scene();
        
        // Camera setup
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 5;

        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: true 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0);
        
        if (this.container) {
            this.container.appendChild(this.renderer.domElement);
        }

        // Create 3D elements
        this.createParticleSystem();
        this.createFloatingGeometry();
        this.createInteractiveElements();
    }

    createParticleSystem() {
        const particleCount = 1000;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Positions
            positions[i3] = (Math.random() - 0.5) * 20;
            positions[i3 + 1] = (Math.random() - 0.5) * 20;
            positions[i3 + 2] = (Math.random() - 0.5) * 20;
            
            // Colors
            const color = new THREE.Color();
            color.setHSL(Math.random() * 0.3 + 0.5, 0.7, 0.5);
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
            
            // Sizes
            sizes[i] = Math.random() * 2 + 1;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                pixelRatio: { value: window.devicePixelRatio }
            },
            vertexShader: `
                attribute float size;
                attribute vec3 color;
                varying vec3 vColor;
                uniform float time;
                
                void main() {
                    vColor = color;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                
                void main() {
                    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
                    float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
                    gl_FragColor = vec4(vColor, alpha);
                }
            `,
            transparent: true,
            vertexColors: true
        });

        this.particleSystem = new THREE.Points(geometry, material);
        this.scene.add(this.particleSystem);
    }

    createFloatingGeometry() {
        // Create floating geometric shapes
        const geometries = [
            new THREE.BoxGeometry(0.5, 0.5, 0.5),
            new THREE.SphereGeometry(0.3, 16, 16),
            new THREE.ConeGeometry(0.3, 0.6, 8),
            new THREE.TorusGeometry(0.3, 0.1, 8, 16)
        ];

        const materials = [
            new THREE.MeshBasicMaterial({ 
                color: 0x00ff88, 
                wireframe: true,
                transparent: true,
                opacity: 0.6
            }),
            new THREE.MeshBasicMaterial({ 
                color: 0x0066ff, 
                wireframe: true,
                transparent: true,
                opacity: 0.6
            }),
            new THREE.MeshBasicMaterial({ 
                color: 0xff6b6b, 
                wireframe: true,
                transparent: true,
                opacity: 0.6
            })
        ];

        this.floatingObjects = [];

        for (let i = 0; i < 10; i++) {
            const geometry = geometries[Math.floor(Math.random() * geometries.length)];
            const material = materials[Math.floor(Math.random() * materials.length)];
            const mesh = new THREE.Mesh(geometry, material);
            
            mesh.position.set(
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10
            );
            
            mesh.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            
            mesh.userData = {
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.02,
                    y: (Math.random() - 0.5) * 0.02,
                    z: (Math.random() - 0.5) * 0.02
                },
                floatSpeed: Math.random() * 0.01 + 0.005
            };
            
            this.floatingObjects.push(mesh);
            this.scene.add(mesh);
        }
    }

    createInteractiveElements() {
        // Create interactive 3D elements that respond to mouse movement
        const geometry = new THREE.RingGeometry(1, 1.5, 32);
        const material = new THREE.MeshBasicMaterial({
            color: 0x00d4ff,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
        });

        this.interactiveRing = new THREE.Mesh(geometry, material);
        this.interactiveRing.position.z = -2;
        this.scene.add(this.interactiveRing);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        if (!this.scene) return;

        const time = Date.now() * 0.001;

        // Animate particle system
        if (this.particleSystem) {
            this.particleSystem.rotation.y = time * 0.1;
            this.particleSystem.material.uniforms.time.value = time;
        }

        // Animate floating objects
        this.floatingObjects.forEach(obj => {
            obj.rotation.x += obj.userData.rotationSpeed.x;
            obj.rotation.y += obj.userData.rotationSpeed.y;
            obj.rotation.z += obj.userData.rotationSpeed.z;
            
            obj.position.y += Math.sin(time + obj.position.x) * obj.userData.floatSpeed;
        });

        // Interactive ring follows mouse
        if (this.interactiveRing) {
            this.interactiveRing.rotation.z = time * 0.5;
            this.interactiveRing.position.x = this.mouse.x * 2;
            this.interactiveRing.position.y = -this.mouse.y * 2;
        }

        // Camera movement based on mouse
        this.camera.position.x += (this.mouse.x - this.camera.position.x) * 0.05;
        this.camera.position.y += (-this.mouse.y - this.camera.position.y) * 0.05;
        this.camera.lookAt(this.scene.position);

        this.renderer.render(this.scene, this.camera);
    }

    setupEventListeners() {
        // Mouse movement
        document.addEventListener('mousemove', (event) => {
            this.mouse.x = (event.clientX - this.windowHalf.x) / this.windowHalf.x;
            this.mouse.y = (event.clientY - this.windowHalf.y) / this.windowHalf.y;
        });

        // Window resize
        window.addEventListener('resize', () => {
            this.windowHalf.x = window.innerWidth / 2;
            this.windowHalf.y = window.innerHeight / 2;
            
            if (this.camera && this.renderer) {
                this.camera.aspect = window.innerWidth / window.innerHeight;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(window.innerWidth, window.innerHeight);
            }
        });

        // Scroll effects
        window.addEventListener('scroll', () => {
            if (this.scene) {
                const scrollPercent = window.pageYOffset / (document.body.scrollHeight - window.innerHeight);
                this.scene.rotation.y = scrollPercent * Math.PI * 2;
            }
        });
    }

    createFallbackBackground() {
        // Fallback animated background when Three.js is not available
        const canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '-1';
        canvas.style.pointerEvents = 'none';
        
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        if (this.container) {
            this.container.appendChild(canvas);
        }

        const particles = [];
        for (let i = 0; i < 100; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: Math.random() * 3 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }

        const animateFallback = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
                
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 212, 255, ${particle.opacity})`;
                ctx.fill();
            });
            
            requestAnimationFrame(animateFallback);
        };
        
        animateFallback();
    }

    // Public methods for interaction
    addObject(geometry, material, position) {
        if (!this.scene) return null;
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(position);
        this.scene.add(mesh);
        return mesh;
    }

    removeObject(mesh) {
        if (this.scene && mesh) {
            this.scene.remove(mesh);
        }
    }

    updateTheme(theme) {
        if (!this.scene) return;
        
        const colors = {
            dark: { primary: 0x0066ff, secondary: 0x00d4ff, accent: 0xff6b6b },
            light: { primary: 0x0052cc, secondary: 0x00a8cc, accent: 0xe55555 },
            neon: { primary: 0x00ff41, secondary: 0xff0080, accent: 0x00d4ff }
        };
        
        const themeColors = colors[theme] || colors.dark;
        
        // Update particle colors
        if (this.particleSystem) {
            const colorAttribute = this.particleSystem.geometry.getAttribute('color');
            const colors = colorAttribute.array;
            
            for (let i = 0; i < colors.length; i += 3) {
                const color = new THREE.Color(themeColors.primary);
                colors[i] = color.r;
                colors[i + 1] = color.g;
                colors[i + 2] = color.b;
            }
            
            colorAttribute.needsUpdate = true;
        }
        
        // Update floating objects
        this.floatingObjects.forEach((obj, index) => {
            const colorKeys = Object.keys(themeColors);
            const colorKey = colorKeys[index % colorKeys.length];
            obj.material.color.setHex(themeColors[colorKey]);
        });
    }

    dispose() {
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        if (this.container && this.renderer) {
            this.container.removeChild(this.renderer.domElement);
        }
    }
}

// Initialize Three.js scene when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create background 3D scene
    const backgroundContainer = document.createElement('div');
    backgroundContainer.id = 'three-background';
    backgroundContainer.style.position = 'fixed';
    backgroundContainer.style.top = '0';
    backgroundContainer.style.left = '0';
    backgroundContainer.style.width = '100%';
    backgroundContainer.style.height = '100%';
    backgroundContainer.style.zIndex = '-1';
    backgroundContainer.style.pointerEvents = 'none';
    
    document.body.appendChild(backgroundContainer);
    
    window.threeScene = new ThreeScene('three-background');
    
    // Listen for theme changes
    document.addEventListener('themeChanged', (event) => {
        if (window.threeScene) {
            window.threeScene.updateTheme(event.detail.theme);
        }
    });
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThreeScene;
}


import * as THREE from 'three';

export default class Link {
    constructor(source,target) {
        this.source = source;
        this.target = target;
        this.line = this.createLine();
        if(this.line){
            this.source.stage.scene.add(this.line);
        }
        else{
            console.error('Failed to create line');
        }
    }

    createLine() {
        this.material = this.linkMaterial();
        const points = [];
        points.push(this.source.position);
        points.push(this.target.position);
       
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
    
        const line = new THREE.Line(geometry, this.material);
        return line;
    }

    linkMaterial() {
        return new THREE.ShaderMaterial({
            uniforms: {
                u_time: { value: 0 },
                u_dashLength: { value: 0.2 },
                u_gapLength: { value: 0.2 },
                u_totalLength: { value: this.source.position.distanceTo(this.target.position) }, // Length from (-2,0,0) to (2,0,0)
                u_progress: { value: 0 },
                u_color: { value: new THREE.Color(0xffffff) } // Dark blue
            },
            vertexShader: this.linkVertexShader(),
            fragmentShader: this.linkFragmentShader(),
        });
    }

    linkVertexShader() {
        return `
            varying float vPosition;

            void main() {
                vPosition = position.x + 2.0; // Convert from [-2,2] to [0,4]
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;
    }

    linkFragmentShader() {
        return `
            uniform float u_time;
            uniform float u_dashLength;
            uniform float u_gapLength;
            uniform float u_totalLength;
            uniform float u_progress;
            uniform vec3 u_color;
            varying float vPosition;
            
            void main() {
                float dashAndGap = u_dashLength + u_gapLength;
                float currentPos = mod(vPosition + u_time * 0.5, dashAndGap);
                
                // Only show dashes up to the current progress
                if (vPosition > u_progress * u_totalLength) {
                    discard;
                }
                
                if (currentPos > u_dashLength) {
                    discard;
                }
                
                gl_FragColor = vec4(u_color, 1.0);
            }
        `;
    }

    animate() {
        this.material.uniforms.u_time.value += 0.01;
        this.material.uniforms.u_progress.value += 0.01;
        this.line.geometry.attributes.position.needsUpdate = true;
    }
}
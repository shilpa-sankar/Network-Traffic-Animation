import * as THREE from 'three';

export default class Link {
    /**
     * 
     * @param {*source is the initial position where the link will start to draw} source 
     * @param {* the second position where the link will end} target 
     */
    constructor(source,target) {
        this.source = source;
        this.target = target;
        this.line = this.createLine();
        this.animationSphere = this.createMovingSphere();
        // if the line is created then only add the line to the scene
        if(this.line){
            this.source.stage.scene.add(this.line, this.animationSphere);
        }
        else{
            console.error('Failed to create line');
        }
        this.animationSpeed = 0.05;
        this.animationProgress = 0;
    }

    // creating the line
    createLine() {
        const points = [];
        console.log('this.source.: ', this.source);
        points.push(this.source.position);
        console.log('this.source.position: ', this.source.position);
        points.push(this.target.position);
        console.log('this.target.position: ', this.target.position);

        const originalLineMaterial = new THREE.LineBasicMaterial({ 
            color: 0xadd8e6, // Light blue
            linewidth: 2
        });
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        
        const originalLine = new THREE.Line(geometry, originalLineMaterial);
       
        return originalLine;
    }

     // Add this new method to create moving sphere
     createMovingSphere() {
        const geometry = new THREE.SphereGeometry(0.2, 16, 16);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0xffffff,
            transparent: true,
            opacity: 0.8
        });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.copy(this.source.position);
        sphere.position.z += 1; // Slightly above the line
        return sphere;
    }

    // Add this new method to update sphere position
    updateMovingSphere() {
        // Update progress (ping-pong animation)
        this.animationProgress += this.animationSpeed;
        if (this.animationProgress > 1) {
            this.animationProgress = 0;
        }
        // Calculate position between source and target
        this.animationSphere.position.lerpVectors(
            this.source.position,
            this.target.position,
            this.animationProgress,
        );
    }

    linkMaterial() {
        return new THREE.ShaderMaterial({
            uniforms: {
                u_time: { value: 0 },
                u_dashLength: { value: 0.4 },
                u_gapLength: { value: 0.4 },
                u_totalLength: { value: 4 }, // Length from (-2,0,0) to (2,0,0)
                u_progress: { value: 0 },
                u_color: { value: new THREE.Color(0xffffff) } // Dark blue
            },
            vertexShader: this.linkVertexShader(),
            fragmentShader: this.linkFragmentShader(),
            transparent: true,
        });
    }

    linkVertexShader() {
        return `
            varying float vPosition;

            void main() {
                vPosition = position.x; // Convert from [-2,2] to [0,4]
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
                // if (vPosition > u_progress * u_totalLength) {
                //     discard;
                // }
                
                // if (currentPos > u_dashLength) {
                //     discard;
                // }
                
                gl_FragColor = vec4(u_color, 1.0);
            }
        `;
    }

      // Modify this method to also update the moving sphere
    animate() {
        this.updateMovingSphere(); // Update sphere position
    }

    // Add cleanup for the moving sphere
    dispose() {
        if (this.line) {
            this.source.stage.scene.remove(this.line);
        }
        if (this.movingSphere) {
            this.source.stage.scene.remove(this.movingSphere);
            this.movingSphere.geometry.dispose();
            this.movingSphere.material.dispose();
        }
    }

    // animate(progress, timeStamp) {
    //     return;
    // }
}
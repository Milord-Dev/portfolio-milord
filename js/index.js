document.addEventListener("DOMContentLoaded", function() {
    // --- Scroll Animations ---
    const animatedElements = document.querySelectorAll(
        'section > h1, section > h2, section > h3, section > h4, section > p, ' +
        '.cards-habilidades, .proyecto-flex, .certificaciones-card, #iconos-redes, .sobreMi-flex, .btn-proyecto'
    );

    animatedElements.forEach((el) => {
        el.classList.add('animate-on-scroll');
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // --- 3D Sphere of Dots Animation ---
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let sphereRadius;
    const dots = [];
    const numberOfDots = 900; 
    let rotationX = 0;
    let rotationY = 0;
    
    // Mouse interaction for rotation
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0.001;
    let targetRotationY = 0.001;

    // Resize handling
    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        
        // Sphere radius configuration - Perfect Sphere
        // Using 75% of the smaller dimension to fit screen
        sphereRadius = Math.min(width, height) * 0.75; 
        
        initDots(); 
    }
    
    window.addEventListener('resize', resize);

    // Mouse movement listener
    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / width) * 2 - 1;
        const y = (e.clientY / height) * 2 - 1;
        targetRotationY = x * 0.01; // Rotate around Y axis based on mouse X
        targetRotationX = -y * 0.01; // Rotate around X axis based on mouse Y
    });

    // Initialize dots on sphere surface (Fibonacci Sphere algorithm for even distribution)
    function initDots() {
        dots.length = 0; // Clear existing dots
        const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

        for (let i = 0; i < numberOfDots; i++) {
            const y = 1 - (i / (numberOfDots - 1)) * 2; // y goes from 1 to -1
            const radiusAtY = Math.sqrt(1 - y * y); // Radius at y
            
            const theta = phi * i; // Golden angle increment
            
            // Standard Sphere coordinates
            const x = Math.cos(theta) * radiusAtY * sphereRadius;
            const yPos = y * sphereRadius;
            const z = Math.sin(theta) * radiusAtY * sphereRadius; 

            dots.push({
                x: x,
                y: yPos,
                z: z
            });
        }
    }

    // Call resize initially to set up everything
    resize();

    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        // Smooth rotation update
        rotationX += (targetRotationX - rotationX) * 0.05;
        rotationY += (targetRotationY - rotationY) * 0.05;
        
        // Auto rotation component (slow spin always active)
        const autoRotateSpeed = 0.00005; 
        
        // Center of screen
        const cx = width / 2;
        const cy = height / 2;

        ctx.fillStyle = 'rgba(80, 74, 239, 0.69)'; // Dot color (dark grey)

        for (let i = 0; i < dots.length; i++) {
            const dot = dots[i];

            // Rotate around Y axis
            let x1 = dot.x * Math.cos(rotationY + autoRotateSpeed) - dot.z * Math.sin(rotationY + autoRotateSpeed);
            let z1 = dot.z * Math.cos(rotationY + autoRotateSpeed) + dot.x * Math.sin(rotationY + autoRotateSpeed);
            
            // Rotate around X axis
            let y1 = dot.y * Math.cos(rotationX) - z1 * Math.sin(rotationX);
            let z2 = z1 * Math.cos(rotationX) + dot.y * Math.sin(rotationX);

            // Update dot position for next frame
            dot.x = x1;
            dot.y = y1;
            dot.z = z2;

            // 3D Projection (Perspective)
            const perspective = width; 
            const scale = perspective / (perspective + dot.z + sphereRadius + 350); 
            
            const x2d = cx + dot.x * scale;
            const y2d = cy + dot.y * scale;

            // Draw dot
            const alpha = Math.max(0.1, (scale - 0.5) * 1.5); 
            const size = Math.max(0.5, scale * 2);

            ctx.beginPath();
            ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(29, 29, 31, ${alpha})`;
            ctx.fill();
        }

        requestAnimationFrame(animate);
    }

    animate();
});

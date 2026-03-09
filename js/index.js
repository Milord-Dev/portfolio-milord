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
    
    // Rotation settings
    const autoRotateSpeedX = 0.002; // Constant rotation speed
    const autoRotateSpeedY = 0.003;

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
        
        // Center of screen
        const cx = width / 2;
        const cy = height / 2;

        ctx.fillStyle = 'rgba(29, 29, 31, 0.6)'; // Dot color (dark grey)

        for (let i = 0; i < dots.length; i++) {
            const dot = dots[i];

            // Rotate around Y axis
            let x1 = dot.x * Math.cos(autoRotateSpeedY) - dot.z * Math.sin(autoRotateSpeedY);
            let z1 = dot.z * Math.cos(autoRotateSpeedY) + dot.x * Math.sin(autoRotateSpeedY);
            
            // Rotate around X axis
            let y1 = dot.y * Math.cos(autoRotateSpeedX) - z1 * Math.sin(autoRotateSpeedX);
            let z2 = z1 * Math.cos(autoRotateSpeedX) + dot.y * Math.sin(autoRotateSpeedX);

            // Update dot position for next frame
            dot.x = x1;
            dot.y = y1;
            dot.z = z2;

            // 3D Projection (Perspective)
            const perspective = width; 
            const scale = perspective / (perspective + dot.z + sphereRadius + 200); 
            
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

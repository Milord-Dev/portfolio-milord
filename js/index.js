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

    // --- 3D "Jellyfish" Sphere of Dots Animation ---
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let sphereRadius;
    const dots = [];
    const numberOfDots = 900; 
    let time = 0;
    
    // Rotation settings (very slow background rotation)
    const autoRotateSpeedX = 0.0005;
    const autoRotateSpeedY = 0.0008;

    // Resize handling
    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        
        // Sphere radius configuration
        sphereRadius = Math.min(width, height) * 0.75; 
        
        initDots(); 
    }
    
    window.addEventListener('resize', resize);

    // Initialize dots on sphere surface (Fibonacci Sphere algorithm)
    function initDots() {
        dots.length = 0; 
        const phi = Math.PI * (3 - Math.sqrt(5)); 

        for (let i = 0; i < numberOfDots; i++) {
            const y = 1 - (i / (numberOfDots - 1)) * 2; 
            const radiusAtY = Math.sqrt(1 - y * y); 
            const theta = phi * i; 
            
            // Store original normalized positions to apply deformations
            dots.push({
                ox: Math.cos(theta) * radiusAtY, // original x normalized
                oy: y,                           // original y normalized
                oz: Math.sin(theta) * radiusAtY, // original z normalized
                x: 0,
                y: 0,
                z: 0
            });
        }
    }

    resize();

    function animate() {
        ctx.clearRect(0, 0, width, height);
        time += 0.01; // Progression of time for the "pulse"
        
        const cx = width / 2;
        const cy = height / 2;

        for (let i = 0; i < dots.length; i++) {
            const dot = dots[i];

            // --- Jellyfish/Organic Motion Logic ---
            // We use Perlin-like noise (sine combinations) to create abstract deformation
            // Pulse: The radius expands and contracts based on Y position and time
            const pulse = Math.sin(time + dot.oy * 2) * 0.15 + 1;
            
            // Wave: Organic horizontal deformation
            const waveX = Math.sin(time * 0.5 + dot.oy * 3) * 0.1;
            const waveZ = Math.cos(time * 0.5 + dot.oy * 3) * 0.1;
            
            // Calculate current 3D position based on original surface + deformations
            let curX = dot.ox * sphereRadius * pulse + (waveX * sphereRadius);
            let curY = dot.oy * sphereRadius * (pulse * 0.9); // Slightly flatter pulse vertically
            let curZ = dot.oz * sphereRadius * pulse + (waveZ * sphereRadius);

            // Apply slow global rotation
            const cosY = Math.cos(autoRotateSpeedY * (i % 100)); // Varied rotation per point for abstract feel
            const sinY = Math.sin(autoRotateSpeedY * (i % 100));
            const x1 = curX * Math.cos(time * 0.2) - curZ * Math.sin(time * 0.2);
            const z1 = curZ * Math.cos(time * 0.2) + curX * Math.sin(time * 0.2);
            
            const y1 = curY * Math.cos(time * 0.1) - z1 * Math.sin(time * 0.1);
            const z2 = z1 * Math.cos(time * 0.1) + curY * Math.sin(time * 0.1);

            dot.x = x1;
            dot.y = y1;
            dot.z = z2;

            // 3D Projection (Perspective)
            const perspective = width; 
            const scale = perspective / (perspective + dot.z + sphereRadius + 200); 
            
            const x2d = cx + dot.x * scale;
            const y2d = cy + dot.y * scale;

            // Draw dot
            const alpha = Math.max(0.05, (scale - 0.4) * 0.8); 
            const size = Math.max(0.5, scale * 1.8);

            ctx.beginPath();
            ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(29, 29, 31, ${alpha})`;
            ctx.fill();
        }

        requestAnimationFrame(animate);
    }

    animate();
});

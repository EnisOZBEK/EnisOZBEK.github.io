const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const resumeBtn = document.getElementById("resumeLink");

let width, height;
// Physics & Scrolling variables
let scroll = 0;
let targetScroll = 0;
const maxScroll = 6000; // How long the road is
let speed = 0;

// High-DPI Canvas Setup for Full HD Crispness
function resize() {
    const dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    
    ctx.scale(dpr, dpr);
}
window.addEventListener("resize", resize);
resize();

// Input Handling: Mouse Wheel & Touch Swipes
window.addEventListener("wheel", (e) => {
    targetScroll += e.deltaY;
});

let touchStartY = 0;
window.addEventListener("touchstart", (e) => {
    touchStartY = e.touches[0].clientY;
});
window.addEventListener("touchmove", (e) => {
    let dy = touchStartY - e.touches[0].clientY;
    targetScroll += dy * 2; // Touch sensitivity
    touchStartY = e.touches[0].clientY;
});

// Resume Data mapped to positions on the road (X coordinates)
const milestones = [
    { x: 300, title: "ENIS ÖZBEK", subtitle: "Game Developer | Gameplay & Systems Designer [cite: 5]", lines: ["Scroll down or swipe up to drive."] },
    { x: 1500, title: "EXPERIENCE [cite: 8]", subtitle: "Lead Game Developer @ Cim Games [cite: 9]", lines: ["• Led full-cycle development of Brunswick (3D open-world). [cite: 10]", "• Authored 20,000+ lines of optimized C# code. [cite: 11]", "• Boosted average FPS by 70% on low-end devices. [cite: 15]"] },
    { x: 2800, title: "SKILLS [cite: 20]", subtitle: "Technical Arsenal", lines: ["• Unity (URP, 2D/3D) & C# [cite: 22]", "• Gameplay Architecture & System Design [cite: 22]", "• Mobile Optimization, NavMesh & AI [cite: 22]"] },
    { x: 4100, title: "PROJECTS [cite: 28]", subtitle: "Solo & Academic Work", lines: ["• Shatter Strike: 3D mobile railroad runner with destruction. [cite: 29, 30]", "• Valorium Vengeance: 2D Hack & Slash adventure. [cite: 33, 34]", "• Stack Smash Omicron: Fast-paced arcade stacker. [cite: 37, 38]"] },
    { x: 5400, title: "CONTACT", subtitle: "Let's build something great.", lines: ["Phone: +90 (501) 030 11 30 [cite: 1]", "Email: Enisozbek1@gmail.com [cite: 2]", "GitHub: github.com/EnisOZBEK [cite: 2]"] }
];

// Drawing the Hatchback Car
function drawCar(carX, carY, wheelRotation) {
    ctx.save();
    ctx.translate(carX, carY);
    
    // Car Shadow
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.beginPath();
    ctx.ellipse(50, 25, 60, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Car Body (Sleek Red Hatchback)
    ctx.fillStyle = "#D31A38"; // Sporty Red
    ctx.beginPath();
    ctx.moveTo(0, 15); // Front bumper
    ctx.lineTo(20, 0); // Hood
    ctx.lineTo(45, -15); // Windshield
    ctx.lineTo(85, -15); // Roof
    ctx.lineTo(100, 5); // Hatchback rear
    ctx.lineTo(100, 20); // Rear bumper
    ctx.lineTo(0, 20); // Bottom
    ctx.closePath();
    ctx.fill();

    // Windows
    ctx.fillStyle = "#111";
    ctx.beginPath();
    ctx.moveTo(48, -12);
    ctx.lineTo(82, -12);
    ctx.lineTo(92, 2);
    ctx.lineTo(52, 2);
    ctx.closePath();
    ctx.fill();

    // Wheels
    const drawWheel = (wx, wy) => {
        ctx.save();
        ctx.translate(wx, wy);
        ctx.rotate(wheelRotation);
        ctx.fillStyle = "#222"; // Tire
        ctx.beginPath(); ctx.arc(0, 0, 12, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#ccc"; // Rim
        ctx.beginPath(); ctx.arc(0, 0, 6, 0, Math.PI * 2); ctx.fill();
        // Rim spokes
        ctx.strokeStyle = "#888"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(-6, 0); ctx.lineTo(6, 0); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, -6); ctx.lineTo(0, 6); ctx.stroke();
        ctx.restore();
    };
    
    drawWheel(20, 20); // Front wheel
    drawWheel(80, 20); // Rear wheel

    ctx.restore();
}

function loop() {
    // Smooth scrolling logic (Lerp)
    targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));
    speed = (targetScroll - scroll) * 0.05;
    scroll += speed;

    // Show PDF button at the very end of the road
    if (scroll > maxScroll - 500) {
        resumeBtn.style.display = "block";
    } else {
        resumeBtn.style.display = "none";
    }

    // Clear Screen
    ctx.fillStyle = "#0d0d12";
    ctx.fillRect(0, 0, width, height);

    const roadY = height * 0.7;

    // 1. Draw Parallax Background (Mountains/Cityscape)
    ctx.fillStyle = "#1a1a24";
    for (let i = 0; i < 10; i++) {
        let bgX = (i * 400) - (scroll * 0.2) % 400; // Moves slower than the road
        ctx.beginPath();
        ctx.moveTo(bgX, roadY);
        ctx.lineTo(bgX + 200, roadY - 200);
        ctx.lineTo(bgX + 400, roadY);
        ctx.fill();
    }

    // 2. Draw Road
    ctx.fillStyle = "#222";
    ctx.fillRect(0, roadY, width, height - roadY);
    
    // Road Lines
    ctx.fillStyle = "#FFD700";
    for (let i = 0; i < width / 100 + 2; i++) {
        let lineX = (i * 150) - (scroll % 150);
        ctx.fillRect(lineX, roadY + 40, 80, 5);
    }

    // 3. Draw Milestones (Text nodes)
    milestones.forEach(m => {
        let screenX = m.x - scroll + width / 2; // Center based on scroll
        
        // Only draw if on screen to save performance
        if (screenX > -500 && screenX < width + 500) {
            ctx.textAlign = "center";
            
            // Title
            ctx.fillStyle = "#00E5FF";
            ctx.font = "bold 42px 'Segoe UI', Arial";
            ctx.fillText(m.title, screenX, roadY - 250);
            
            // Subtitle
            ctx.fillStyle = "#FF3366";
            ctx.font = "bold 24px 'Segoe UI', Arial";
            ctx.fillText(m.subtitle, screenX, roadY - 210);

            // Lines
            ctx.fillStyle = "#FFF";
            ctx.font = "18px 'Segoe UI', Arial";
            m.lines.forEach((line, index) => {
                ctx.fillText(line, screenX, roadY - 160 + (index * 30));
            });

            // Anchor Line connecting text to the road
            ctx.strokeStyle = "rgba(0, 229, 255, 0.3)";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(screenX, roadY - 140 + (m.lines.length * 30));
            ctx.lineTo(screenX, roadY);
            ctx.stroke();
        }
    });

    // 4. Draw Car (Fixed X position, animated wheels)
    const carX = width * 0.2; // Car stays at 20% of screen width
    const wheelRotation = scroll * 0.05;
    drawCar(carX, roadY - 25, wheelRotation);

    requestAnimationFrame(loop);
}

loop();

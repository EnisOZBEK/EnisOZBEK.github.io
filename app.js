const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let width, height, groundY;

// The Resume Content
const resumeNodes = [
    { title: "ABOUT ME", lines: ["Game Developer specializing in Unity.", "BSc Computer Engineering – IGU", "Erasmus – NOVA University Lisbon"] },
    { title: "EXPERIENCE", lines: ["Lead Game Developer – Cim Games", "Built Brunswick, a 3D open-world game.", "Wrote 20k+ lines of modular C# code.", "Boosted FPS by 70% on low-end devices."] },
    { title: "SKILLS", lines: ["Unity (URP, 2D/3D)", "C# & Gameplay Architecture", "Mobile Optimization & NavMesh AI"] },
    { title: "CONTRIBUTIONS", lines: ["Jury Member & Organizer – IGU Game Jam", "Co-organized event with 120+ participants.", "Mentored developers on Unity."] },
    { title: "PROJECTS", lines: ["Shatter Strike: 3D mobile railroad runner.", "Valorium Vengeance: 2D Hack & Slash.", "Stack Smash Omicron: Arcade mobile game."] },
    { title: "CONTACT", lines: ["Phone: +90 501 030 11 30", "Email: Enisozbek1@gmail.com", "GitHub: github.com/EnisOZBEK"] }
];

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    groundY = height * 0.75;
}

window.addEventListener("resize", resize);
resize();

// Game State
let state = "start"; // start, play, popup, gameover
let frame = 0;
let gameSpeed = 6;
let entities = [];
let activeNode = null;
let nodeIndex = 0;

// Physics Player Object
const player = {
    x: 100, y: 0, size: 30,
    vy: 0, gravity: 0.6, jumpPower: -12,
    grounded: false,
    
    reset() {
        this.y = groundY - this.size;
        this.vy = 0;
    },
    update() {
        this.vy += this.gravity;
        this.y += this.vy;
        
        if (this.y + this.size >= groundY) {
            this.y = groundY - this.size;
            this.vy = 0;
            this.grounded = true;
        } else {
            this.grounded = false;
        }
    },
    jump() {
        if (this.grounded) {
            this.vy = this.jumpPower;
            this.grounded = false;
        }
    },
    draw() {
        ctx.shadowBlur = 20;
        ctx.shadowColor = "#00E5FF";
        ctx.fillStyle = "#00E5FF";
        ctx.fillRect(this.x, this.y, this.size, this.size);
        ctx.shadowBlur = 0;
    }
};

// Input Handling (One-Touch)
function handleInput(e) {
    if (e.type === "touchstart") e.preventDefault();
    
    if (state === "start") {
        state = "play";
        player.reset();
        entities = [];
        nodeIndex = 0;
    } else if (state === "play") {
        player.jump();
    } else if (state === "popup") {
        state = "play"; // Resume run
    } else if (state === "gameover") {
        state = "start";
    }
}

window.addEventListener("mousedown", handleInput);
window.addEventListener("touchstart", handleInput, { passive: false });

// Collision Detection (AABB)
function checkCollision(r1, r2) {
    return r1.x < r2.x + r2.w && r1.x + r1.size > r2.x &&
           r1.y < r2.y + r2.h && r1.y + r1.size > r2.y;
}

// Spawning Logic
function spawnEntities() {
    if (frame % 120 === 0 && Math.random() > 0.5) {
        // Spawn Obstacle (Red)
        entities.push({ type: "obstacle", x: width, y: groundY - 30, w: 20, h: 30, color: "#FF3366" });
    }
    
    if (frame % 400 === 0 && nodeIndex < resumeNodes.length) {
        // Spawn Data Node (White)
        entities.push({ type: "node", x: width, y: groundY - 90, w: 30, h: 30, color: "#FFFFFF", data: resumeNodes[nodeIndex] });
        nodeIndex++;
    }
}

// Rendering the UI Popups
function drawPopup() {
    ctx.fillStyle = "rgba(5, 5, 5, 0.9)";
    ctx.fillRect(0, 0, width, height);
    
    ctx.fillStyle = "#00E5FF";
    ctx.font = "bold 32px Arial";
    ctx.textAlign = "center";
    ctx.fillText(activeNode.title, width / 2, height / 2 - 80);
    
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "18px Arial";
    activeNode.lines.forEach((line, i) => {
        ctx.fillText(line, width / 2, height / 2 - 20 + (i * 30));
    });
    
    ctx.fillStyle = "#888888";
    ctx.font = "16px Arial";
    ctx.fillText("Tap to continue running", width / 2, height / 2 + 120);
}

// Main Game Loop
function loop() {
    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, width, height);
    
    // Draw Ground Line
    ctx.strokeStyle = "#222";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(width, groundY);
    ctx.stroke();

    if (state === "start") {
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "24px Arial";
        ctx.textAlign = "center";
        ctx.fillText("ENIS ÖZBEK - INTERACTIVE RESUME", width / 2, height / 2);
        ctx.fillStyle = "#FF3366";
        ctx.fillText("Tap to Start", width / 2, height / 2 + 50);
    } 
    
    else if (state === "play") {
        player.update();
        player.draw();
        
        spawnEntities();
        
        for (let i = entities.length - 1; i >= 0; i--) {
            let ent = entities[i];
            ent.x -= gameSpeed;
            
            // Draw Entity
            ctx.shadowBlur = 10;
            ctx.shadowColor = ent.color;
            ctx.fillStyle = ent.color;
            ctx.fillRect(ent.x, ent.y, ent.w, ent.h);
            ctx.shadowBlur = 0;
            
            // Collision
            if (checkCollision(player, ent)) {
                if (ent.type === "obstacle") {
                    state = "gameover";
                } else if (ent.type === "node") {
                    state = "popup";
                    activeNode = ent.data;
                    entities.splice(i, 1); // Remove collected node
                }
            }
            
            if (ent.x + ent.w < 0) entities.splice(i, 1);
        }
        frame++;
    } 
    
    else if (state === "popup") {
        drawPopup();
    }
    
    else if (state === "gameover") {
        ctx.fillStyle = "#FF3366";
        ctx.font = "32px Arial";
        ctx.textAlign = "center";
        ctx.fillText("SYSTEM FAILURE", width / 2, height / 2);
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "20px Arial";
        ctx.fillText("Tap to Retry", width / 2, height / 2 + 50);
    }
    
    requestAnimationFrame(loop);
}

player.reset();
loop();

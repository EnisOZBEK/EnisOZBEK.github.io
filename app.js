const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let width,height;
function resize(){
width=window.innerWidth;
height=window.innerHeight;

canvas.width=width;
canvas.height=height;
}

window.addEventListener("resize",resize);
resize();

let scene="landing";
let activeSection=null;

const sections=[
"About",
"Experience",
"Skills",
"Contributions",
"Projects",
"Contact"
];

const content={

About:[
"Game Developer specializing in Unity and gameplay systems.",
"Passionate about creating mobile and PC games.",
"",
"Education:",
"• BSc Computer Engineering – Istanbul Gelisim University (2020–2024)",
"• Erasmus – NOVA University Lisbon (2023)",
"",
"Languages:",
"• Turkish (Native)",
"• English (Bilingual)"
],

Experience:[
"Lead Game Developer – Cim Games (2024–2025)",
"",
"• Led development of Brunswick (3D open-world survival mobile game)",
"• Wrote 20k+ lines of modular C# gameplay code",
"• Built player controller, inventory, crafting, AI systems",
"• Improved FPS by 70% on low-end devices",
"• Integrated ads, anti-cheat and async scene loading",
"",
"Game Developer – Reborn Interactive (Remote)",
"• Contributed to gameplay systems for PC titles"
],

Skills:[
"• Unity (2D/3D, URP)",
"• C#",
"• Gameplay Architecture",
"• System Design",
"• Mobile Optimization",
"• NavMesh & AI",
"• Git"
],

Contributions:[
"Jury Member & Organizer – IGU Game Jam",
"",
"• Co-organized event with 120+ participants",
"• Mentored developers on Unity & game design",
"• Evaluated submissions as jury member"
],

Projects:[
"Shatter Strike",
"3D mobile railroad runner with destruction effects",
"",
"Valorium: Vengeance",
"2D hack & slash adventure with puzzles and AI combat",
"",
"Stack Smash: Omicron",
"Arcade mobile stacking challenge game"
],

Contact:[
"Phone: +90 501 030 11 30",
"Email: Enisozbek1@gmail.com",
"",
"LinkedIn:",
"linkedin.com/in/enisözbek",
"",
"GitHub:",
"github.com/EnisOZBEK"
]

};

canvas.addEventListener("click",e=>{

if(scene==="landing"){
scene="hub";
return;
}

if(scene==="hub"){

let startY=150;

for(let i=0;i<sections.length;i++){

let x=width/2-200;
let y=startY+i*70;

if(
e.clientX>x &&
e.clientX<x+400 &&
e.clientY>y &&
e.clientY<y+50
){
activeSection=sections[i];
scene="section";
}

}

}

else if(scene==="section"){
scene="hub";
}

});

function drawLanding(){

ctx.fillStyle="#000";
ctx.fillRect(0,0,width,height);

ctx.fillStyle="cyan";
ctx.font="48px Arial";
ctx.textAlign="center";
ctx.fillText("Enis Özbek",width/2,height/2-40);

ctx.font="22px Arial";
ctx.fillText("Interactive Game Developer Resume",width/2,height/2);

ctx.font="20px Arial";
ctx.fillText("Click to Enter",width/2,height/2+80);

}

function drawHub(){

ctx.fillStyle="#000";
ctx.fillRect(0,0,width,height);

ctx.fillStyle="white";
ctx.font="32px Arial";
ctx.textAlign="center";
ctx.fillText("Explore Resume",width/2,80);

let startY=150;

for(let i=0;i<sections.length;i++){

let x=width/2-200;
let y=startY+i*70;

ctx.fillStyle="#111";
ctx.fillRect(x,y,400,50);

ctx.fillStyle="cyan";
ctx.font="20px Arial";
ctx.fillText(sections[i],width/2,y+32);

}

}

function drawSection(){

ctx.fillStyle="#000";
ctx.fillRect(0,0,width,height);

ctx.fillStyle="cyan";
ctx.font="32px Arial";
ctx.textAlign="center";
ctx.fillText(activeSection,width/2,80);

ctx.font="18px Arial";
ctx.fillStyle="white";

let lines=content[activeSection];

for(let i=0;i<lines.length;i++){

ctx.fillText(lines[i],width/2,150+i*28);

}

ctx.fillStyle="gray";
ctx.fillText("Click anywhere to return",width/2,height-60);

}

function loop(){

if(scene==="landing") drawLanding();
if(scene==="hub") drawHub();
if(scene==="section") drawSection();

requestAnimationFrame(loop);

}

loop();
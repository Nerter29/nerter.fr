import {setUpParticlesCanvas, setUpDrawingCanvas} from './canvas.js';
import {spawnParticles}  from './particles.js';
import {setUpCheckBoxes, getBoxIndex, setUpInputs} from './ui.js';



function createParticles(){ //create button
    let boxIndex = getBoxIndex(checkboxes)

    spawnParticles(p_radius_difference, p_acceleration_difference,
        p_list, canvas_size, boxIndex, drawnPoints, lineInputs)
}
function resetParticles() { //reset Button
    p_list.length = 0;
    particlesCtx.clearRect(0, 0, canvas_size[0], canvas_size[1]);
    mousePos = [canvas_size[0] / 2,canvas_size[1] / 2];
}

function eraseDrawing() { //erase Button
    drawnPoints.length = 0;
    drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
}
window.createParticles = createParticles;
window.resetParticles = resetParticles;
window.eraseDrawing = eraseDrawing;





function animateParticles(){ // main loop
    particlesCtx.clearRect( 0, 0, canvas_size[0], canvas_size[1]);
    

    for (let p of p_list) {
        if(mousePos[0] < 0 ){
            mousePos = [canvas_size[0] / 2,canvas_size[1] / 2];
        }

        p.accelerate_to_cursor(mousePos)
        p.bounce_on_borders(canvas_size, lineInputs[9].value);
        p.update();
        p.draw(particlesCtx);
    }

    requestAnimationFrame(() => animateParticles());
}



const p_number = 300;
const p_radius = 4;
const p_radius_difference = 0;
const p_acceleration = 0.1;
const p_acceleration_difference = 0.0;
//const max_speed = 10;
const bounce_factor = 0.5
let p_list = [];

let baseShapeValues = [800, 500, 300, 500, 200, 4, 0, 0.1, 0,0.5]
//baseShapeValues = [lineLength, circleRadius, spiralRadius, squareLength, p_number, radius, radius_diff, acceleration, acceleration_diff, bounce_factor]
const drawnPoints = [];



const particlesCanvas = document.getElementById("particlesCanvas");
const particlesCtx = particlesCanvas.getContext('2d');
setUpParticlesCanvas(particlesCanvas, p_list);
const canvas_size = [particlesCanvas.width, particlesCanvas.height];

const drawingCanvas = document.getElementById("drawingCanvas");
const drawingCtx = drawingCanvas.getContext("2d");
setUpDrawingCanvas(drawingCanvas, drawingCtx, drawnPoints, canvas_size);

let mousePos = [canvas_size[0] / 2,canvas_size[1] / 2];
document.addEventListener('mousemove', function(event) {
    const rect = particlesCanvas.getBoundingClientRect();
    mousePos = [event.clientX - rect.left, event.clientY - rect.top];})


//ui
const checkboxes = document.querySelectorAll('.exclusiveBox');
setUpCheckBoxes(checkboxes);

const lineInputs = document.querySelectorAll('.line-input');
setUpInputs(lineInputs, baseShapeValues);




setTimeout(() => {
    animateParticles();
}, 0);

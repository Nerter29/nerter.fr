import { resetVelocities } from './particles.js';

export function setUpParticlesCanvas(canvas, p_list){
  canvas.height = window.innerHeight - 120 -40;
  canvas.width = canvas.height + 200;


  canvas.addEventListener('click', function(event) {
    resetVelocities(p_list)})

}

export function setUpDrawingCanvas(canvas, context, drawnPoints, canvas_size){
  canvas.width = canvas_size[0] * 0.2;
  canvas.height = canvas_size[1] * 0.2;

  canvas.style.width = (canvas_size[0] * 0.2).toString() + "px";
  canvas.style.height = (canvas_size[1] * 0.2).toString() + "px";

  context.fillStyle = "white";
  context.fillRect(0, 0, canvas.width, canvas.height);

  let drawing = false;
  const pencilSize = 5;

  canvas.addEventListener("mousedown", () => drawing = true);
  canvas.addEventListener("mouseup", () => drawing = false);
  canvas.addEventListener("mouseleave", () => drawing = false);

  canvas.addEventListener("mousemove", (e) => {
    if (!drawing) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(e.clientX - rect.left);
    const y = Math.floor(e.clientY - rect.top);

    context.fillStyle = "black";
    context.beginPath();
    context.arc(x, y, pencilSize / 2, 0, Math.PI * 2);
    context.fill();

    if (!pointExists(x, y, drawnPoints)) {
      drawnPoints.push([x, y]);
    }});}

function pointExists(x, y, drawnPoints) {
  return drawnPoints.some(p => p[0] === x && p[1] === y);
}

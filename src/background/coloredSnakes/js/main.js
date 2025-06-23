/*
Inspired from the Particles Simulator Project, these snakes seems to have developped a particular attraction to the user's cursor,
but weirdly, they never manage to touch it and always orbit around it instead

Left click to randomize snakes' velocities
*/

import {spawnSnakes, randomizeVelocities} from './snake.js';

const canvas = document.getElementById('snakeCanvas');
const ctx = canvas.getContext('2d');
let topBannerHeight = canvas.getBoundingClientRect().top;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight - topBannerHeight - 42; // -3 because else the page has a scroll bar because it's a little bit too tall //42 : wallpaper

let mouseX = canvas.width / 2
let mouseY = canvas.height / 2 //the base mouse position is at the center of the screen
window.addEventListener('mousemove', function(event) {
    const rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;})

window.addEventListener('click', function(event) {
    randomizeVelocities(snakeList, startVelocity)})

const snakeList = []

//all settings that we can change
const cellSize = 13
const delayMilliseconds = 15
const snakeCount = 16 // 15
const bounceFactor = 0.2
const acceleration= 0.0035 // 0.004
const startVelocity = 0.6

const colorPeriod = 3000// number of frame necessary to make one full color loop // 100 000
const trailLength = 100; // 100
const trailIntensity = 0.3
const trailShininess = 0.3
let trailColorDifference = 6// the difference of colorCount beetween the head and tail of the snake // 30
const snakeColorDifference = (colorPeriod / snakeCount) / 7// the difference of color beetween all snakes (increase the last divider to decrease it, vice versa) // 5


let cellNumber = [Math.round(canvas.width / cellSize -1), Math.round(canvas.height / cellSize -2)]

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - topBannerHeight;
  ctx.clearRect( 0, 0, canvas.width, canvas.height);
  cellNumber = [Math.round(canvas.width / cellSize -1), Math.round(canvas.height / cellSize -2)]
})


//the intensity of the background on a scale from 0 to 1 (#222222 is 0.13, #000000 is 0)
//it is usefull to blend the tail of each snake in its bg
const bgIntensity = parseInt(getComputedStyle(document.body).backgroundColor.match(/\d+/g)[0]) / 255; 

spawnSnakes(snakeCount, snakeList, cellSize, cellNumber, startVelocity, acceleration, trailLength, trailIntensity, bgIntensity,
trailShininess, trailColorDifference, snakeColorDifference, colorPeriod)

//setInterval(animateSnakes, delayMilliseconds)
animateSnakes()
function animateSnakes(){ // main loop
  const mousePos = getMousePosition(cellSize, mouseX, mouseY);
  for (let snake of snakeList) {
    snake.accelerateToCursor(mousePos)
    snake.bounceOnBorders(cellNumber, bounceFactor)
    snake.update(ctx)
  }

  requestAnimationFrame(animateSnakes)
}

function getMousePosition(cellSize, mouseX, mouseY) {
  const col = Math.floor(mouseX / cellSize);
  const row = Math.floor(mouseY / cellSize);
  return [ col, row ];
}


class Snake{  // ça c'est ma classe
    constructor(x, y, size, vx, vy, acceleration, trailLength, trailIntensity, bgIntensity, trailShininess, colorCounter,
         trailColorDifference, colorPeriod){ 

        this.snakeCells = []; // head + trail
        this.size = size;

        this.x = x //
        this.y = y //float position of the snake head
        this.vx = vx;
        this.vy = vy;
        this.acceleration = acceleration;
        

        //every color shit
        this.trailIntensity = trailIntensity
        this.bgIntensity = bgIntensity
        this.trailShininess = trailShininess
        this.colorCounter = colorCounter
        this.trailLength = trailLength
        this.trailColorDifference = trailColorDifference
        this.colorPeriod = colorPeriod

        //initialize the snakeCells list with a lot of the head coordinate so it does not mess with the colors at the start
        for(let i = 0; i < trailLength; i++){ 
            this.snakeCells.push([this.x, this.y, 0])
        }

        this.oneColorCycle = 360 / ((colorPeriod - trailLength * trailColorDifference) - 1)
    }
    fillCells(ctx) {
        for (const [col, row, color] of this.snakeCells) {
            ctx.fillStyle = color;
            const x =col * this.size
            const y =row * this.size
            ctx.fillRect(x, y,this.size ,this.size );
        }
    }
    moveToNextCell(ctx, col, row){
        //each time we add a square at the top of the snake, we remove one trail square, if the snake is long enough (it always is thanks to
        //the initialisation at line 26)
        this.snakeCells.push([col, row, 0]);
        if(this.snakeCells.length >= this.trailLength){
            this.snakeCells.splice(0,1) // splice is a weird word that mean remove
        }
        this.updateColors()
        this.fillCells(ctx);
    }
    accelerateToCursor(mousePos){
        const dx = this.x - mousePos[0];
        const dy = this.y - mousePos[1];
        const totalDistance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)) // norm of a vector
        let direction = [-dx / totalDistance, -dy / totalDistance];
        this.vx += direction[0] * this.acceleration;
        this.vy += direction[1] * this.acceleration
    }
    bounceOnBorders(canvasSize, bounceFactor){
        if(this.x < 0 ){ this.vx *= -bounceFactor; this.x += 1}
        if(this.x > canvasSize[0]){ this.vx *= -bounceFactor; this.x -= 1}
        if(this.y < 0){ this.vy *= -bounceFactor; this.y += 1}
        if(this.y > canvasSize[1]){ this.vy *= -bounceFactor; this.y -= 1}
    }
    updateColors(){
        //complicated stuff to make every cells of every snake nice to look at
        const n = this.trailLength
        this.colorCounter++

        for(let i = n - 1; i >= 0; i--){
            const intensity = ((this.trailIntensity - this.bgIntensity) * (i / (n-2)) + this.bgIntensity)
            const shininess = (this.trailShininess * (i / (n-2)))
            this.snakeCells[i][2] = rainbowColors(i, this.oneColorCycle, intensity * 100,this.trailColorDifference,
                 shininess * 100, this.colorCounter)
        }
    }
    update(ctx){
        this.x += this.vx
        this.y += this.vy

        this.moveToNextCell(ctx, Math.round(this.x), Math.round(this.y))
    }
}

function rainbowColors(cellIndex, oneColorCycle , intensity, trailColorDifference, shininess, colorCounter){
    //get the color of a cell based on its index on the snake  and the instant of the period
    const value = (colorCounter + cellIndex * trailColorDifference);
    const hue = (oneColorCycle * value) % 360;
    return `hsl(${hue}, ${shininess}%, ${intensity}%`
}

export function spawnSnakes(snakeCount, snakeList, size, canvasCells, startVelocity, acceleration,trailLength, trailIntensity, bgIntensity,
                            trailShininess, trailColorDifference, snakeColorDifference, colorPeriod){
    //spawn snakes at random position and random base velovity
    for(let i = 0; i < snakeCount; i++){
        const x  =Math.round(Math.random() * canvasCells[0])
        const y = Math.round(Math.random() * canvasCells[1])
        const colorCounter = i * snakeColorDifference

        const velocity = randomVelocity(startVelocity)
        const vx = velocity[0]
        const vy = velocity[1]

        snakeList.push( new Snake(x, y, size, vx , vy, acceleration,trailLength, trailIntensity, bgIntensity,
            trailShininess, colorCounter, trailColorDifference, colorPeriod))
    }
}
function randomVelocity(startVelocity){
    // give a random repartition of vx and vy so the norm of vx and vy give startVelocity back (I think it works but we dont care cause we dont precisely see it)

    let vx = (Math.random() * 2 - 1) * startVelocity // (Math.random() * 2 - 1) : random number beetween -1 and 1
    let vy =  Math.sign(Math.random() * 2 - 1) * (Math.sqrt(startVelocity * startVelocity - vx * vx)) // (-1 or 1) * the rest of the velocity
    return [vx, vy]
}

export function randomizeVelocities(snakeList, startVelocity){
    for (let snake of snakeList){
        const velocity = randomVelocity(startVelocity)
        snake.vx = velocity[0]
        snake.vy = velocity[1]
    }
}


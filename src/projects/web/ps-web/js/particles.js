import { randomInRange, getColorFromSpectrum, normalize } from './utils.js';



class Particle{
    constructor(x, y, radius, vx, vy, color, acceleration){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = vx;
        this.vy = vy;
        this.acceleration = acceleration;
        this.color = color;

    }
    draw(ctx){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

    }
    accelerate_to_cursor(mousePos){
        const dx = this.x - mousePos[0];
        const dy = this.y - mousePos[1];
        const total_distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))//Math.abs(dx) + Math.abs(dy)
        let direction = normalize([-dx / total_distance, -dy / total_distance]);
        this.vx += direction[0] * this.acceleration;
        this.vy += direction[1] * this.acceleration
        /*
        this.vx = Math.max(-max_speed, Math.min(max_speed, this.vx)); //clamp
        this.vy = Math.max(-max_speed, Math.min(max_speed, this.vy));
        */
    }
    bounce_on_borders(canvas_size, bounce_factor){
        if(this.x < 0 ){ this.vx *= -bounce_factor; this.x += 3}
        if(this.x > canvas_size[0]){ this.vx *= -bounce_factor; this.x -= 3}
        if(this.y < 0){ this.vy *= -bounce_factor; this.y += 3}
        if(this.y > canvas_size[1]){ this.vy *= -bounce_factor; this.y -= 3}


    }
    update(){
        this.x += this.vx;
        this.y += this.vy;

    }
}


function randomFormation(canvas_size){
    return [randomInRange(20, canvas_size[0] -20), randomInRange(20, canvas_size[1] -20)]
}
function linearFormation(p_index, length, y, canvas_size, p_number){
    const spacing_factor = length / p_number
    const x = canvas_size[0] / 2 + p_index * spacing_factor - (p_number * spacing_factor / 2);
    return [x,y]
}
function circleFormation(p_index, radius, canvas_size, p_number){
    const angleDeg = (p_index * (360 / p_number))
    const angleRad = angleDeg * Math.PI / 180.0
    const x = canvas_size[0] / 2 + radius * Math.cos(angleRad);
    const y = canvas_size[1] / 2 + radius * Math.sin(angleRad);
    return [x,y]
}
function spiralFormation(p_index, angle_factor, radius, adjustment_factor, canvas_size, p_number){
    const radius_factor = radius / p_number
    const r = p_index * radius_factor
    const angleDeg = ((p_index * angle_factor)- r * adjustment_factor) % 360
    const angleRad = angleDeg * Math.PI / 180.0
    const x = canvas_size[0] / 2 + r * Math.cos(angleRad);
    const y = canvas_size[1] / 2 + r * Math.sin(angleRad);
    return [x,y]
}

function squareFormation(p_index, side_length, canvas_size, p_number) {
    const point_spacing = (side_length / p_number) * 4
    const perimeter = 4 * side_length;
    const distance_along_edge = (p_index * point_spacing) % perimeter;
    const half = side_length / 2;

    let x = 0;
    let y = 0;

    if (distance_along_edge < side_length) {
        x = -half + distance_along_edge;
        y = -half;
    } else if (distance_along_edge < 2 * side_length) {
        x = half;
        y = -half + (distance_along_edge - side_length);
    } else if (distance_along_edge < 3 * side_length) {
        x = half - (distance_along_edge - 2 * side_length);
        y = half;
    } else {
        x = -half;
        y = half - (distance_along_edge - 3 * side_length);
    }
    return [canvas_size[0] / 2 + x, canvas_size[1] / 2 + y];
}


export function resetVelocities(p_list){
    for (let p of p_list) {
        p.vx = 0
        p.vy = 0
    }
}


function instantiateParticles(p_number, p_radius, p_radius_difference, p_acceleration, p_acceleration_difference, p_list, position,i){

    p_list.push(new Particle(
        position[0],
        position[1],
        randomInRange(p_radius - p_radius_difference, p_radius + p_radius_difference),
        0, 0,
        getColorFromSpectrum(i, p_number,1),//`rgb(${randomInRange(120, 255)}, ${randomInRange(120, 255)}, ${randomInRange(120, 255)})`,
        randomInRange((p_acceleration - p_acceleration_difference) * 1000, (p_acceleration + p_acceleration_difference) * 1000) / 1000
    ));
}


export function spawnParticles(p_radius_difference, p_acceleration_difference,
                                p_list, canvas_size, boxIndex, drawPoints, lineInputs) {
    let position = []
    if(boxIndex != 5){
        for (let i = 0; i <  parseFloat(lineInputs[4].value); i++) {

            if(boxIndex === 0) { position = randomFormation(canvas_size)}
            if(boxIndex === 1) { position = linearFormation(i, parseFloat(lineInputs[0].value), 100, canvas_size,  parseFloat(lineInputs[4].value))}
            if(boxIndex === 2) { position = circleFormation(i, parseFloat(lineInputs[1].value), canvas_size, parseFloat(lineInputs[4].value))}
            if(boxIndex === 3) { position = spiralFormation(i, 15, parseFloat(lineInputs[2].value), 5, canvas_size, parseFloat(lineInputs[4].value))}
            if(boxIndex === 4) { position = squareFormation(i, parseFloat(lineInputs[3].value), canvas_size, parseFloat(lineInputs[4].value))}

            instantiateParticles(parseFloat(lineInputs[4].value), parseFloat(lineInputs[5].value), parseFloat(lineInputs[6].value), parseFloat(lineInputs[7].value), parseFloat(lineInputs[8].value), p_list, position,i)
        }
    }
    else{
        for (let i = 0; i < drawPoints.length; i++) {
        position = [drawPoints[i][0] * 5, drawPoints[i][1] * 5]
        instantiateParticles(drawPoints.length, parseFloat(lineInputs[5].value), parseFloat(lineInputs[6].value), parseFloat(lineInputs[7].value), parseFloat(lineInputs[8].value), p_list, position,i)

        }

    }


}


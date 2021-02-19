//stored variables
const pi = Math.PI;

//storage for the cube coord and line data
const cubeCoords = [[2,2,2],[-2,2,2],[2,-2,2],[2,2,-2],[-2,-2,2],[-2,2,-2],[2,-2,-2],[-2,-2,-2]];
const cubeLines = [[4,1],[1,0],[0,2],[2,4],[4,7],[2,6],[0,3],[1,5],[6,7],[7,5],[5,3],[3,6]];
//storage for the tetrahedron coord and line data
const tetraCoords = [[1,0,-1/(2**0.5)],[-1,0,-1/(2**0.5)],[0,1,1/(2**0.5)],[0,-1,1/(2**0.5)]];
const tetraLines = [[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]];

let coords = [[2,2,2],[-2,2,2],[2,-2,2],[2,2,-2],[-2,-2,2],[-2,2,-2],[2,-2,-2],[-2,-2,-2]];
let lines = [[4,1],[1,0],[0,2],[2,4],[4,7],[2,6],[0,3],[1,5],[6,7],[7,5],[5,3],[3,6]];


let perspectiveEnabled = true; //This will decide whether or not to use perspective during rendering

function perspectiveChange() {
    if (perspectiveEnabled == false) {
        perspectiveEnabled = true;
    }
    else if (perspectiveEnabled == true) {
        perspectiveEnabled = false;
    }
    render(coords);
}

let followEnabled = true; //This will let the shape keep facing the mouse curser

function followChange() {
    if (followEnabled == false) {
        followEnabled = true;
    }
    else if (followEnabled == true) {
        followEnabled = false;
    }
    render(coords);
}

//selects the cube as the working shape
function cubeSelect() {
    coords = arrCopy(cubeCoords);
    lines = arrCopy(cubeLines);
    render(coords);
}

//selects the tetrahedron as the working shape
function tetraSelect() {
    coords = arrCopy(tetraCoords);
    lines = arrCopy(tetraLines);
    render(coords);
}

//returns a copy of an array
function arrCopy(arr){
    let hold = [];
    for (let i = 0; i < arr.length; i++){
        hold.push(arr[i]);
    }
    return hold;
}

//Add two vectors
function vecAdd(vec1, vec2) {
    let hold = [];
    for (let i = 0; i < vec1.length; i++){
        hold.push(vec1[i] + vec2[i]);
    }
    return hold;
}

//Returns dot product of two vectors
function vecDot(vec1, vec2) {
    let hold = 0;
    for (let i = 0; i < vec1.length; i++){
        hold += vec1[i]*vec2[i];
    }
    return hold;
}

//returns vector magnitude
function vecMag(vec) {
    let hold = 0;
    for (let i = 0; i < vec.length; i++){
        hold += vec[i]**2;
    }
    return (hold)**0.5;
}

//finds the difference between two vectors vec1 - vec2
function vecDiff(vec1, vec2) {
    let hold = [];
    for (let i = 0; i < vec1.length; i++){
        hold.push(vec1[i] - vec2[i]);
    }
    return hold;
}

//finds the distance between two vectors
function vecDist(vec1, vec2) {
    return vecMag(vecDiff(vec1, vec2));
}

//scalar multiply a vector
function vecScale(scale, vec) {
    let hold = [];
    for (let i = 0; i < vec.length; i++){
        hold.push(scale*vec[i]);
    }
    return hold;
}

//returns the cross product of two vectors
function vecCross(vec1, vec2) {
    return [vec1[1]*vec2[2]-vec1[2]*vec2[1], vec1[2]*vec2[0]-vec1[0]*vec2[2], vec1[0]*vec2[1]-vec1[1]*vec2[0]];
}

//returns array with [innerHeight, innerWidth]
function getViewSizes() {
    winHeight = window.innerHeight;
    winWidth = window.innerWidth;
}


//creates canvas and scales to the best fit
function scaleCanvas() {
    const scale = 1;
    document.getElementById("mainCanvas").height = scale*window.innerHeight;
    document.getElementById("mainCanvas").width = scale*window.innerWidth;
}


//function that does everything that needs to be done after a window resize
function windowResize() {
    scaleCanvas()
    render(coords)
}
window.addEventListener('resize', windowResize);

//sets biggestMag to current value
function biggestMag(coords) {
    let hold = 0;
    for (let i = 0; i < coords.length; i++) {
        if (vecMag(coords[i]) > hold) {
            hold = vecMag(coords[i]);
        }
    }
    return hold;
}

//Takes coorda and rotates them in the yz-plane
function rotYZ(coords, theta) {
    for (let i = 0; i < coords.length; i++){
        let y = coords[i][1];
        let z = coords[i][2];
        coords[i][1] = y*Math.cos(theta) - z*Math.sin(theta);
        coords[i][2] = y*Math.sin(theta) + z*Math.cos(theta);
    }
}
function doRotYZ() {
    rotYZ(coords, pi/12);
    render(coords);
}

//Takes coorda and rotates them in the xz-plane
function rotXZ(coords, theta) {
    for (let i = 0; i < coords.length; i++){
        let x = coords[i][0];
        let z = coords[i][2];
        coords[i][0] = x*Math.cos(theta) - z*Math.sin(theta);
        coords[i][2] = x*Math.sin(theta) + z*Math.cos(theta);
    }
}
function doRotXZ() {
    rotXZ(coords, pi/12);
    render(coords);
}

//Takes coorda and rotates them in the xz-plane
function rotXY(coords, theta) {
    for (let i = 0; i < coords.length; i++){
        let x = coords[i][0];
        let y = coords[i][1];
        coords[i][0] = x*Math.cos(theta) - y*Math.sin(theta);
        coords[i][1] = x*Math.sin(theta) + y*Math.cos(theta);
    }
}
function doRotXY() {
    rotXY(coords, pi/12);
    render(coords);
}


//Takes the coords and scales it to fit the canvas
function scaleCoords(coords, scalePerc) {
    let hold = arrCopy(coords);
    let hbm = biggestMag(hold);
    const canHeight = document.getElementById("mainCanvas").height;
    const canWidth = document.getElementById("mainCanvas").width;
    const smallerDim = (canHeight < canWidth) ? canHeight : canWidth;
    const scale = (scalePerc*smallerDim/2)/hbm;
        for (let i = 0; i < hold.length; i++){
            hold[i] = vecScale(scale, hold[i]);
        }
    return hold;
}


//checks for perspective and returns new scaled coordinates
//canDist is the distance from (0,0,0) to the center of the canvas
//eyeDist is distance from the center of the canvas to the eye
function setPersp(coords, canDist, eyeDist) {
    let hold = [];
    if (perspectiveEnabled == false) {
        for (let i = 0; i < coords.length; i++){
            hold.push(coords[i]);
        }
    }
    else if (perspectiveEnabled == true) {
        for (let i = 0; i < coords.length; i++){
            let rastCoord = [];
            let x = coords[i][0];
            let y = coords[i][1];
            let z = coords[i][2];
            let t = (canDist - z)/(canDist + eyeDist - z);
            rastCoord.push(x*(1-t));
            rastCoord.push(y*(1-t));
            hold.push(rastCoord);
        }
    }
    return hold;
}


//Takes the coord and line data and renders them to the canvas
function render(coords){
    const canCenX = document.getElementById("mainCanvas").width/2;
    const canCenY = document.getElementById("mainCanvas").height/2;
    let scaledCoords = scaleCoords(coords, 4); //resizes coords so that they will fit the canvas nicely
    const bm = biggestMag(scaledCoords);
    const eyeDist = bm;
    const canDist = 4*bm;
    let finCoords = setPersp(scaledCoords, canDist, eyeDist); //returns coords with possible perspective altering
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#FFFFFF";
    for (let i = 0; i < lines.length; i++){
        ctx.beginPath();
        ctx.moveTo(canCenX + finCoords[lines[i][0]][0], canCenY + finCoords[lines[i][0]][1]);
        ctx.lineTo(canCenX + finCoords[lines[i][1]][0], canCenY + finCoords[lines[i][1]][1]);
        ctx.stroke();
    }
}

//Takes the coord and line data and renders them to the canvas
function trender(coords){
    const canCenX = document.getElementById("mainCanvas").width/2;
    const canCenY = document.getElementById("mainCanvas").height/2;
    const bm = biggestMag(coords);
    const eyeDist = 2*bm;
    const canDist = 2*bm;
    let perspCoords = setPersp(coords, canDist, eyeDist); //returns coords with possible perspective altering
    let finCoords = scaleCoords(perspCoords, 0.95); //resizes coords so that they will fit the canvas nicely
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#FFFFFF";
    for (let i = 0; i < lines.length; i++){
        ctx.beginPath();
        ctx.moveTo(canCenX + finCoords[lines[i][0]][0], canCenY + finCoords[lines[i][0]][1]);
        ctx.lineTo(canCenX + finCoords[lines[i][1]][0], canCenY + finCoords[lines[i][1]][1]);
        ctx.stroke();
    }
}


//Takes a point on the canvas, returns new set of unit vectors, scale can change how big the canvas is relative to the shape (needs implementing)
function turnUnits(px, py, canDist, scale) {
    const pVec = [scale*px, scale*py, canDist]; //vector of mouse pointer (scale will go here if needs be)
    const pMag = vecMag(pVec); //Finds magnitude
    const kuVec = vecScale((1/pMag), pVec); //Tunrs pVec into a unit vector. This is the same as the k unit vector due to the rotation point being (0,0,0)
    const kjCross = vecCross(kuVec, [0,1,0]);
    const kjcMag = vecMag(kjCross);
    const iuVec = vecScale((1/kjcMag), kjCross);
    const juVec = vecCross(kuVec, iuVec);
    return [iuVec, juVec, kuVec];
}

//Takes a coordinate and a set of unit vectors, rebuilds in the new basis
function turnCoord(coord, units) {
    const nx = vecScale(coord[0], units[0]);
    const ny = vecScale(coord[1], units[1]);
    const nz = vecScale(coord[2], units[2]);
    let hold = vecAdd(vecAdd(nx, ny), nz);
    if (coord.length == 4) {
        return hold.push(coord[3]);
    }
    else {
        return hold;
    }
}

function turnPoints(coords, px, py, canDist) {
    const units = turnUnits(px, py, canDist, 1/100);
    let hold = arrCopy(coords);
    for (let i = 0; i < hold.length; i++){
        hold[i] = turnCoord(hold[i], units)
    }
    render(hold)
}

function testMouseFollow(canvas, coords, evt) {
    const bm = biggestMag(coords);
    const canDist = 2*bm;
    const mp = getMousePos(canvas, evt);
    const canCenX = document.getElementById("mainCanvas").width/2;
    const canCenY = document.getElementById("mainCanvas").height/2;
    turnPoints(coords, mp[0] , mp[1] , canDist);
}

//returns object with mouse position
function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return [evt.clientX - rect.left, evt.clientY - rect.top];
      }


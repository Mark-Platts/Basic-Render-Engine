//stored variables
let coords = [[2,2,2],[-2,2,2],[2,-2,2],[2,2,-2],[-2,-2,2],[-2,2,-2],[2,-2,-2],[-2,-2,-2]];
let lines = [[4,1],[1,0],[0,2],[2,4],[4,7],[2,6],[0,3],[1,5],[6,7],[7,5],[5,3],[3,6]];
let biggestMag = 0;

let winHeight = 0;
let winWidth = 0;


let perspectiveEnabled = false; //This will decide whether or not to use perspective during rendering






//Add two vectors
function vecAdd(vec1, vec2) {
    let hold = [];
    for (let i = 0; i < vec1.length; i++){
        hold.push(vec1[i] + vec2[i]);
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

//scalar multiply a vector
function vecScale(scale, vec) {
    hold = [];
    for (let i = 0; i < vec.length; i++){
        hold.push(scale*vec[i]);
    }
    return hold;
}

//returns array with [innerHeight, innerWidth]
function getViewSizes() {
    winHeight = window.innerHeight;
    winWidth = window.innerWidth;
}


//creates canvas and scales to the best fit
function createCanvas() {
    const scale = 0.96;
    const canvasWidth = scale*window.innerWidth;
    const canvasHeight = scale*window.innerHeight;
    const hold = '<center><canvas id="mainCanvas" height='+canvasHeight+' width='+canvasWidth+'></canvas></center>';
    document.getElementById("canvasHolder").innerHTML = hold;
}

//creates canvas and scales to the best 16:9 fit
function OLDcreateCanvas() {
    const scale = 0.95;
    const innerWidth = scale*window.innerWidth;
    const innerHeight = scale*window.innerHeight;
    let canvasWidth = ((9/16)*innerWidth < innerHeight) ? innerWidth:(16/9)*innerHeight;
    let canvasHeight = ((9/16)*innerWidth < innerHeight) ? (9/16)*innerWidth:innerHeight;
    //if (innerWidth > 840 && innerHeight > 525) {
    //    canvasWidth = 840;
    //    canvasHeight = 525;
    //}
    const hold = '<canvas id="mainCanvas" height='+canvasHeight+' width='+canvasWidth+'></canvas>';
    document.getElementById("canvasHolder").innerHTML = hold;
}

//function that does everything that needs to be done after a window resize
function windowResize() {
    createCanvas()
    renderLines()
}
window.addEventListener('resize', windowResize);

//sets biggestMag to current value
function setBiggestMag() {
    hold = 0;
    for (let i = 0; i < coords.length; i++) {
        if (vecMag(coords[i]) > biggestMag) {
            biggestMag = vecMag(coords[i]);
        }
    }
    console.log(String(biggestMag))
}

//Takes the coords and scales it to fit the canvas
function scaleCoords() {
    setBiggestMag()
    const canHeight = document.getElementById("mainCanvas").height;
    if (biggestMag > canHeight/2) {
        const scale = biggestMag/(canHeight/2);
        for (let i = 0; i < coords.length; i++){
            coords[i] = vecScale(0.95*scale, coords[i]);
        }
    }
    else if (biggestMag < canHeight/10) {
        const scale = (canHeight/2)/biggestMag;
        for (let i = 0; i < coords.length; i++){
            coords[i] = vecScale(0.95*scale, coords[i]);
        }
    }
}

//checks for perspective and returns new scaled coordinates
function setPersp(canCenZ) {
    let hold = [];
    if (perspectiveEnabled == false) {
        for (let i = 0; i < coords.length; i++){
            hold.push(coords[i]);
        }
    }
    else if (perspectiveEnabled == true) {
        for (let i = 0; i < coords.length; i++){
            scale = 100/(canCenZ + coords[i][2]);
            hold.push(vecScale(scale,coords[i]));
        }
    }
    return hold;
}

//Takes the coord and line data and renders them to the canvas
function renderLines(){
    const canCenX = document.getElementById("mainCanvas").width/2;
    const canCenY = document.getElementById("mainCanvas").height/2;
    const canCenZ = biggestMag;
    setBiggestMag();
    scaleCoords(coords); //resizes coords so that they will fit the canvas nicely
    finCoords = setPersp(canCenZ); //returns coords with possible perspective altering
    scaleCoords(finCoords);
    const canvas = document.getElementById("mainCanvas");
    let ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#FFFFFF";
    for (let i = 0; i < lines.length; i++){
        ctx.moveTo(canCenX + finCoords[lines[i][0]][0], canCenY + finCoords[lines[i][0]][1]);
        ctx.lineTo(canCenX + finCoords[lines[i][1]][0], canCenY + finCoords[lines[i][1]][1]);
        ctx.stroke();
    }
}

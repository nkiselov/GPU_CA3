(()=>{

let colors = [
    "#FF0000", // Bright Red
    "#0000FF", // Blue
    "#008000", // Dark Green (better than lime for visibility)
    "#FFA500", // Orange
    "#800080", // Purple
    "#00FFFF", // Cyan
    "#FF00FF", // Magenta
    "#FF4500", // Orange-Red
    "#006400", // Deep Green
    "#000080", // Navy Blue
    "#8B0000", // Dark Red
    "#4B0082", // Indigo
    "#008080", // Teal
    "#FF8C00", // Dark Orange
    "#9932CC", // Dark Orchid
    "#2E8B57", // Sea Green
    "#A52A2A"  // Brown
];

let dt = 0.02

let plots = colors.map(c=>makeTimePlot(makePlot(800,300,c),Infinity))
let plotTitles = neural.stateLabels().slice(3)
let running = true
let neuronState = neural.initVecNeuron([0,0,0.1])
let time = 0

// function diffeqStep(x0){
//     let xm = vecAdd(x0,vecMul(dt/2, neural.stepVecNeuron(x0)))
//     return vecAdd(x0,vecMul(dt,neural.stepVecNeuron(xm)))
// }

function rk4Step(x0){
    let x1 = neural.stepVecNeuron(x0)
    let x2 = neural.stepVecNeuron(vecAdd(x0,vecMul(dt/2,x1)))
    let x3 = neural.stepVecNeuron(vecAdd(x0,vecMul(dt/2,x2)))
    let x4 = neural.stepVecNeuron(vecAdd(x0,vecMul(dt,x3)))
    return vecAdd(x0,vecMul(dt/6,vecAdd(vecAdd(x1,vecMul(2,x2)),vecAdd(vecMul(2,x3),x4))))
}

function midStep(x0){
    let x1 = vecAdd(x0,vecMul(dt, neural.stepVecNeuron(x0)))
    return vecAdd(x0,vecMul(dt/2,vecAdd(neural.stepVecNeuron(x0),neural.stepVecNeuron(x1))))
}

function eulerStep(x0){
    return vecAdd(x0,vecMul(dt, neural.stepVecNeuron(x0)))
}

let diffeqStep = rk4Step

function runStep(){
    if(running){
        // for(let q=0; q<10; q++){
        for(let it=0; it<10; it++){
            time+=dt
            neuronState = diffeqStep(neuronState)
        }
            for(let i=0; i<plots.length; i++) plots[i].add(time,neuronState[3+i])
        // }
    }
    requestAnimationFrame(runStep)
}

runStep()

let main = makevbox([
    makehbox([
        makeButton("Run",()=>running=true),
        makeButton("Stop",()=>running=false),
        makeButton("Restart",()=>{
            neuronState = neural.initVecNeuron([0,0,0.1])
            for(let i=0; i<plots.length; i++) plots[i].reset()
            running=true
        }),
        makeDropdown("Method",["euler","mid","rk4"],ind=>diffeqStep=[eulerStep,midStep,rk4Step][ind],0),
        makeInput("dt",0.02,val=>dt=val).html

    ]),
    ...plots.map((p,i)=>makehbox([p.html,makeh(plotTitles[i])]))
])

document.body.appendChild(main)
})()
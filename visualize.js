loadAndDeserializeNetimages("debugInter20x20.bin").then(data=>{

console.log(data)

let curInd = 0
let visual = makeGridImageVisual(data.spec,data.images)
let rewind = false
let rewindToggle = makeToggle(rewind,(val)=>rewind=val)
let iterLabel = makeh(curInd)

function step(){
    if(rewind) curInd = (curInd+data.images.length-1)%data.images.length
    else curInd = (curInd+1)%data.images.length
    iterLabel.innerHTML = curInd
    visual.setImage(curInd)
}

let running = false
function loop(){
    if(running) step()
    requestAnimationFrame(loop)
}

requestAnimationFrame(loop)

let main = makevbox([
    makehbox([
        makeButton("Run",()=>running = true),
        makeButton("Stop",()=>running = false),
        makeButton("Step",()=>step()),
        makeh("Rewind"),
        rewindToggle.html,
        makeh("Iter #"),
        iterLabel
    ]),
    visual.html
])

document.body.appendChild(main)
})
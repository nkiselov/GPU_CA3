loadAndDeserializeNetimages("grid10x10.bin").then(data=>{

console.log(data)

let visual = makeGridImageVisual(data.spec,data.images[0])
let curInd = 20
let rewind = false
let rewindToggle = makeToggle(rewind,(val)=>rewind=val)

function step(){
    if(rewind) curInd = (curInd+data.images.length-1)%data.images.length
    else curInd = (curInd+1)%data.images.length
    visual.setImage(data.images[curInd])
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
        rewindToggle.html
    ]),
    visual.html
])

document.body.appendChild(main)
})
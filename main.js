(()=>{

let dt = 0.01
let colors = ['red','green','blue']
let plots = colors.map(c=>makeTimePlot(makePlot(800,300,c),Infinity))
let running = true
let neuron = makeNeuron()
let time = 0
neuron.setCurrents([0,0.05,0])

function runStep(){
    if(running){
        // for(let q=0; q<10; q++){
            for(let it=0; it<20; it++){
            time+=dt
            neuron.step(dt)
            }
            let pots = neuron.getPotentials()
            for(let i=0; i<3; i++) plots[i].add(time,pots[i])
        // }
    }
    requestAnimationFrame(runStep)
}

runStep()

let main = makevbox([
    makehbox([
        makeButton("Run",()=>running=true),
        makeButton("Stop",()=>running=false)
    ]),
    ...plots.map(p=>p.html)
])

document.body.appendChild(main)

})()
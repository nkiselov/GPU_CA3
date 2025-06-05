function makehbox(elems){
    let hbox = document.createElement("div")
    hbox.className = "hbox"
    elems.forEach((e)=>hbox.appendChild(e))
    return hbox
}

function makevbox(elems){
    let vbox = document.createElement("div")
    vbox.className = "vbox"
    elems.forEach((e)=>vbox.appendChild(e))
    return vbox
}

function makeboxref(box){
    return (elems)=>{
        box.innerHTML = ''
        elems.forEach((e)=>box.appendChild(e))
    }
}
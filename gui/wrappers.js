function makeh(text){
    let h = document.createElement("h")
    h.innerHTML = text
    return h
}

function makeButton(label, onclick){
    let button = document.createElement("button")
    button.onclick = onclick
    button.innerHTML = label
    return button
}


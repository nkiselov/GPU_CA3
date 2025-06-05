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

function makeDropdown(label, options, onchange, ind=0) {
    const select = document.createElement("select");
    options.forEach(opt => {
      const option = document.createElement("option");
      option.value = opt;
      option.text = opt;
      select.appendChild(option);
    });
    select.onchange = () => onchange(select.selectedIndex)
    select.selectedIndex = ind
    onchange(select.selectedIndex)
    const text = document.createElement("h");
    text.innerHTML = label;
  
    const cont = document.createElement("div");
    cont.className = "hbox";
    cont.appendChild(text);
    cont.appendChild(select);
    return cont;
}

function makeInput(label,value,onchange){
    let inp = document.createElement("input")
    inp.type = "number"
    inp.value = value
    inp.onchange = ()=>onchange(parseFloat(inp.value))
    let text = document.createElement("h")
    text.innerHTML=label
    let cont = document.createElement("div")
    cont.className = "hbox"
    cont.appendChild(text)
    cont.appendChild(inp)
    onchange(value)
    return {
        html: cont,
        setValue: val=>{
            inp.value = val
            onchange(val)
        },
        getValue: ()=>{
            return inp.value
        }
    }
}

function makeToggle(checked, onchange){
    let tog = document.createElement("input")
    tog.type = "checkbox"
    tog.checked = checked
    tog.onchange = ()=>onchange(tog.checked)
    return {
        html: tog,
        setValue: val=>{
            tog.checked=val
            onchange(val)
        },
        getValue: ()=>{
            return tog.checked
        }
    }
}
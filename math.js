function vecAdd(a,b){
    let res = Array(a.length).fill(0)
    for(let i=0; i<a.length; i++) res[i] = a[i]+b[i]
    return res
}

function vecMul(k,a){
    let res = Array(a.length).fill(0)
    for(let i=0; i<a.length; i++) res[i] = k*a[i]
    return res
}
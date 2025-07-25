//9 - many + high inh
//10 - many + low inh
//13 - few + high inh
//14 - few + low inh
//15 no inh

//20 - limit case
//21 - few inh
// deserializeFireHist("behavior_types_20/solitons_20_10_10_3.bin").then(data=>{

// deserializeFireHist("behavior_types_20/algae_20_5_5_3.bin").then(data=>{

// deserializeFireHist("behavior_types_20/ring_20_0_0_3.bin").then(data=>{

// deserializeFireHist("behavior_types_20/algae_20_2_2_3.bin").then(data=>{

deserializeFireHist("google_grid100_d8_r10.bin").then(data=>{

console.log(data)

let updateFS = `#version 300 es
precision highp float;
in vec2 texCoord;
out vec4 outColor;
uniform int boundLow;
uniform int boundHigh;
uniform int hsz;

uniform sampler2D srcTex;
uniform sampler2D lookupTex;
uniform sampler2D histTex;

void main(){
    vec4 curVal = texture(srcTex,texCoord);
    vec4 target = texture(lookupTex,texCoord);
    for(int i=boundLow; i<boundHigh; i++){
        vec2 crd = vec2(0.5,0.5)/float(hsz) + vec2(float(i%hsz)/float(hsz),float(i/hsz)/float(hsz));
        if(texture(histTex,crd)==target) curVal.z = 1.0;
    }
    outColor = curVal;
}
`

let fadeFS = `#version 300 es
precision highp float;
in vec2 texCoord;
out vec4 outColor;
uniform sampler2D srcTex;
uniform float decay;

void main(){
    vec4 curVal = texture(srcTex,texCoord);
    curVal.z = max(0.0,curVal.z-decay);
    outColor = curVal;
}
`

let copyFS = `#version 300 es
precision highp float;
in vec2 texCoord;
out vec4 outColor;
uniform sampler2D srcTex;

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main(){
    outColor = texture(srcTex,texCoord);
    //outColor = (outColor + vec4(0.0,0.0,0.0,1.0));
    //outColor/=max(outColor.x,max(outColor.y,outColor.z));
    outColor.w=1.0;
    outColor.xyz = hsv2rgb(vec3(1.0-outColor.z,1.0,1.0))*outColor.z;
}
`

let zeroFS = `#version 300 es
precision highp float;
out vec4 outColor;

void main(){
    outColor = vec4(0.0,0.0,0.0,1.0);
}
`

let size = data.spec.size

let canvas = document.createElement("canvas")
canvas.width = size
canvas.height = size
canvas.style.width = "100%"
canvas.style.imageRendering = "pixelated"
let gl = canvas.getContext("webgl2")

// if (!gl.getExtension('OES_texture_float_linear'))
//     throw new Error('Not found OES_texture_float_linear')
if (!gl.getExtension('EXT_color_buffer_float'))
    throw new Error('Not found EXT_color_buffer_float')

document.body.appendChild(canvas)


let lookup = new Uint8Array(4*size*size)
for(let x=0; x<size; x++){
    for(let y=0; y<size; y++){
        let ind = 4*(y*size+x)
        lookup[ind] = 1+(x%255)
        lookup[ind+1] = 1+Math.floor(x/255)
        lookup[ind+2] = 1+(y%255)
        lookup[ind+3] = 1+Math.floor(y/255)
    }
}

let ttl = 0
let bounds = [0]
data.fireHist.forEach(ls=>{
    ttl+=ls.length;
    bounds.push(ttl)
})
let flatHist = data.fireHist.flat()
let hsz = Math.ceil(Math.sqrt(ttl))
let history = new Uint8Array(4*hsz*hsz)
for(let x=0; x<hsz; x++){
    for(let y=0; y<hsz; y++){
        let ind = y*hsz+x
        if(ind>=flatHist.length) break
        for(let k=0; k<4; k++) history[4*ind+k] = lookup[4*flatHist[ind]+k]
    }
}

let colorTex0 = new ComputeTexture(gl,TextureType.T4F,size,size,null,true)
let colorTex1 = new ComputeTexture(gl,TextureType.T4F,size,size,null,true)
let colorTexPong = new PingPong(colorTex0,colorTex1)
let lookupTex = new ComputeTexture(gl,TextureType.T4I,size,size,lookup,false)
let histTex = new ComputeTexture(gl,TextureType.T4I,hsz,hsz,history,false)

let fadeShader = new ComputeShader(gl,new MeshAll(),fadeFS,[])
let zeroShader = new ComputeShader(gl,new MeshAll(),zeroFS,[])
let copyShader = new ComputeShader(gl,new MeshAll(),copyFS,["srcTex"])
let updateShader = new ComputeShader(gl,new MeshAll(),updateFS,["srcTex","lookupTex","histTex"])

updateShader.setUniform("hsz",hsz,UniformType.U1I)
fadeShader.setUniform("decay",0.00015,UniformType.U1F)

// function downloadCanvas(canvas, filename) {
//     const link = document.createElement('a');
//     link.download = filename;
//     link.href = canvas.toDataURL('image/png');
//     link.click();
// }
console.log(data.fireHist.length)
let curInd = 0
function anim(){
    for(let i=0; i<10; i++){
        console.log(curInd)
        if(curInd==0){
            zeroShader.run([],colorTexPong.getCur())
        }
        updateShader.setUniform("boundLow",bounds[curInd],UniformType.U1I)
        updateShader.setUniform("boundHigh",bounds[curInd+1],UniformType.U1I)
        updateShader.run([colorTexPong.getCur(),lookupTex,histTex],colorTexPong.getNext())
        colorTexPong.swap()
        fadeShader.run([colorTexPong.getCur()],colorTexPong.getNext())
        colorTexPong.swap()
        copyShader.render(colorTexPong.getCur())
        curInd = (curInd+1)%data.fireHist.length
        // let downloadStep = Math.floor(12800/7)
        // if(curInd%downloadStep==0 && curInd>0) downloadCanvas(canvas,"img-"+Math.floor(curInd/downloadStep)+".png")
    }
    requestAnimationFrame(anim)
}

requestAnimationFrame(anim)
})
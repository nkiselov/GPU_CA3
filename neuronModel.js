(function(root, factory) {
    root.neural = factory.call(root);
}(this, function() {

let m_inf = V => 1 / (1 + Math.exp(-(V + 22.6) / 9.55))
let m_tau = V => 0.2 * (2.03 - 1.91 / (1 + Math.exp(-(V + 24.1) / 16.7)) - 1.98 / (1 + Math.exp((V + 35.6) / 13.2)))

let h_inf = V => 1 / (1 + Math.exp((V + 34.2) / 7.07))
let h_tau = V => 43.3 - 42.3 / (1 + Math.exp(-(V + 33.2) / 9.61)) - 42.1 / (1 + Math.exp((V + 40.2) / 10.6))

let n_inf = V => 1 / (1 + Math.exp(-(V + 23) / 17.5))
let n_tau = V => 0.2 * (5.48 - 19.4 / (1 + Math.exp(-(V + 51.4) / 23.8))) + 14.9 / (1 + Math.exp(-(V + 62.7) / 15.6))

let w_inf = V => 1 / (1 + Math.exp(-V / 5))
let w_tau = V => 1

let a_inf = V => 1 / (1 + Math.exp(-(V + 5) / 10))
let a_tau = V => 0.2

let b_inf = V => 1 / (1 + Math.exp((V + 58) / 8.2))
let b_tau = V => 5 + Math.max(0, 0.26 * (V + 20))

let r_inf = V => 1 / (1 + Math.exp(-(V + 5) / 10))
let r_tau = V => 1

let Vh = Ca => 72 - 30 * Math.log(Math.max(0.1, Ca))
let c1_inf = (V, Ca) => 1 / (1 + Math.exp((Vh(Ca) - V) / 13))
let c1_tau = 2
let Ca_tau = 20

const vL = -65
const vNa = 55
const vK = -90
const vCa = 120
const EI = -75

function makeNeuron() {

    //Voltages
    let V_s = -66
    let V_p = -67
    let V_d = -68

    //Currents
    let I_ext_s = 0
    let I_ext_p = 0
    let I_ext_d = 0

    //Soma
    //gL 0.1
    //gNa 30
    //gKHT 8
    //gCaBK 200
    //gCa 0.5
    //gK 5
    let m_s = 0
    let h_s = 0
    let n_s = 0
    let w_s = 0
    let Ca_s = 0
    let c1_s = 0
    let r_s = 0

    //Proximal
    //gL 0.1
    //gKa 10
    //gCaBK 45
    //gCa 45
    let a_p = 0
    let b_p = 0
    let Ca_p = 0
    let c1_p = 0
    let r_p = 0

    //Distal
    //gL 0.1
    //gKa 10
    let a_d = 0
    let b_d = 0

    return {
        getPotentials: () => [V_s, V_p, V_d],
        setCurrents: I => [I_exc_s, I_exc_p, I_exc_d] = I,
        step: dt => {
            //Coupling
            let I_comp_s = (V_p - V_s) / 100
            let I_comp_d = (V_p - V_d) / 300
            let I_comp_p = I_comp_s - I_comp_d

            //Soma
            let I_L_s = 0.1 * (vL - V_s)
            let I_Na_s = 30 * m_s * m_s * m_s * h_s * (vNa - V_s)
            let I_K_s = 5 * n_s * n_s * n_s * n_s * (vK - V_s)
            let I_KHT_s = 8 * w_s * (vK - V_s)
            let I_CaBK_s = 200 * c1_s * (vK - V_s)
            let I_Ca_s = 0.5 * r_s * r_s * (vCa - V_s)

            //Proximal
            let I_L_p = 0.1 * (vL - V_p)
            let I_A_p = 10 * a_p * a_p * a_p * a_p * b_p * (vK - V_p)
            let I_CaBK_p = 45 * c1_p * (vK - V_p)
            let I_Ca_p = 45 * r_p * r_p * (vCa - V_p)

            //Distal
            let I_L_d = 0.1 * (vL - V_d)
            let I_A_d = 10 * a_d * a_d * a_d * a_d * b_d * (vK - V_d)

            //Voltage
            V_s += dt * ((I_ext_s + I_comp_s)/ 0.02 + (I_L_s + I_Na_s + I_K_s + I_KHT_s + I_CaBK_s + I_Ca_s) )
            V_p += dt * ((I_ext_p + I_comp_p)/ 0.02 + (I_L_p + I_A_p + I_CaBK_p + I_Ca_p))
            V_d += dt  * ((I_ext_d + I_comp_d)/ 0.06 + (I_L_d + I_A_d))

            if(!isFinite(V_p)){
                debugger
            }
            //Soma
            m_s += dt * (m_inf(V_s) - m_s) / m_tau(V_s)
            h_s += dt * (h_inf(V_s) - h_s) / h_tau(V_s)
            n_s += dt * (n_inf(V_s) - n_s) / n_tau(V_s)
            w_s += dt * (w_inf(V_s) - w_s) / w_tau(V_s)
            Ca_s += dt * (0.0002 * I_Ca_s - Ca_s / Ca_tau)
            c1_s += dt * (c1_inf(V_s, Ca_s) - c1_s) / c1_tau
            r_s += dt * (r_inf(V_s) - r_s) / r_tau(V_s)

            //Proximal
            a_p += dt * (a_inf(V_p) - a_p) / a_tau(V_p)
            b_p += dt * (b_inf(V_p) - b_p) / b_tau(V_p)
            Ca_p += dt * (0.0002 * I_Ca_p - Ca_p / Ca_tau)
            c1_p += dt * (c1_inf(V_p, Ca_p) - c1_p) / c1_tau
            r_p += dt * (r_inf(V_p) - r_p) / r_tau(V_p)

            //Distal
            a_d += dt * (a_inf(V_d) - a_d) / a_tau(V_d)
            b_d += dt * (b_inf(V_d) - b_d) / b_tau(V_d)

            console.log([V_s,V_p,V_d,m_s,h_s,n_s,w_s,Ca_s,c1_s,r_s,a_p,b_p,Ca_p,c1_p,r_p,a_d,b_d])
        }
    }
}

function initVecNeuron(current){
    return [
        current[0],
        current[1],
        current[2],
        -64.62369722847157,
        -64.54678127154715,
        -64.83813621338027,
        0.012123797353804713,
        0.9866554174667461,
        0.08482717433004333,
        0.0000024370021948161144,
        0.0000024335266451518858,
        1.3430221875971907e-7,
        0.0025671980652373257,
        0.0025869687695830295,
        0.6896295445677414,
        0.0002223111590507327,
        1.3509918813546138e-7,
        0.002586968769583012,
        0.002512870247804508,
        0.6971829541802006
    ]
}

function stepVecNeuron(vec){
    [I_ext_s,I_ext_p,I_ext_d,V_s,V_p,V_d,m_s,h_s,n_s,w_s,Ca_s,c1_s,r_s,a_p,b_p,Ca_p,c1_p,r_p,a_d,b_d] = vec
    let I_comp_s = (V_p - V_s) / 100
    let I_comp_d = (V_p - V_d) / 300
    let I_comp_p = I_comp_s - I_comp_d

    //Soma
    let I_L_s = 0.1 * (vL - V_s)
    let I_Na_s = 30 * m_s * m_s * m_s * h_s * (vNa - V_s)
    let I_K_s = 5 * n_s * n_s * n_s * n_s * (vK - V_s)
    let I_KHT_s = 8 * w_s * (vK - V_s)
    let I_CaBK_s = 200 * c1_s * (vK - V_s)
    let I_Ca_s = 0.5 * r_s * r_s * (vCa - V_s)

    //Proximal
    let I_L_p = 0.1 * (vL - V_p)
    let I_A_p = 10 * a_p * a_p * a_p * a_p * b_p * (vK - V_p)
    let I_CaBK_p = 45 * c1_p * (vK - V_p)
    let I_Ca_p = 45 * r_p * r_p * (vCa - V_p)

    //Distal
    let I_L_d = 0.1 * (vL - V_d)
    let I_A_d = 10 * a_d * a_d * a_d * a_d * b_d * (vK - V_d)

    let res = Array(20).fill(0)
    let ind = 0
    res[ind++] = 0
    res[ind++] = 0
    res[ind++] = 0

    res[ind++] = ((I_ext_s + I_comp_s)/ 0.02 + (I_L_s + I_Na_s + I_K_s + I_KHT_s + I_CaBK_s + I_Ca_s) )
    res[ind++] = ((I_ext_p + I_comp_p)/ 0.02 + (I_L_p + I_A_p + I_CaBK_p + I_Ca_p))
    res[ind++] = ((I_ext_d + I_comp_d)/ 0.06 + (I_L_d + I_A_d))

    //Soma
    res[ind++] = (m_inf(V_s) - m_s) / m_tau(V_s)
    res[ind++] = (h_inf(V_s) - h_s) / h_tau(V_s)
    res[ind++] = (n_inf(V_s) - n_s) / n_tau(V_s)
    res[ind++] = (w_inf(V_s) - w_s) / w_tau(V_s)
    res[ind++] = (0.0002 * I_Ca_s - Ca_s / Ca_tau)
    res[ind++] = (c1_inf(V_s, Ca_s) - c1_s) / c1_tau
    res[ind++] = (r_inf(V_s) - r_s) / r_tau(V_s)

    //Proximal
    res[ind++] = (a_inf(V_p) - a_p) / a_tau(V_p)
    res[ind++] = (b_inf(V_p) - b_p) / b_tau(V_p)
    res[ind++] = (0.0002 * I_Ca_p - Ca_p / Ca_tau)
    res[ind++] = (c1_inf(V_p, Ca_p) - c1_p) / c1_tau
    res[ind++] = (r_inf(V_p) - r_p) / r_tau(V_p)

    //Distal
    res[ind++] = (a_inf(V_d) - a_d) / a_tau(V_d)
    res[ind++] = (b_inf(V_d) - b_d) / b_tau(V_d)

    return res
}

function potentialVecNeuron(vec){
    return [vec[3],vec[4],vec[5]]
}

function stateLabels(){
    return ["I_ext_s","I_ext_p","I_ext_d","V_s","V_p","V_d","m_s","h_s","n_s","w_s","Ca_s","c1_s","r_s","a_p","b_p","Ca_p","c1_p","r_p","a_d","b_d"]
}

return {
    makeNeuron: makeNeuron,
    initVecNeuron: initVecNeuron,
    stepVecNeuron: stepVecNeuron,
    potentialVecNeuron: potentialVecNeuron,
    stateLabels: stateLabels
}

}))
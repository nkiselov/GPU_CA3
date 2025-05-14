(function (root, factory) {
    root.intNeural = factory.call(root);
}(this, function () {

    const vL = -65
    const vNa = 55
    const vK = -90

    let am = V=>(V+22)/(1-Math.exp(-(V+22)/10))
    let bm = V=>40*Math.exp(-(V+47)/18)
    let ah = V=>0.7*Math.exp(-(V+34)/20)
    let bh = V=>10/(1+Math.exp(-(V+4)/10))
    let an = V=>0.15*(V+15)/(1-Math.exp(-(V+15)/10))
    let bn = V=>0.2*Math.exp(-(V+25)/80)
    let w_inf = V=>1/(1+Math.exp(-V/5))
    let w_tau = 1

    function initVecNeuron(current){
        return [
            current,
            -65.35115959923884,
            0.005163394596960638,
            0.9936034607462888,
            0.12991976480957568,
            0.0000021069841491016405
        ]
    }

    function stepVecNeuronBacksub(vec,dt){
        [I_ext,V,m,h,n,w] = vec
        let I_L = 0.1 // * (vL - V)
        let I_Na = 30 * m * m * m * h // * (vNa - V)
        let I_K = 5 * n * n * n * n // * (vK - V)
        let I_KHT = 8 * w // * (vK - V)

        let I_sum = I_L + I_Na + I_K + I_KHT
        let V_eq = (I_L * vL + I_Na * vNa + I_K * vK + I_KHT * vK)
        
        let ind = 0;
        let res = Array(6).fill(0)
        res[ind++] = 0

        V_eq+=I_ext
        res[ind++] = (V_eq/I_sum-V)/(1/I_sum+dt)

        let m_mul = am(V)+bm(V)
        let h_mul = ah(V)+bh(V)
        let n_mul = an(V)+bn(V)

        res[ind++] = (am(V)/m_mul-m)/(1/m_mul+dt)
        res[ind++] = (ah(V)/h_mul-h)/(1/h_mul+dt)
        res[ind++] = (an(V)/n_mul-n)/(1/n_mul+dt)
        res[ind++] = (w_inf(V)-w)/(w_tau+dt)

        return res
    }

    function stepVecNeuron(vec) {
        return stepVecNeuronBacksub(vec, 0)
    }

    function stateLabels() {
        return ["I_ext","V","m","h","n","w"]
    }

    return {
        initVecNeuron: initVecNeuron,
        stepVecNeuronBacksub: stepVecNeuronBacksub,
        stateLabels: stateLabels,
        stepVecNeuron: stepVecNeuron
    }
}))
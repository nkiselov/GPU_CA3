function makePyramNeuronDisplay(initialNeuron) {
    const container = document.createElement('div');
    container.className = 'neuron-display';

    // Main properties section
    const mainSection = document.createElement('div');
    mainSection.className = 'main-properties';
    
    const v_s = makeStaticField('V_s', initialNeuron.V_s);
    const v_p = makeStaticField('V_p', initialNeuron.V_p);
    const v_d = makeStaticField('V_d', initialNeuron.V_d);

    mainSection.appendChild(v_s.html);
    mainSection.appendChild(v_p.html);
    mainSection.appendChild(v_d.html);

    // Extra properties section
    const extraToggle = makeToggle(false, () => {
        extraSection.style.display = extraToggle.getValue() ? 'block' : 'none';
    });
    
    const extraHeader = document.createElement('div');
    extraHeader.className = 'extra-header';
    extraHeader.textContent = 'Extra Properties';
    extraHeader.appendChild(extraToggle.html);
    
    const extraSection = document.createElement('div');
    extraSection.className = 'extra-properties';
    extraSection.style.display = 'none';
    
    // Create fields for all extra properties
    const extraFields = {
        m_s: makeStaticField('m_s', initialNeuron.m_s),
        h_s: makeStaticField('h_s', initialNeuron.h_s),
        n_s: makeStaticField('n_s', initialNeuron.n_s),
        w_s: makeStaticField('w_s', initialNeuron.w_s),
        Ca_s: makeStaticField('Ca_s', initialNeuron.Ca_s),
        c1_s: makeStaticField('c1_s', initialNeuron.c1_s),
        r_s: makeStaticField('r_s', initialNeuron.r_s),
        a_p: makeStaticField('a_p', initialNeuron.a_p),
        b_p: makeStaticField('b_p', initialNeuron.b_p),
        Ca_p: makeStaticField('Ca_p', initialNeuron.Ca_p),
        c1_p: makeStaticField('c1_p', initialNeuron.c1_p),
        r_p: makeStaticField('r_p', initialNeuron.r_p),
        a_d: makeStaticField('a_d', initialNeuron.a_d),
        b_d: makeStaticField('b_d', initialNeuron.b_d)
    };
    
    Object.values(extraFields).forEach(field => {
        extraSection.appendChild(field.html);
    });

    // Assemble everything
    container.appendChild(mainSection);
    container.appendChild(extraHeader);
    container.appendChild(extraSection);

    return {
        html: container,
        update: (newNeuron) => {
            v_s.update(newNeuron.V_s);
            v_p.update(newNeuron.V_p);
            v_d.update(newNeuron.V_d);
            
            extraFields.m_s.update(newNeuron.m_s);
            extraFields.h_s.update(newNeuron.h_s);
            extraFields.n_s.update(newNeuron.n_s);
            extraFields.w_s.update(newNeuron.w_s);
            extraFields.Ca_s.update(newNeuron.Ca_s);
            extraFields.c1_s.update(newNeuron.c1_s);
            extraFields.r_s.update(newNeuron.r_s);
            extraFields.a_p.update(newNeuron.a_p);
            extraFields.b_p.update(newNeuron.b_p);
            extraFields.Ca_p.update(newNeuron.Ca_p);
            extraFields.c1_p.update(newNeuron.c1_p);
            extraFields.r_p.update(newNeuron.r_p);
            extraFields.a_d.update(newNeuron.a_d);
            extraFields.b_d.update(newNeuron.b_d);
        }
    };
}

function makeInterNeuronDisplay(initialNeuron) {
    const container = document.createElement('div');
    container.className = 'neuron-display';

    const fields = {
        V: makeStaticField('V', initialNeuron.V),
        m: makeStaticField('m', initialNeuron.m),
        h: makeStaticField('h', initialNeuron.h),
        n: makeStaticField('n', initialNeuron.n),
        w: makeStaticField('w', initialNeuron.w)
    };

    Object.values(fields).forEach(field => {
        container.appendChild(field.html);
    });

    return {
        html: container,
        update: (newNeuron) => {
            fields.V.update(newNeuron.V);
            fields.m.update(newNeuron.m);
            fields.h.update(newNeuron.h);
            fields.n.update(newNeuron.n);
            fields.w.update(newNeuron.w);
        }
    };
}

function makePyramReceptorDisplay(initialReceptor) {
    const container = document.createElement('div');
    container.className = 'receptor-display';

    const fields = {
        g_I: makeStaticField('g_I', initialReceptor.g_I),
        g_E: makeStaticField('g_E', initialReceptor.g_E),
        g_d: makeStaticField('g_d', initialReceptor.g_d),
        fire: makeStaticField('fire', initialReceptor.fire ? 'true' : 'false')
    };

    Object.values(fields).forEach(field => {
        container.appendChild(field.html);
    });

    return {
        html: container,
        update: (newReceptor) => {
            fields.g_I.update(newReceptor.g_I);
            fields.g_E.update(newReceptor.g_E);
            fields.g_d.update(newReceptor.g_d);
            fields.fire.update(newReceptor.fire ? 'true' : 'false');
        }
    };
}

function makeInterReceptorDisplay(initialReceptor) {
    const container = document.createElement('div');
    container.className = 'receptor-display';

    const fields = {
        g_E: makeStaticField('g_E', initialReceptor.g_E),
        fire: makeStaticField('fire', initialReceptor.fire ? 'true' : 'false')
    };

    Object.values(fields).forEach(field => {
        container.appendChild(field.html);
    });

    return {
        html: container,
        update: (newReceptor) => {
            fields.g_E.update(newReceptor.g_E);
            fields.fire.update(newReceptor.fire ? 'true' : 'false');
        }
    };
}

function makeStaticField(label, initialValue) {
    const container = document.createElement('div');
    container.className = 'static-field';
    
    const labelEl = document.createElement('span');
    labelEl.className = 'field-label';
    labelEl.textContent = label;
    labelEl.style.fontWeight = 'bold';
    
    const valueEl = document.createElement('span');
    valueEl.className = 'field-value';
    valueEl.textContent = typeof initialValue === 'string'?initialValue:(Number.isInteger(initialValue)?initialValue:initialValue.toFixed(2));
    valueEl.style.marginLeft = '10px';
    container.appendChild(labelEl);
    container.appendChild(valueEl);
    
    return {
        html: container,
        update: (newValue) => {
            valueEl.textContent = typeof newValue === 'string'?newValue:(Number.isInteger(newValue)?newValue:newValue.toFixed(2));
        }
    };
}

function makeNeuronGrid(vpn, size, selectNeuron) {
    const container = document.createElement('div');
    container.className = 'neuron-grid-container';
    
    // Create single canvas for the grid
    const canvas = document.createElement('canvas');
    const cellSize = 30; // pixels per neuron
    canvas.width = size * cellSize;
    canvas.height = size * cellSize;
    canvas.style.border = '1px solid #333';
    canvas.style.cursor = 'pointer';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let selectedIndex = -1;
    let hoverIndex = -1;

    // HSV color mapping (blue to red)
    function getColor(v) {
        // Normalize V_s (-70 to 40) to hue (240° blue to 0° red)
        const normalized = Math.max(0, Math.min(1, (v - (-70)) / (40 - (-70))));
        const hue = 240 * (1 - normalized); // Blue (240°) to Red (0°)
        return `hsl(${hue}, 100%, 50%)`;
    }

    // Draw the entire grid
    function drawGrid() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const index = y * size + x;
                if (index >= vpn.length) break;
                
                // Draw cell background
                ctx.fillStyle = getColor(vpn[index].V_s===undefined?vpn[index].V:vpn[index].V_s);
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
                
                // Draw selection/hover borders
                
            }
        }
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const index = y * size + x;
                if (index >= vpn.length) break;

                if (index === selectedIndex) {
                    ctx.strokeStyle = 'red';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
                }else if (index === hoverIndex) {
                    ctx.strokeStyle = 'white';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
                }
            }
        }
    }

    // Handle mouse events
    function handleMouseMove(e) {
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / cellSize);
        const y = Math.floor((e.clientY - rect.top) / cellSize);
        const newHoverIndex = y * size + x;
        
        if (newHoverIndex !== hoverIndex && newHoverIndex < vpn.length) {
            hoverIndex = newHoverIndex;
            drawGrid();
        }
    }

    function handleMouseLeave() {
        hoverIndex = -1;
        drawGrid();
    }

    function handleClick(e) {
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / cellSize);
        const y = Math.floor((e.clientY - rect.top) / cellSize);
        const clickedIndex = y * size + x;
        
        if (clickedIndex < vpn.length) {
            selectedIndex = clickedIndex;
            drawGrid();
            selectNeuron(clickedIndex);
        }
    }

    // Set up event listeners
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('click', handleClick);

    // Initial draw
    drawGrid();

    return {
        html: container,
        update: (newVpn) => {
            vpn = newVpn;
            drawGrid();
        },
        select: (index) => {
            selectedIndex = index;
            drawGrid();
        },
        getSelection: () => {
            return selectedIndex
        }
    };
}

function makeSynapseDisplay(synapse) {
    const container = document.createElement('div');
    container.className = 'synapse-display';

    // Regular properties
    const fields = {
        from: makeStaticField('From', synapse.from),
        delay: makeStaticField('Delay', synapse.delay),
        weight: makeStaticField('Weight', synapse.weight)
    };

    // Special display for 128-bit input
    const bitPos = makeStaticField('Input', '')

    // Function to display active bits
    function updateBitDisplay(inputBits) {
        let str = ''
        for (let i = 0; i < inputBits.length; i++) {
            if (inputBits[i] === '1') {
                str += i.toString();
                str += ' '
            }
        }
        bitPos.update(str)
    }

    // Initial update
    updateBitDisplay(synapse.input);

    // Assemble all fields
    Object.values(fields).forEach(field => {
        container.appendChild(field.html);
    });
    container.appendChild(bitPos.html);

    container.style.borderBottom = '1px black solid'
    container.style.paddingBottom = '2px'

    return {
        html: container,
        update: (newSynapse) => {
            fields.from.update(newSynapse.from);
            fields.delay.update(newSynapse.delay);
            fields.weight.update(newSynapse.weight);
            updateBitDisplay(newSynapse.input);
        }
    };
}

String.prototype.count=function(c) { 
  var result = 0, i = 0;
  for(i;i<this.length;i++)if(this[i]==c)result++;
  return result;
};

function makeGridImageVisual(spec, initImg){
    let img = initImg
    let pyramGrid = undefined
    let interGrid = undefined
    let pyramNeuronDisp = makePyramNeuronDisplay(img.vpn[0])
    let pyramReceptorDisp = makePyramReceptorDisplay(img.vpr[0])
    let interNeuronDisp = makeInterNeuronDisplay(img.vin[0])
    let interReceptorDisp = makeInterReceptorDisplay(img.vir[0])
    let pyramDisp = makevbox([
        pyramNeuronDisp.html,
        pyramReceptorDisp.html
    ])
    let interDisp = makevbox([
        interNeuronDisp.html,
        interReceptorDisp.html
    ])

    let synapseDisp = makevbox([])
    let synapseDispRef = makeboxref(synapseDisp)

    function selectPyram(ind){
        interGrid.select(-1)
        pyramNeuronDisp.update(img.vpn[ind])
        pyramReceptorDisp.update(img.vpr[ind])
        interDisp.style.display = 'none'
        pyramDisp.style.display = 'flex'
        synapseDispRef([
            makeh("Pyram"),
            ...img.py2py[ind].filter(syn=>syn.input.count(1)>0).map(syn=>makeSynapseDisplay(syn).html),
            makeh("Inter"),
            ...img.in2py[ind].filter(syn=>syn.input.count(1)>0).map(syn=>makeSynapseDisplay(syn).html),
        ])
    }

    function selectInter(ind){
        pyramGrid.select(-1)
        interNeuronDisp.update(img.vin[ind])
        interReceptorDisp.update(img.vir[ind])
        interDisp.style.display = 'flex'
        pyramDisp.style.display = 'none'

        synapseDispRef([
            makeh("Pyram"),
            ...img.py2in[ind].filter(syn=>syn.input.count(1)>0).map(syn=>makeSynapseDisplay(syn).html),
        ])
    }

    pyramGrid = makeNeuronGrid(img.vpn, spec.size, selectPyram)
    interGrid = makeNeuronGrid(img.vin, Math.ceil(Math.sqrt(spec.inN)), selectInter)
    selectPyram(0)
    pyramGrid.select(0)
    
    let cont = makehbox([
        makevbox([
            makeh("Pyramidal"),
            pyramGrid.html,
            makeh("Inter"),
            interGrid.html
        ]),
        makevbox([
            pyramDisp,
            interDisp,
            synapseDisp
        ])
    ])

    return {
        html: cont,
        setImage: newImg=>{
            img = newImg
            pyramGrid.update(newImg.vpn)
            interGrid.update(newImg.vin)
            if(pyramGrid.getSelection()!=-1) selectPyram(pyramGrid.getSelection())
            if(interGrid.getSelection()!=-1) selectInter(interGrid.getSelection())
        }
    }
}
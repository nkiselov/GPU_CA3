async function deserializeNetimages(file) {
    // Read file as ArrayBuffer
    const buffer = await file.arrayBuffer();
    const dataView = new DataView(buffer);
    let offset = 0;

    // Helper functions to read data types
    const read = {
        uint64: () => {
            const low = dataView.getUint32(offset, true);
            const high = dataView.getUint32(offset + 4, true);
            offset += 8;
            return low + high * 4294967296; // May lose precision for very large numbers
        },
        int32: ()=>{
            const value = dataView.getInt32(offset, true);
            offset += 4;
            return value;
        },
        float: () => {
            const value = dataView.getFloat32(offset, true);
            offset += 4;
            return value;
        },
        boolean: () => {
            const value = dataView.getUint8(offset);
            offset += 1;
            return value !== 0;
        },
        int128: () => {
            // Read 128 bits (16 bytes) and convert to binary string
            let binaryStr = '';
            for (let i = 0; i < 16; i++) {
                const byte = dataView.getUint8(offset + i);
                binaryStr += byte.toString(2).padStart(8, '0');
            }
            offset += 16;
            return binaryStr;
        },
        uint64s: () => {
            let binaryStr = '';
            for (let i = 7; i >= 0; i--) {
                const byte = dataView.getUint8(offset + i);
                binaryStr += byte.toString(2).padStart(8, '0');
            }
            offset += 8;
            return binaryStr.split("").reverse().join("");
        },
        skip: (val) => {
            offset += val
            return 0
        }
    };

    const spec = {
        size: read.int32(),
        pyN: read.int32(),
        inN: read.int32(),
        inRad: read.float(),
        dt: read.float()
    }

    // Read number of netimages
    const numImages = read.uint64();
    const images = [];

    for (let i = 0; i < numImages; i++) {
        const image = {
            vpn: [],
            vpr: [],
            vin: [],
            vir: [],
            py2in: [],
            in2py: [],
            py2py: []
        };

        // Read pyramNeuron vector
        const vpnSize = read.uint64();
        for (let j = 0; j < vpnSize; j++) {
            image.vpn.push({
                V_s: read.float(),
                V_p: read.float(),
                V_d: read.float(),
                m_s: read.float(),
                h_s: read.float(),
                n_s: read.float(),
                w_s: read.float(),
                Ca_s: read.float(),
                c1_s: read.float(),
                r_s: read.float(),
                a_p: read.float(),
                b_p: read.float(),
                Ca_p: read.float(),
                c1_p: read.float(),
                r_p: read.float(),
                a_d: read.float(),
                b_d: read.float()
            });
        }

        // Read pyramReceptor vector
        const vprSize = read.uint64();
        for (let j = 0; j < vprSize; j++) {
            image.vpr.push({
                g_I: read.float(),
                g_E: read.float(),
                g_d: read.float(),
                fire: read.boolean()
            });
            read.skip(3)
        }

        // Read interNeuron vector
        const vinSize = read.uint64();
        for (let j = 0; j < vinSize; j++) {
            image.vin.push({
                V: read.float(),
                m: read.float(),
                h: read.float(),
                n: read.float(),
                w: read.float()
            });
        }

        // Read interReceptor vector
        const virSize = read.uint64();
        for (let j = 0; j < virSize; j++) {
            image.vir.push({
                g_E: read.float(),
                fire: read.boolean()
            });
            read.skip(3)
        }

        // Helper function to read synapse vectors
        const readSynapseVector = () => {
            const outerSize = read.uint64();
            const vec = [];
            for (let j = 0; j < outerSize; j++) {
                const innerSize = read.uint64();
                const innerVec = [];
                for (let k = 0; k < innerSize; k++) {
                    innerVec.push({
                        from: read.int32(),
                        delay: read.int32(),
                        weight: read.float() + read.skip(4),
                        input: read.uint64s() // stored as binary string
                    });
                }
                vec.push(innerVec);
            }
            return vec;
        };

        // Read all synapse vectors
        image.py2in = readSynapseVector();
        image.in2py = readSynapseVector();
        image.py2py = readSynapseVector();
        images.push(image);
    }

    return {
        spec:spec,
        images:images
    }
}

async function loadAndDeserializeNetimages(url) {
    try {
        // Fetch the binary file
        const response = await fetch(url);
        
        // Check if request was successful
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Get the file as a Blob
        const blob = await response.blob();
        
        // Create a file-like object to pass to deserializeNetimages
        const file = new File([blob], 'netimage.bin', { type: 'application/octet-stream' });
        
        // Deserialize the binary data
        const netimages = await deserializeNetimages(file);
        
        return netimages;
    } catch (error) {
        console.error('Error loading or deserializing:', error);
        throw error;
    }
}
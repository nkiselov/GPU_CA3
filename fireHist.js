async function deserializeFireHist(filename) {
    // Read the file as ArrayBuffer
    const response = await fetch(filename);
    const buffer = await response.arrayBuffer();
    const dataView = new DataView(buffer);
    
    let offset = 0;
    
    // Helper function to read values
    function readInt() {
        const value = dataView.getInt32(offset, true); // little-endian
        offset += 4;
        return value;
    }
    
    function readFloat() {
        const value = dataView.getFloat32(offset, true); // little-endian
        offset += 4;
        return value;
    }
    
    // Read gridspec
    const spec = {
        size: readInt(),
        pyN: readInt(),
        inN: readInt(),
        inRad: readFloat(),
        dt: readFloat()
    };
    
    // Read fireHist
    const fireHist = [];
    const num = readInt(); // Number of outer vectors
    
    for (let i = 0; i < num; i++) {
        const snum = readInt(); // Size of inner vector
        const innerArray = new Int32Array(buffer, offset, snum);
        fireHist.push(Array.from(innerArray));
        offset += snum * 4; // Each int is 4 bytes
    }
    
    return { spec, fireHist };
}
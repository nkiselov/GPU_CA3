function createPositionsPlot(size, pyPos, inPos, inRad, clickPy, clickIn) {
    // Create container
    const container = document.createElement('div');
    container.style.position = 'relative';
    
    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.style.border = '1px solid #ddd';
    canvas.style.backgroundColor = 'white';
    canvas.style.borderRadius = '4px';
    container.appendChild(canvas);
    
    // Set canvas size
    const width = size;
    const height = size;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    // Scale positions from [0,1] to canvas coordinates
    function scalePosition(x, y) {
        return [
            x * width,
            height - y * height // Flip Y axis
        ];
    }
    
    // Draw shapes
    function draw() {
        ctx.clearRect(0, 0, width, height);
        
        // Draw inRad circles first (faint filled background)
        ctx.fillStyle = 'rgba(255, 200, 200, 0.15)';
        ctx.strokeStyle = 'rgba(255, 150, 150, 0.3)';
        ctx.lineWidth = 1;
        for (let i = 0; i < inPos.length; i++) {
            const [x, y] = inPos[i];
            const [sx, sy] = scalePosition(x, y);
            ctx.beginPath();
            ctx.arc(sx, sy, inRad * width, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        }
        
        // Draw circles (inPos)
        for (let i = 0; i < inPos.length; i++) {
            const [x, y] = inPos[i];
            const [sx, sy] = scalePosition(x, y);
            
            // Draw circle (smaller size)
            ctx.fillStyle = 'rgba(255, 50, 50, 0.9)';
            ctx.beginPath();
            ctx.arc(sx, sy, 4, 0, Math.PI * 2);
            ctx.fill();
            
            // Highlight if selected
            if (selectedIn === i) {
                ctx.strokeStyle = 'rgba(255, 200, 0, 0.8)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(sx, sy, 6, 0, Math.PI * 2);
                ctx.stroke();
            }
        }
        
        // Draw triangles (pyPos)
        for (let i = 0; i < pyPos.length; i++) {
            const [x, y] = pyPos[i];
            const [sx, sy] = scalePosition(x, y);
            
            // Draw triangle (smaller size)
            ctx.fillStyle = 'rgba(50, 180, 50, 0.9)';
            ctx.beginPath();
            ctx.moveTo(sx, sy - 4);
            ctx.lineTo(sx - 3, sy + 3);
            ctx.lineTo(sx + 3, sy + 3);
            ctx.closePath();
            ctx.fill();
            
            // Highlight if selected
            if (selectedPy === i) {
                ctx.strokeStyle = 'rgba(255, 200, 0, 0.8)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(sx, sy - 5);
                ctx.lineTo(sx - 4, sy + 4);
                ctx.lineTo(sx + 4, sy + 4);
                ctx.closePath();
                ctx.stroke();
            }
        }
    }
    
    // Selected indices
    let selectedPy = null;
    let selectedIn = null;
    
    // Handle clicks
    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Check all positions (scaled to canvas coordinates)
        // Check inPos circles first
        for (let i = 0; i < inPos.length; i++) {
            const [px, py] = inPos[i];
            const [sx, sy] = scalePosition(px, py);
            const dist = Math.sqrt((x - sx) ** 2 + (y - sy) ** 2);
            if (dist <= 6) { // Click within radius
                selectedIn = i;
                selectedPy = null;
                draw();
                clickIn(i);
                return;
            }
        }
        
        // Check pyPos 
        for (let i = 0; i < pyPos.length; i++) {
            const [px, py] = pyPos[i];
            const [sx, sy] = scalePosition(px, py);
            const dist = Math.sqrt((x - sx) ** 2 + (y - sy) ** 2);
            if (dist <= 6) { // Click within radius
                selectedPy = i;
                selectedIn = null;
                draw();
                clickPy(i);
                return;
            }
        }
        
        // Clicked on empty space
        selectedPy = null;
        selectedIn = null;
        draw();
    });
    
    // Initial draw
    draw();
    
    return {
        html: container,
        selectPy: (i) => {
            selectedPy = i;
            selectedIn = null;
            draw();
        },
        selectIn: (i) => {
            selectedIn = i;
            selectedPy = null;
            draw();
        },
        updateData: (newPyPos, newInPos) => {
            pyPos = newPyPos;
            inPos = newInPos;
            draw();
        }
    };
}
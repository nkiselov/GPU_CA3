function interpolateColor(c1, c2, t) {
    t = Math.max(0, Math.min(1, t));
    return `rgba(${Math.round(c1[0] * (1 - t) + c2[0]*t)}, ${Math.round(c1[1] * (1 - t) + c2[1]*t)}, ${Math.round(c1[2] * (1 - t) + c2[2]*t)},${(c1[3] * (1 - t) + c2[3]*t)})`;
}

function createPositionsPlot(size, pyPos, inPos, inRad, initImg, clickPy, clickIn) {
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

    let curImg = initImg
    
    // Draw shapes
    function draw() {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < pyPos.length; i++) {
            const [x, y] = pyPos[i];
            const [sx, sy] = scalePosition(x, y);
            ctx.fillStyle = interpolateColor([0,0,0,0],[0,0,0,0.15],curImg.vpr[i].g_I/2)
            ctx.beginPath();
            ctx.arc(sx, sy, 10, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
        // ctx.clearRect(0, 0, width, height);
        
        // Draw inRad circles first (faint filled background)
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(255, 150, 150, 0.3)';
        for (let i = 0; i < inPos.length; i++) {
            const [x, y] = inPos[i];
            const [sx, sy] = scalePosition(x, y);
            ctx.beginPath();
            ctx.arc(sx, sy, inRad * width, 0, Math.PI * 2);
            ctx.closePath();
            ctx.stroke();
        }
        // Draw circles (inPos)
        for (let i = 0; i < inPos.length; i++) {
            const [x, y] = inPos[i];
            const [sx, sy] = scalePosition(x, y);
            
            // Draw circle (smaller size)
            ctx.beginPath();
            ctx.arc(sx, sy, 5, 0, Math.PI * 2);
            ctx.fillStyle = interpolateColor([255,50,50,0.2],[255,50,50,1],(curImg.vin[i].V - (-60)) / (10 - (-60)))
            ctx.closePath();
            ctx.fill()

            // Highlight if selected
            if (selectedIn === i) {
                ctx.strokeStyle = 'rgba(255, 200, 0, 0.8)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(sx, sy, 6, 0, Math.PI * 2);
                ctx.closePath();
                ctx.stroke();
            }
        }
        
        // Draw triangles (pyPos)
        for (let i = 0; i < pyPos.length; i++) {
            const [x, y] = pyPos[i];
            const [sx, sy] = scalePosition(x, y);
            
            // Draw triangle (smaller size)
            ctx.fillStyle = interpolateColor([50,180,50,0.1],[50,180,50,1],(curImg.vpn[i].V_s - (-60)) / (20 - (-60)))
            ctx.beginPath();
            ctx.moveTo(sx, sy - 6);
            ctx.lineTo(sx - 5, sy + 5);
            ctx.lineTo(sx + 5, sy + 5);
            ctx.closePath();
            ctx.fill();
            
            // Highlight if selected
            if (selectedPy === i) {
                ctx.strokeStyle = 'rgba(255, 200, 0, 0.8)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(sx, sy - 7);
                ctx.lineTo(sx - 6, sy + 6);
                ctx.lineTo(sx + 6, sy + 6);
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
        updateData: img => {
            curImg = img
            draw();
        }
    };
}
(function(global){
    var module = global.plotter = {};
    module.PADDING = 40
    module.TICK_LENGTH = 5
    module.MIN_TICKS = 1
    module.MAX_TICKS = 10

    module.findBounds = function(curves) {
        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;
        
        curves.forEach(curve => {
            curve.points.forEach(point => {
                minX = Math.min(minX, point[0]);
                maxX = Math.max(maxX, point[0]);
                minY = Math.min(minY, point[1]);
                maxY = Math.max(maxY, point[1]);
            });
        });
        
        return { minX, maxX: Math.max(minX+1e-9,maxX), minY, maxY: Math.max(minY+1e-9,maxY) };
    }

    module.findNiceNumber = function(range, round) {
        const exponent = Math.floor(Math.log10(range));
        const fraction = range / Math.pow(10, exponent);
        let niceFraction;

        if (round) {
            if (fraction < 1.5) niceFraction = 1;
            else if (fraction < 3) niceFraction = 2;
            else if (fraction < 7) niceFraction = 5;
            else niceFraction = 10;
        } else {
            if (fraction <= 1) niceFraction = 1;
            else if (fraction <= 2) niceFraction = 2;
            else if (fraction <= 5) niceFraction = 5;
            else niceFraction = 10;
        }

        return niceFraction * Math.pow(10, exponent);
    }

    module.calculateTicks = function(min, max) {
        const range = module.findNiceNumber(max - min, false);
        let tickSpacing = module.findNiceNumber(range / (module.MAX_TICKS - 1), true);
        const niceMin = Math.floor(min / tickSpacing) * tickSpacing;
        const niceMax = Math.ceil(max / tickSpacing) * tickSpacing;
        
        const ticks = [];
        for (let tick = niceMin; tick <= niceMax; tick += tickSpacing) {
            ticks.push(tick);
        }
        
        // If too few ticks, reduce spacing
        if (ticks.length < module.MIN_TICKS) {
            tickSpacing = tickSpacing / 10;
            for (let tick = niceMin; tick <= niceMax; tick += tickSpacing) {
                ticks.push(tick);
            }
        }
        
        return ticks.sort((a, b) => a - b);
    }

    module.formatTickLabel = function(value) {
        if (Math.abs(value) < 0.0001 || Math.abs(value) >= 10000) {
            return value.toExponential(1);
        }
        return value.toPrecision(3)//toFixed(Math.max(0, -Math.floor(Math.log10(Math.abs(value)))));
    }

    module.mapToCanvas = function(x, y, bounds, plotArea) {
        const xScale = (plotArea.endX - plotArea.startX) / (bounds.maxX - bounds.minX);
        const yScale = (plotArea.endY - plotArea.startY) / (bounds.maxY - bounds.minY);
        
        return {
            x: plotArea.startX + (x - bounds.minX) * xScale,
            y: plotArea.endY - (y - bounds.minY) * yScale
        };
    }

    module.drawAxes = function(ctx, bounds, plotArea) {
        ctx.strokeStyle = '#000';
        ctx.fillStyle = '#000';
        ctx.lineWidth = 1;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.font = '12px Arial';

        // X axis and ticks
        const xTicks = module.calculateTicks(bounds.minX, bounds.maxX);
        xTicks.forEach(x => {
            const canvasX = module.mapToCanvas(x, 0, bounds, plotArea).x;
            ctx.beginPath();
            ctx.moveTo(canvasX, plotArea.endY);
            ctx.lineTo(canvasX, plotArea.endY + module.TICK_LENGTH);
            ctx.stroke();
            ctx.fillText(module.formatTickLabel(x), canvasX, plotArea.endY + module.TICK_LENGTH);
        });

        // Y axis and ticks
        const yTicks = module.calculateTicks(bounds.minY, bounds.maxY);
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        yTicks.forEach(y => {
            const canvasY = module.mapToCanvas(0, y, bounds, plotArea).y;
            ctx.beginPath();
            ctx.moveTo(plotArea.startX, canvasY);
            ctx.lineTo(plotArea.startX - module.TICK_LENGTH, canvasY);
            ctx.stroke();
            ctx.fillText(module.formatTickLabel(y), plotArea.startX - module.TICK_LENGTH - 2, canvasY);
        });

        // Draw axes lines
        ctx.beginPath();
        ctx.moveTo(plotArea.startX, plotArea.startY);
        ctx.lineTo(plotArea.startX, plotArea.endY);
        ctx.lineTo(plotArea.endX, plotArea.endY);
        ctx.stroke();
    }

    module.plot = function(curves, vlines, ctx, startX, startY, endX, endY, height) {
        const plotArea = { startX, startY, endX, endY };
        const bounds = module.findBounds(curves);
        
        module.drawAxes(ctx, bounds, plotArea);

        curves.forEach(curve => {
            ctx.strokeStyle = curve.color;
            ctx.lineWidth = 2;
            ctx.beginPath();

            const startPoint = module.mapToCanvas(curve.points[0][0], curve.points[0][1], bounds, plotArea);
            ctx.moveTo(startPoint.x, startPoint.y);

            for (let i = 1; i < curve.points.length; i++) {
                const point = module.mapToCanvas(curve.points[i][0], curve.points[i][1], bounds, plotArea);
                ctx.lineTo(point.x, point.y);
            }

            ctx.stroke();
        });

        ctx.strokeStyle = 'blue'
        vlines.forEach(x => {
            const xv = module.mapToCanvas(x,0,bounds,plotArea).x
            ctx.beginPath()
            ctx.moveTo(xv,0)
            ctx.lineTo(xv,height)
            ctx.stroke()
        })
    }

})(this);

function makePlot(width,height,color){
    let canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    canvas.style.width = width
    canvas.style.height = height
    let ctx = canvas.getContext('2d')
    let carr = undefined
    let prg = 0
    function update(){
        ctx.fillStyle='#fff';
        ctx.fillRect(0,0,width,height)
        plotter.plot([{points: carr,color: color},{points: carr.map(p=>[p[0],0]),color: 'green'}],[prg],ctx,width*0.1,height*0.1,width*0.9,height*0.9,height)
    }
    return {
        html: canvas,
        setArr: arr=>{
            carr=arr
            update()
        },
        setProgress: x=>{
            prg = x
            update()
        }
    }
}

function makeTimePlot(plot,window){
    let arr = []
    return {
        html: plot.html,
        add: (t,v)=>{
            arr.push([t,v])
            if(arr.length>window) arr.shift()
            if(arr.length>5)    plot.setArr(arr)
        },
        reset: ()=>{
            arr = []
        }
    }
}
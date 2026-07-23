import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as math from 'mathjs';
import { LineChart, ZoomIn, ZoomOut, RefreshCw, Eye, Sparkles } from 'lucide-react';

export default function Grapher() {
    const [funcExpr, setFuncExpr] = useState('sin(x)');
    const [funcExpr2, setFuncExpr2] = useState('x^2 - 4');
    const [showFunc2, setShowFunc2] = useState(false);
    const [xMin, setXMin] = useState(-10);
    const [xMax, setXMax] = useState(10);
    const [yMin, setYMin] = useState(-10);
    const [yMax, setYMax] = useState(10);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0, mathX: 0, mathY: 0 });
    const [hovering, setHovering] = useState(false);
    const [graphError, setGraphError] = useState(null);

    const canvasRef = useRef(null);

    const presets = [
        { label: 'Sine Wave: sin(x)', expr1: 'sin(x)', expr2: '', show2: false },
        { label: 'Quadratic: x^2 - 4', expr1: 'x^2 - 4', expr2: '', show2: false },
        { label: 'Trig & Polynomial', expr1: 'sin(x)', expr2: 'x / 2', show2: true },
        { label: 'Exponential & Log', expr1: 'e^(x/2)', expr2: 'log(abs(x)+0.1)', show2: true },
        { label: 'Damped Sine: e^(-0.2*x)*sin(2*x)', expr1: 'exp(-0.2*x)*sin(2*x)', expr2: '', show2: false },
        { label: 'Cubic Curve: x^3 - 3*x', expr1: 'x^3 - 3*x', expr2: '', show2: false }
    ];

    const drawGraph = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Background fill
        ctx.fillStyle = '#090d16';
        ctx.fillRect(0, 0, width, height);

        // Coordinate transformation helper functions
        const toScreenX = (x) => ((x - xMin) / (xMax - xMin)) * width;
        const toScreenY = (y) => height - ((y - yMin) / (yMax - yMin)) * height;
        const toMathX = (px) => xMin + (px / width) * (xMax - xMin);
        const toMathY = (py) => yMin + ((height - py) / height) * (yMax - yMin);

        // Draw grid lines
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';

        // Vertical grid lines
        const xStep = Math.pow(10, Math.floor(Math.log10(xMax - xMin))) / 2 || 1;
        for (let x = Math.ceil(xMin / xStep) * xStep; x <= xMax; x += xStep) {
            const sx = toScreenX(x);
            ctx.beginPath();
            ctx.moveTo(sx, 0);
            ctx.lineTo(sx, height);
            ctx.stroke();
        }

        // Horizontal grid lines
        const yStep = Math.pow(10, Math.floor(Math.log10(yMax - yMin))) / 2 || 1;
        for (let y = Math.ceil(yMin / yStep) * yStep; y <= yMax; y += yStep) {
            const sy = toScreenY(y);
            ctx.beginPath();
            ctx.moveTo(0, sy);
            ctx.lineTo(width, sy);
            ctx.stroke();
        }

        // Draw Main X & Y Axes
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';

        // X axis (y = 0)
        const originY = toScreenY(0);
        ctx.beginPath();
        ctx.moveTo(0, originY);
        ctx.lineTo(width, originY);
        ctx.stroke();

        // Y axis (x = 0)
        const originX = toScreenX(0);
        ctx.beginPath();
        ctx.moveTo(originX, 0);
        ctx.lineTo(originX, height);
        ctx.stroke();

        // Axis Labels & Numbers
        ctx.fillStyle = '#9ca3af';
        ctx.font = '11px JetBrains Mono';

        // Numbers along X axis
        for (let x = Math.ceil(xMin / xStep) * xStep; x <= xMax; x += xStep) {
            if (Math.abs(x) < 0.0001) continue;
            const sx = toScreenX(x);
            ctx.fillText(x.toFixed(1).replace(/\.0$/, ''), sx - 10, Math.min(Math.max(originY + 16, 20), height - 10));
        }

        // Numbers along Y axis
        for (let y = Math.ceil(yMin / yStep) * yStep; y <= yMax; y += yStep) {
            if (Math.abs(y) < 0.0001) continue;
            const sy = toScreenY(y);
            ctx.fillText(y.toFixed(1).replace(/\.0$/, ''), Math.min(Math.max(originX + 6, 6), width - 30), sy + 4);
        }

        // Helper function plotter
        const plotFunction = (exprStr, color) => {
            if (!exprStr.trim()) return;
            try {
                const compiled = math.compile(exprStr);

                ctx.lineWidth = 3;
                ctx.strokeStyle = color;
                ctx.beginPath();

                let firstPoint = true;
                const totalSamples = width; // 1 sample per pixel width

                for (let i = 0; i <= totalSamples; i++) {
                    const px = i;
                    const mx = toMathX(px);
                    try {
                        const my = compiled.evaluate({ x: mx });
                        if (typeof my === 'number' && !isNaN(my) && isFinite(my)) {
                            const py = toScreenY(my);
                            if (firstPoint) {
                                ctx.moveTo(px, py);
                                firstPoint = false;
                            } else {
                                // Handle discontinuities
                                if (Math.abs(py) < height * 3) {
                                    ctx.lineTo(px, py);
                                } else {
                                    firstPoint = true;
                                }
                            }
                        } else {
                            firstPoint = true;
                        }
                    } catch (e) {
                        firstPoint = true;
                    }
                }
                ctx.stroke();
                setGraphError(null);
            } catch (err) {
                setGraphError(`Graph syntax error: "${exprStr}"`);
            }
        };

        // Draw Function 1 (Cyan) & Function 2 (Purple)
        plotFunction(funcExpr, '#06b6d4');
        if (showFunc2) {
            plotFunction(funcExpr2, '#c084fc');
        }

        // Draw Hover Cursor Trace Point
        if (hovering) {
            const mx = mousePos.mathX;
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 4]);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';

            // Vertical line to cursor X
            ctx.beginPath();
            ctx.moveTo(mousePos.x, 0);
            ctx.lineTo(mousePos.x, height);
            ctx.stroke();

            // Evaluate Y value at mouse X for Func 1
            try {
                const compiled1 = math.compile(funcExpr);
                const evalY = compiled1.evaluate({ x: mx });
                if (typeof evalY === 'number' && !isNaN(evalY) && isFinite(evalY)) {
                    const screenY = toScreenY(evalY);

                    // Dot marker
                    ctx.setLineDash([]);
                    ctx.fillStyle = '#06b6d4';
                    ctx.beginPath();
                    ctx.arc(mousePos.x, screenY, 6, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.strokeStyle = '#ffffff';
                    ctx.lineWidth = 2;
                    ctx.stroke();

                    // Coordinate label box
                    const labelText = `f1(${mx.toFixed(2)}) = ${evalY.toFixed(2)}`;
                    ctx.font = '12px JetBrains Mono';
                    const txtWidth = ctx.measureText(labelText).width;

                    ctx.fillStyle = 'rgba(17, 24, 39, 0.9)';
                    ctx.fillRect(mousePos.x + 10, screenY - 26, txtWidth + 16, 26);
                    ctx.strokeStyle = '#06b6d4';
                    ctx.strokeRect(mousePos.x + 10, screenY - 26, txtWidth + 16, 26);

                    ctx.fillStyle = '#ffffff';
                    ctx.fillText(labelText, mousePos.x + 18, screenY - 8);
                }
            } catch (e) { }

            ctx.setLineDash([]);
        }

    }, [funcExpr, funcExpr2, showFunc2, xMin, xMax, yMin, yMax, hovering, mousePos]);

    useEffect(() => {
        drawGraph();
    }, [drawGraph]);

    const handleMouseMove = (e) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const px = e.clientX - rect.left;
        const py = e.clientY - rect.top;

        const mathX = xMin + (px / canvas.width) * (xMax - xMin);
        const mathY = yMin + ((canvas.height - py) / canvas.height) * (yMax - yMin);

        setMousePos({ x: px, y: py, mathX, mathY });
    };

    const handleZoom = (factor) => {
        setXMin(prev => prev * factor);
        setXMax(prev => prev * factor);
        setYMin(prev => prev * factor);
        setYMax(prev => prev * factor);
    };

    const handleReset = () => {
        setXMin(-10);
        setXMax(10);
        setYMin(-10);
        setYMax(10);
    };

    return (
        <div className="dashboard-grid">

            {/* Graph Display Canvas */}
            <div className="glass-panel responsive-span-8">
                <div style={{ padding: '24px' }}>

                    {/* Header Controls */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <LineChart size={20} color="var(--accent-cyan)" /> 2D Canvas Function Plotter
                        </h3>

                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => handleZoom(0.8)} className="glass-button" title="Zoom In"><ZoomIn size={16} /></button>
                            <button onClick={() => handleZoom(1.25)} className="glass-button" title="Zoom Out"><ZoomOut size={16} /></button>
                            <button onClick={handleReset} className="glass-button" title="Reset View"><RefreshCw size={16} /></button>
                        </div>
                    </div>

                    {/* Canvas Box */}
                    <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                        <canvas
                            ref={canvasRef}
                            width={700}
                            height={440}
                            onMouseMove={handleMouseMove}
                            onMouseEnter={() => setHovering(true)}
                            onMouseLeave={() => setHovering(false)}
                            style={{ width: '100%', height: 'auto', display: 'block', cursor: 'crosshair' }}
                        />

                        {graphError && (
                            <div style={{
                                position: 'absolute',
                                top: '12px',
                                left: '12px',
                                right: '12px',
                                background: 'rgba(244, 63, 94, 0.9)',
                                color: '#ffffff',
                                padding: '8px 14px',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '0.85rem',
                                fontWeight: '600'
                            }}>
                                {graphError}
                            </div>
                        )}
                    </div>

                    {/* Range Controls */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginTop: '16px' }}>
                        <div>
                            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>X Min</label>
                            <input type="number" value={xMin} onChange={(e) => setXMin(parseFloat(e.target.value) || -10)} className="glass-input" />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>X Max</label>
                            <input type="number" value={xMax} onChange={(e) => setXMax(parseFloat(e.target.value) || 10)} className="glass-input" />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Y Min</label>
                            <input type="number" value={yMin} onChange={(e) => setYMin(parseFloat(e.target.value) || -10)} className="glass-input" />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Y Max</label>
                            <input type="number" value={yMax} onChange={(e) => setYMax(parseFloat(e.target.value) || 10)} className="glass-input" />
                        </div>
                    </div>

                </div>
            </div>

            {/* Side Controls & Presets */}
            <div className="glass-panel responsive-span-4">
                <div style={{ padding: '24px' }}>

                    <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '16px' }}>Function Equations</h4>

                    {/* Function 1 */}
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                            f₁(x) (Cyan)
                        </label>
                        <input
                            type="text"
                            value={funcExpr}
                            onChange={(e) => setFuncExpr(e.target.value)}
                            className="glass-input"
                            placeholder="e.g. sin(x)"
                        />
                    </div>

                    {/* Function 2 */}
                    <div style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                            <label style={{ fontSize: '0.8rem', color: '#c084fc', fontWeight: '600' }}>
                                f₂(x) (Purple)
                            </label>
                            <button
                                onClick={() => setShowFunc2(!showFunc2)}
                                className="glass-button"
                                style={{ padding: '2px 8px', fontSize: '0.75rem' }}
                            >
                                <Eye size={12} /> {showFunc2 ? 'Hide' : 'Overlay'}
                            </button>
                        </div>
                        {showFunc2 && (
                            <input
                                type="text"
                                value={funcExpr2}
                                onChange={(e) => setFuncExpr2(e.target.value)}
                                className="glass-input"
                                placeholder="e.g. x^2 - 4"
                            />
                        )}
                    </div>

                    {/* Preset Function Library */}
                    <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Sparkles size={16} color="var(--accent-purple)" /> Preset Functions
                    </h4>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {presets.map((preset, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    setFuncExpr(preset.expr1);
                                    setFuncExpr2(preset.expr2);
                                    setShowFunc2(preset.show2);
                                }}
                                className="glass-button"
                                style={{ fontSize: '0.8rem', justifyContent: 'flex-start' }}
                            >
                                {preset.label}
                            </button>
                        ))}
                    </div>

                </div>
            </div>

        </div>
    );
}

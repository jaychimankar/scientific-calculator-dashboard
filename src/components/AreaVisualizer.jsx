import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Shapes, Eye, Sparkles, Copy, Check, Info } from 'lucide-react';

export default function AreaVisualizer() {
    const [selectedShape, setSelectedShape] = useState('circle'); // circle, rectangle, triangle, trapezoid, ellipse, polygon, sector
    const [copied, setCopied] = useState(false);

    // Shape Parameter States
    const [circleRadius, setCircleRadius] = useState(10);
    const [rectWidth, setRectWidth] = useState(16);
    const [rectHeight, setRectHeight] = useState(10);
    const [triBase, setTriBase] = useState(14);
    const [triHeight, setTriHeight] = useState(10);
    const [trapBaseA, setTrapBaseA] = useState(16);
    const [trapBaseB, setTrapBaseB] = useState(10);
    const [trapHeight, setTrapHeight] = useState(8);
    const [ellipseA, setEllipseA] = useState(14);
    const [ellipseB, setEllipseB] = useState(8);
    const [polySides, setPolySides] = useState(6);
    const [polySideLength, setPolySideLength] = useState(8);
    const [sectorRadius, setSectorRadius] = useState(12);
    const [sectorAngle, setSectorAngle] = useState(120);

    const canvasRef = useRef(null);

    // Calculations for current shape
    const shapeMetrics = useMemo(() => {
        switch (selectedShape) {
            case 'circle': {
                const r = Math.max(0.1, circleRadius);
                const area = Math.PI * r * r;
                const perimeter = 2 * Math.PI * r;
                const diameter = 2 * r;
                return {
                    title: 'Circle Geometry',
                    area: area.toFixed(4),
                    perimeter: perimeter.toFixed(4),
                    extraLabel: 'Diameter',
                    extraValue: diameter.toFixed(4),
                    formula: 'Area = π × r² = π × (' + r + ')²',
                    periFormula: 'Circumference = 2 × π × r'
                };
            }
            case 'rectangle': {
                const w = Math.max(0.1, rectWidth);
                const h = Math.max(0.1, rectHeight);
                const area = w * h;
                const perimeter = 2 * (w + h);
                const diagonal = Math.sqrt(w * w + h * h);
                return {
                    title: w === h ? 'Square Geometry' : 'Rectangle Geometry',
                    area: area.toFixed(4),
                    perimeter: perimeter.toFixed(4),
                    extraLabel: 'Diagonal',
                    extraValue: diagonal.toFixed(4),
                    formula: 'Area = width × height = ' + w + ' × ' + h,
                    periFormula: 'Perimeter = 2 × (w + h)'
                };
            }
            case 'triangle': {
                const b = Math.max(0.1, triBase);
                const h = Math.max(0.1, triHeight);
                const area = 0.5 * b * h;
                // Approximate equilateral/isosceles perimeter for base & height
                const sideHyp = Math.sqrt((b / 2) ** 2 + h ** 2);
                const perimeter = b + 2 * sideHyp;
                return {
                    title: 'Triangle Geometry',
                    area: area.toFixed(4),
                    perimeter: perimeter.toFixed(4),
                    extraLabel: 'Slant Side',
                    extraValue: sideHyp.toFixed(4),
                    formula: 'Area = ½ × base × height = ½ × ' + b + ' × ' + h,
                    periFormula: 'Perimeter ≈ b + 2 × √((b/2)² + h²)'
                };
            }
            case 'trapezoid': {
                const a = Math.max(0.1, trapBaseA);
                const b = Math.max(0.1, trapBaseB);
                const h = Math.max(0.1, trapHeight);
                const area = ((a + b) / 2) * h;
                const diff = Math.abs(a - b) / 2;
                const leg = Math.sqrt(diff * diff + h * h);
                const perimeter = a + b + 2 * leg;
                return {
                    title: 'Trapezoid Geometry',
                    area: area.toFixed(4),
                    perimeter: perimeter.toFixed(4),
                    extraLabel: 'Leg Length',
                    extraValue: leg.toFixed(4),
                    formula: 'Area = ½ × (a + b) × h = ½ × (' + a + ' + ' + b + ') × ' + h,
                    periFormula: 'Perimeter = a + b + 2 × leg'
                };
            }
            case 'ellipse': {
                const a = Math.max(0.1, ellipseA);
                const b = Math.max(0.1, ellipseB);
                const area = Math.PI * a * b;
                // Ramanujan approximation for perimeter
                const h = ((a - b) ** 2) / ((a + b) ** 2);
                const perimeter = Math.PI * (a + b) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));
                return {
                    title: 'Ellipse Geometry',
                    area: area.toFixed(4),
                    perimeter: perimeter.toFixed(4),
                    extraLabel: 'Eccentricity',
                    extraValue: (Math.sqrt(Math.max(0, a * a - b * b)) / Math.max(a, b)).toFixed(4),
                    formula: 'Area = π × a × b = π × ' + a + ' × ' + b,
                    periFormula: 'Perimeter ≈ π(a+b)[1 + 3h/(10+√(4-3h))]'
                };
            }
            case 'polygon': {
                const n = Math.max(3, polySides);
                const s = Math.max(0.1, polySideLength);
                const area = (n * s * s) / (4 * Math.tan(Math.PI / n));
                const perimeter = n * s;
                const R = s / (2 * Math.sin(Math.PI / n));
                return {
                    title: n + '-Sided Regular Polygon',
                    area: area.toFixed(4),
                    perimeter: perimeter.toFixed(4),
                    extraLabel: 'Circumradius (R)',
                    extraValue: R.toFixed(4),
                    formula: 'Area = (n × s²) / (4 × tan(π/n))',
                    periFormula: 'Perimeter = n × s = ' + n + ' × ' + s
                };
            }
            case 'sector': {
                const r = Math.max(0.1, sectorRadius);
                const deg = Math.max(0.1, Math.min(360, sectorAngle));
                const area = (deg / 360) * Math.PI * r * r;
                const arcLength = (deg / 360) * 2 * Math.PI * r;
                const perimeter = arcLength + 2 * r;
                return {
                    title: 'Circular Sector (' + deg + '°)',
                    area: area.toFixed(4),
                    perimeter: perimeter.toFixed(4),
                    extraLabel: 'Arc Length',
                    extraValue: arcLength.toFixed(4),
                    formula: 'Area = (θ / 360°) × π × r²',
                    periFormula: 'Perimeter = Arc Length + 2r'
                };
            }
            default:
                return {};
        }
    }, [selectedShape, circleRadius, rectWidth, rectHeight, triBase, triHeight, trapBaseA, trapBaseB, trapHeight, ellipseA, ellipseB, polySides, polySideLength, sectorRadius, sectorAngle]);

    // 2D Canvas Geometry Visualizer Drawing Engine
    const drawGeometry = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const W = canvas.width;
        const H = canvas.height;
        const centerX = W / 2;
        const centerY = H / 2;

        ctx.clearRect(0, 0, W, H);

        // Background Grid
        ctx.fillStyle = '#090d16';
        ctx.fillRect(0, 0, W, H);
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        const gridStep = 20;
        for (let x = 0; x <= W; x += gridStep) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, H);
            ctx.stroke();
        }
        for (let y = 0; y <= H; y += gridStep) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(W, y);
            ctx.stroke();
        }

        // Set styling for shape
        ctx.fillStyle = 'rgba(6, 182, 212, 0.15)';
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 3;
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'rgba(6, 182, 212, 0.4)';

        // Label Font
        ctx.font = '13px JetBrains Mono';
        const drawDimensionLabel = (text, x, y, color = '#ffffff') => {
            ctx.save();
            ctx.shadowBlur = 0;
            const txtWidth = ctx.measureText(text).width;
            ctx.fillStyle = 'rgba(17, 24, 39, 0.85)';
            ctx.fillRect(x - txtWidth / 2 - 6, y - 10, txtWidth + 12, 20);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.lineWidth = 1;
            ctx.strokeRect(x - txtWidth / 2 - 6, y - 10, txtWidth + 12, 20);
            ctx.fillStyle = color;
            ctx.fillText(text, x - txtWidth / 2, y + 4);
            ctx.restore();
        };

        switch (selectedShape) {
            case 'circle': {
                const scale = Math.min(W, H) * 0.35 / Math.max(1, circleRadius);
                const drawR = Math.min(Math.max(20, circleRadius * scale), Math.min(W, H) * 0.4);

                ctx.beginPath();
                ctx.arc(centerX, centerY, drawR, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();

                // Radius Line
                ctx.beginPath();
                ctx.setLineDash([4, 4]);
                ctx.strokeStyle = '#c084fc';
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(centerX + drawR, centerY);
                ctx.stroke();
                ctx.setLineDash([]);

                // Center dot
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
                ctx.fill();

                drawDimensionLabel(`r = ${circleRadius}`, centerX + drawR / 2, centerY - 15, '#c084fc');
                break;
            }

            case 'rectangle': {
                const maxDim = Math.max(rectWidth, rectHeight);
                const scale = Math.min(W * 0.7, H * 0.7) / Math.max(1, maxDim);
                const drawW = Math.min(W * 0.8, Math.max(30, rectWidth * scale));
                const drawH = Math.min(H * 0.8, Math.max(30, rectHeight * scale));

                const x = centerX - drawW / 2;
                const y = centerY - drawH / 2;

                ctx.beginPath();
                ctx.rect(x, y, drawW, drawH);
                ctx.fill();
                ctx.stroke();

                drawDimensionLabel(`width = ${rectWidth}`, centerX, y - 16, '#60a5fa');
                drawDimensionLabel(`height = ${rectHeight}`, x - 35, centerY, '#c084fc');
                break;
            }

            case 'triangle': {
                const scale = Math.min(W * 0.7, H * 0.7) / Math.max(1, triBase, triHeight);
                const drawB = Math.min(W * 0.8, Math.max(40, triBase * scale));
                const drawH = Math.min(H * 0.8, Math.max(40, triHeight * scale));

                const p1 = { x: centerX - drawB / 2, y: centerY + drawH / 2 };
                const p2 = { x: centerX + drawB / 2, y: centerY + drawH / 2 };
                const p3 = { x: centerX, y: centerY - drawH / 2 };

                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.lineTo(p3.x, p3.y);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                // Altitude height dashed line
                ctx.beginPath();
                ctx.setLineDash([4, 4]);
                ctx.strokeStyle = '#c084fc';
                ctx.moveTo(p3.x, p3.y);
                ctx.lineTo(centerX, centerY + drawH / 2);
                ctx.stroke();
                ctx.setLineDash([]);

                drawDimensionLabel(`base = ${triBase}`, centerX, p1.y + 20, '#60a5fa');
                drawDimensionLabel(`height = ${triHeight}`, centerX + 30, centerY, '#c084fc');
                break;
            }

            case 'trapezoid': {
                const maxBase = Math.max(trapBaseA, trapBaseB);
                const scale = Math.min(W * 0.7, H * 0.7) / Math.max(1, maxBase, trapHeight);
                const drawA = Math.min(W * 0.8, Math.max(30, trapBaseA * scale));
                const drawB = Math.min(W * 0.8, Math.max(30, trapBaseB * scale));
                const drawH = Math.min(H * 0.8, Math.max(30, trapHeight * scale));

                const p1 = { x: centerX - drawA / 2, y: centerY + drawH / 2 };
                const p2 = { x: centerX + drawA / 2, y: centerY + drawH / 2 };
                const p3 = { x: centerX + drawB / 2, y: centerY - drawH / 2 };
                const p4 = { x: centerX - drawB / 2, y: centerY - drawH / 2 };

                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.lineTo(p3.x, p3.y);
                ctx.lineTo(p4.x, p4.y);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                drawDimensionLabel(`base a = ${trapBaseA}`, centerX, p1.y + 20, '#60a5fa');
                drawDimensionLabel(`base b = ${trapBaseB}`, centerX, p4.y - 16, '#c084fc');
                break;
            }

            case 'ellipse': {
                const scale = Math.min(W * 0.35, H * 0.35) / Math.max(1, ellipseA, ellipseB);
                const drawA = Math.min(W * 0.45, Math.max(20, ellipseA * scale));
                const drawB = Math.min(H * 0.45, Math.max(20, ellipseB * scale));

                ctx.beginPath();
                ctx.ellipse(centerX, centerY, drawA, drawB, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();

                // Axes dashed lines
                ctx.beginPath();
                ctx.setLineDash([4, 4]);
                ctx.strokeStyle = '#c084fc';
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(centerX + drawA, centerY);
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(centerX, centerY - drawB);
                ctx.stroke();
                ctx.setLineDash([]);

                drawDimensionLabel(`a = ${ellipseA}`, centerX + drawA / 2, centerY - 14, '#60a5fa');
                drawDimensionLabel(`b = ${ellipseB}`, centerX + 20, centerY - drawB / 2, '#c084fc');
                break;
            }

            case 'polygon': {
                const n = Math.max(3, polySides);
                const scale = Math.min(W * 0.35, H * 0.35);
                const r = scale;

                ctx.beginPath();
                for (let i = 0; i < n; i++) {
                    const angle = (i * 2 * Math.PI) / n - Math.PI / 2;
                    const px = centerX + r * Math.cos(angle);
                    const py = centerY + r * Math.sin(angle);
                    if (i === 0) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                }
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                drawDimensionLabel(`n = ${n} sides | side = ${polySideLength}`, centerX, centerY + r + 25, '#06b6d4');
                break;
            }

            case 'sector': {
                const scale = Math.min(W, H) * 0.35 / Math.max(1, sectorRadius);
                const drawR = Math.min(Math.max(30, sectorRadius * scale), Math.min(W, H) * 0.4);
                const rad = (sectorAngle * Math.PI) / 180;

                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.arc(centerX, centerY, drawR, -Math.PI / 2, -Math.PI / 2 + rad);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                drawDimensionLabel(`r = ${sectorRadius}`, centerX + drawR / 2, centerY - 15, '#60a5fa');
                drawDimensionLabel(`θ = ${sectorAngle}°`, centerX, centerY + 20, '#c084fc');
                break;
            }

            default:
                break;
        }
    }, [selectedShape, circleRadius, rectWidth, rectHeight, triBase, triHeight, trapBaseA, trapBaseB, trapHeight, ellipseA, ellipseB, polySides, polySideLength, sectorRadius, sectorAngle]);

    useEffect(() => {
        drawGeometry();
    }, [drawGeometry]);

    const handleCopyResult = () => {
        if (shapeMetrics.area) {
            navigator.clipboard.writeText(`Shape: ${shapeMetrics.title}, Area: ${shapeMetrics.area}, Perimeter: ${shapeMetrics.perimeter}`);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="dashboard-grid">

            {/* Visual Canvas Renderer */}
            <div className="glass-panel responsive-span-7">
                <div style={{ padding: '24px' }}>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Shapes size={20} color="var(--accent-cyan)" /> 2D Shape Geometry Canvas Visualizer
                        </h3>
                    </div>

                    <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                        <canvas
                            ref={canvasRef}
                            width={600}
                            height={400}
                            style={{ width: '100%', height: 'auto', display: 'block' }}
                        />
                    </div>

                    {/* Computed Metrics Box */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '20px' }}>
                        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--accent-cyan)' }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Calculated Area</div>
                            <div className="mono" style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--accent-cyan)' }}>
                                {shapeMetrics.area}
                            </div>
                        </div>

                        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-purple)' }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Perimeter / Boundary</div>
                            <div className="mono" style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--accent-purple)' }}>
                                {shapeMetrics.perimeter}
                            </div>
                        </div>

                        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{shapeMetrics.extraLabel}</div>
                            <div className="mono" style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--accent-amber)' }}>
                                {shapeMetrics.extraValue}
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '16px', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Formula Applied</div>
                            <div className="mono" style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: '600' }}>
                                {shapeMetrics.formula}
                            </div>
                        </div>
                        <button onClick={handleCopyResult} className="glass-button" style={{ fontSize: '0.75rem' }}>
                            {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                            <span>{copied ? 'Copied' : 'Copy Result'}</span>
                        </button>
                    </div>

                </div>
            </div>

            {/* Shape Selector & Controls */}
            <div className="glass-panel responsive-span-5">
                <div style={{ padding: '24px' }}>

                    <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '16px' }}>Select 2D Shape</h4>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '24px' }}>
                        {[
                            { id: 'circle', label: 'Circle' },
                            { id: 'rectangle', label: 'Rectangle' },
                            { id: 'triangle', label: 'Triangle' },
                            { id: 'trapezoid', label: 'Trapezoid' },
                            { id: 'ellipse', label: 'Ellipse' },
                            { id: 'polygon', label: 'Regular Polygon' },
                            { id: 'sector', label: 'Circular Sector' }
                        ].map(s => (
                            <button
                                key={s.id}
                                onClick={() => setSelectedShape(s.id)}
                                className={`glass-button ${selectedShape === s.id ? 'active' : ''}`}
                                style={{ justifyContent: 'center', fontSize: '0.82rem' }}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>

                    <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Sparkles size={16} color="var(--accent-blue)" /> Shape Dimensions
                    </h4>

                    {/* Inputs for selected shape */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {selectedShape === 'circle' && (
                            <div>
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                                    Radius (r): {circleRadius}
                                </label>
                                <input
                                    type="range"
                                    min="1"
                                    max="50"
                                    value={circleRadius}
                                    onChange={(e) => setCircleRadius(parseFloat(e.target.value))}
                                    style={{ width: '100%', accentColor: 'var(--accent-cyan)' }}
                                />
                                <input
                                    type="number"
                                    value={circleRadius}
                                    onChange={(e) => setCircleRadius(parseFloat(e.target.value) || 1)}
                                    className="glass-input"
                                    style={{ marginTop: '8px' }}
                                />
                            </div>
                        )}

                        {selectedShape === 'rectangle' && (
                            <>
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                                        Width (w): {rectWidth}
                                    </label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="60"
                                        value={rectWidth}
                                        onChange={(e) => setRectWidth(parseFloat(e.target.value))}
                                        style={{ width: '100%', accentColor: 'var(--accent-blue)' }}
                                    />
                                    <input
                                        type="number"
                                        value={rectWidth}
                                        onChange={(e) => setRectWidth(parseFloat(e.target.value) || 1)}
                                        className="glass-input"
                                        style={{ marginTop: '8px' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                                        Height (h): {rectHeight}
                                    </label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="60"
                                        value={rectHeight}
                                        onChange={(e) => setRectHeight(parseFloat(e.target.value))}
                                        style={{ width: '100%', accentColor: 'var(--accent-purple)' }}
                                    />
                                    <input
                                        type="number"
                                        value={rectHeight}
                                        onChange={(e) => setRectHeight(parseFloat(e.target.value) || 1)}
                                        className="glass-input"
                                        style={{ marginTop: '8px' }}
                                    />
                                </div>
                            </>
                        )}

                        {selectedShape === 'triangle' && (
                            <>
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                                        Base (b): {triBase}
                                    </label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="60"
                                        value={triBase}
                                        onChange={(e) => setTriBase(parseFloat(e.target.value))}
                                        style={{ width: '100%', accentColor: 'var(--accent-blue)' }}
                                    />
                                    <input
                                        type="number"
                                        value={triBase}
                                        onChange={(e) => setTriBase(parseFloat(e.target.value) || 1)}
                                        className="glass-input"
                                        style={{ marginTop: '8px' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                                        Height (h): {triHeight}
                                    </label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="60"
                                        value={triHeight}
                                        onChange={(e) => setTriHeight(parseFloat(e.target.value))}
                                        style={{ width: '100%', accentColor: 'var(--accent-purple)' }}
                                    />
                                    <input
                                        type="number"
                                        value={triHeight}
                                        onChange={(e) => setTriHeight(parseFloat(e.target.value) || 1)}
                                        className="glass-input"
                                        style={{ marginTop: '8px' }}
                                    />
                                </div>
                            </>
                        )}

                        {selectedShape === 'trapezoid' && (
                            <>
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                                        Base A (bottom): {trapBaseA}
                                    </label>
                                    <input type="number" value={trapBaseA} onChange={(e) => setTrapBaseA(parseFloat(e.target.value) || 1)} className="glass-input" />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                                        Base B (top): {trapBaseB}
                                    </label>
                                    <input type="number" value={trapBaseB} onChange={(e) => setTrapBaseB(parseFloat(e.target.value) || 1)} className="glass-input" />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                                        Height (h): {trapHeight}
                                    </label>
                                    <input type="number" value={trapHeight} onChange={(e) => setTrapHeight(parseFloat(e.target.value) || 1)} className="glass-input" />
                                </div>
                            </>
                        )}

                        {selectedShape === 'ellipse' && (
                            <>
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                                        Semi-major Axis (a): {ellipseA}
                                    </label>
                                    <input type="number" value={ellipseA} onChange={(e) => setEllipseA(parseFloat(e.target.value) || 1)} className="glass-input" />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                                        Semi-minor Axis (b): {ellipseB}
                                    </label>
                                    <input type="number" value={ellipseB} onChange={(e) => setEllipseB(parseFloat(e.target.value) || 1)} className="glass-input" />
                                </div>
                            </>
                        )}

                        {selectedShape === 'polygon' && (
                            <>
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                                        Number of Sides (n): {polySides}
                                    </label>
                                    <input
                                        type="range"
                                        min="3"
                                        max="12"
                                        value={polySides}
                                        onChange={(e) => setPolySides(parseInt(e.target.value))}
                                        style={{ width: '100%', accentColor: 'var(--accent-cyan)' }}
                                    />
                                    <input type="number" value={polySides} onChange={(e) => setPolySides(parseInt(e.target.value) || 3)} className="glass-input" style={{ marginTop: '8px' }} />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                                        Side Length (s): {polySideLength}
                                    </label>
                                    <input type="number" value={polySideLength} onChange={(e) => setPolySideLength(parseFloat(e.target.value) || 1)} className="glass-input" />
                                </div>
                            </>
                        )}

                        {selectedShape === 'sector' && (
                            <>
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                                        Radius (r): {sectorRadius}
                                    </label>
                                    <input type="number" value={sectorRadius} onChange={(e) => setSectorRadius(parseFloat(e.target.value) || 1)} className="glass-input" />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                                        Sector Angle (θ deg): {sectorAngle}°
                                    </label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="360"
                                        value={sectorAngle}
                                        onChange={(e) => setSectorAngle(parseFloat(e.target.value))}
                                        style={{ width: '100%', accentColor: 'var(--accent-purple)' }}
                                    />
                                    <input type="number" value={sectorAngle} onChange={(e) => setSectorAngle(parseFloat(e.target.value) || 1)} className="glass-input" style={{ marginTop: '8px' }} />
                                </div>
                            </>
                        )}

                    </div>

                </div>
            </div>

        </div>
    );
}

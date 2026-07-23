import React, { useState } from 'react';
import * as math from 'mathjs';
import { Grid3X3, ArrowRight, RefreshCw, Copy, Check } from 'lucide-react';

export default function MatrixCalc() {
    const [matrixSize, setMatrixSize] = useState(2); // 2 for 2x2, 3 for 3x3
    const [matrixA, setMatrixA] = useState([
        [1, 2],
        [3, 4]
    ]);
    const [matrixB, setMatrixB] = useState([
        [5, 6],
        [7, 8]
    ]);
    const [resultMatrix, setResultMatrix] = useState(null);
    const [scalarResult, setScalarResult] = useState(null);
    const [operationLabel, setOperationLabel] = useState('');
    const [copied, setCopied] = useState(false);

    // Resize matrix
    const handleSizeChange = (newSize) => {
        setMatrixSize(newSize);
        if (newSize === 2) {
            setMatrixA([
                [1, 2],
                [3, 4]
            ]);
            setMatrixB([
                [5, 6],
                [7, 8]
            ]);
        } else {
            setMatrixA([
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 9]
            ]);
            setMatrixB([
                [9, 8, 7],
                [6, 5, 4],
                [3, 2, 1]
            ]);
        }
        setResultMatrix(null);
        setScalarResult(null);
    };

    const handleCellChange = (matName, r, c, val) => {
        const num = parseFloat(val) || 0;
        if (matName === 'A') {
            const copy = matrixA.map(row => [...row]);
            copy[r][c] = num;
            setMatrixA(copy);
        } else {
            const copy = matrixB.map(row => [...row]);
            copy[r][c] = num;
            setMatrixB(copy);
        }
    };

    // Operations
    const handleDeterminant = (matName) => {
        try {
            const mat = matName === 'A' ? matrixA : matrixB;
            const det = math.det(mat);
            setScalarResult(Number(det.toFixed(6)));
            setResultMatrix(null);
            setOperationLabel(`Determinant det(${matName})`);
        } catch (e) {
            setScalarResult('Error');
        }
    };

    const handleTranspose = (matName) => {
        try {
            const mat = matName === 'A' ? matrixA : matrixB;
            const trans = math.transpose(mat);
            setResultMatrix(trans);
            setScalarResult(null);
            setOperationLabel(`Transpose (${matName}ᵀ)`);
        } catch (e) { }
    };

    const handleInverse = (matName) => {
        try {
            const mat = matName === 'A' ? matrixA : matrixB;
            const inv = math.inv(mat);
            setResultMatrix(inv.map(row => row.map(cell => Number(cell.toFixed(4)))));
            setScalarResult(null);
            setOperationLabel(`Inverse (${matName}⁻¹)`);
        } catch (e) {
            setScalarResult('Matrix is Singular (det = 0)');
            setResultMatrix(null);
            setOperationLabel(`Inverse (${matName}⁻¹)`);
        }
    };

    const handleAdd = () => {
        try {
            const sum = math.add(matrixA, matrixB);
            setResultMatrix(sum);
            setScalarResult(null);
            setOperationLabel('Matrix Addition (A + B)');
        } catch (e) { }
    };

    const handleMultiply = () => {
        try {
            const prod = math.multiply(matrixA, matrixB);
            setResultMatrix(prod);
            setScalarResult(null);
            setOperationLabel('Matrix Multiplication (A × B)');
        } catch (e) { }
    };

    const handleCopy = () => {
        let txt = '';
        if (scalarResult !== null) {
            txt = scalarResult.toString();
        } else if (resultMatrix) {
            txt = resultMatrix.map(row => row.join('\t')).join('\n');
        }
        if (txt) {
            navigator.clipboard.writeText(txt);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }} className="glass-panel">
            <div style={{ padding: '28px' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Grid3X3 size={24} color="var(--accent-purple)" /> Linear Algebra & Matrix Calculator
                    </h3>

                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            onClick={() => handleSizeChange(2)}
                            className={`glass-button ${matrixSize === 2 ? 'active' : ''}`}
                        >
                            2×2 Matrix
                        </button>
                        <button
                            onClick={() => handleSizeChange(3)}
                            className={`glass-button ${matrixSize === 3 ? 'active' : ''}`}
                        >
                            3×3 Matrix
                        </button>
                    </div>
                </div>

                {/* Matrix Inputs Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '20px', alignItems: 'center', marginBottom: '24px' }}>

                    {/* Matrix A */}
                    <div style={{ gridColumn: 'span 5' }} className="glass-panel">
                        <div style={{ padding: '16px' }}>
                            <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-blue)', marginBottom: '12px', fontWeight: '700' }}>
                                Matrix A
                            </h4>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: `repeat(${matrixSize}, 1fr)`,
                                gap: '8px'
                            }}>
                                {matrixA.map((row, r) =>
                                    row.map((cell, c) => (
                                        <input
                                            key={`A-${r}-${c}`}
                                            type="number"
                                            value={cell}
                                            onChange={(e) => handleCellChange('A', r, c, e.target.value)}
                                            className="glass-input mono"
                                            style={{ textAlign: 'center', fontSize: '1.1rem' }}
                                        />
                                    ))
                                )}
                            </div>

                            <div style={{ display: 'flex', gap: '6px', marginTop: '12px' }}>
                                <button onClick={() => handleDeterminant('A')} className="glass-button" style={{ flex: 1, fontSize: '0.75rem', justifyContent: 'center' }}>det(A)</button>
                                <button onClick={() => handleTranspose('A')} className="glass-button" style={{ flex: 1, fontSize: '0.75rem', justifyContent: 'center' }}>Aᵀ</button>
                                <button onClick={() => handleInverse('A')} className="glass-button" style={{ flex: 1, fontSize: '0.75rem', justifyContent: 'center' }}>A⁻¹</button>
                            </div>

                        </div>
                    </div>

                    {/* Operations Column */}
                    <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <button onClick={handleAdd} className="glass-button" style={{ justifyContent: 'center', fontSize: '0.85rem' }}>
                            A + B
                        </button>
                        <button onClick={handleMultiply} className="glass-button" style={{ justifyContent: 'center', fontSize: '0.85rem' }}>
                            A × B
                        </button>
                    </div>

                    {/* Matrix B */}
                    <div style={{ gridColumn: 'span 5' }} className="glass-panel">
                        <div style={{ padding: '16px' }}>
                            <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-purple)', marginBottom: '12px', fontWeight: '700' }}>
                                Matrix B
                            </h4>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: `repeat(${matrixSize}, 1fr)`,
                                gap: '8px'
                            }}>
                                {matrixB.map((row, r) =>
                                    row.map((cell, c) => (
                                        <input
                                            key={`B-${r}-${c}`}
                                            type="number"
                                            value={cell}
                                            onChange={(e) => handleCellChange('B', r, c, e.target.value)}
                                            className="glass-input mono"
                                            style={{ textAlign: 'center', fontSize: '1.1rem' }}
                                        />
                                    ))
                                )}
                            </div>

                            <div style={{ display: 'flex', gap: '6px', marginTop: '12px' }}>
                                <button onClick={() => handleDeterminant('B')} className="glass-button" style={{ flex: 1, fontSize: '0.75rem', justifyContent: 'center' }}>det(B)</button>
                                <button onClick={() => handleTranspose('B')} className="glass-button" style={{ flex: 1, fontSize: '0.75rem', justifyContent: 'center' }}>Bᵀ</button>
                                <button onClick={() => handleInverse('B')} className="glass-button" style={{ flex: 1, fontSize: '0.75rem', justifyContent: 'center' }}>B⁻¹</button>
                            </div>

                        </div>
                    </div>

                </div>

                {/* Result Output Card */}
                {(resultMatrix || scalarResult !== null) && (
                    <div className="glass-panel animate-fade-in" style={{ padding: '20px', background: 'rgba(6, 182, 212, 0.05)', border: '1px solid var(--accent-cyan)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--accent-cyan)' }}>
                                Result: {operationLabel}
                            </h4>
                            <button onClick={handleCopy} className="glass-button" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                                {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                                <span>{copied ? 'Copied' : 'Copy Result'}</span>
                            </button>
                        </div>

                        {scalarResult !== null ? (
                            <div className="mono" style={{ fontSize: '1.6rem', fontWeight: '700', color: '#ffffff' }}>
                                {scalarResult}
                            </div>
                        ) : (
                            <div style={{
                                display: 'inline-grid',
                                gridTemplateColumns: `repeat(${resultMatrix[0].length}, 1fr)`,
                                gap: '10px',
                                background: 'rgba(0, 0, 0, 0.3)',
                                padding: '16px',
                                borderRadius: 'var(--radius-md)',
                                borderLeft: '3px solid var(--accent-cyan)',
                                borderRight: '3px solid var(--accent-cyan)'
                            }}>
                                {resultMatrix.map((row, r) =>
                                    row.map((cell, c) => (
                                        <div key={`res-${r}-${c}`} className="mono" style={{ fontSize: '1.2rem', padding: '8px 16px', textAlign: 'center' }}>
                                            {cell}
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}

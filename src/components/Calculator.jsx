import React, { useState, useEffect, useCallback } from 'react';
import * as math from 'mathjs';
import {
    Delete,
    RotateCcw,
    CornerDownLeft,
    Zap,
    Check,
    Copy,
    Cpu,
    ListOrdered,
    HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Calculator({ onAddHistory, externalInsert }) {
    const [expression, setExpression] = useState('');
    const [result, setResult] = useState('');
    const [angleUnit, setAngleUnit] = useState('DEG'); // 'DEG' or 'RAD'
    const [memory, setMemory] = useState(0);
    const [hasMemory, setHasMemory] = useState(false);
    const [activeTabKeypad, setActiveTabKeypad] = useState('scientific'); // 'scientific', 'functions', 'constants'
    const [copied, setCopied] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);

    // Handle external insert from Formula Reference or History
    useEffect(() => {
        if (externalInsert) {
            setExpression(prev => prev + externalInsert);
        }
    }, [externalInsert]);

    // Live evaluation preview
    useEffect(() => {
        if (!expression.trim()) {
            setResult('');
            setErrorMsg(null);
            return;
        }
        try {
            let exprToEval = expression
                .replace(/×/g, '*')
                .replace(/÷/g, '/')
                .replace(/π/g, 'pi')
                .replace(/√\(/g, 'sqrt(')
                .replace(/∛\(/g, 'cbrt(');

            // Pre-process trig functions for DEG mode if active
            if (angleUnit === 'DEG') {
                // Convert sin(x) -> sin(x deg)
                exprToEval = exprToEval.replace(/(sin|cos|tan)\(([^)]+)\)/g, (match, func, arg) => {
                    return `${func}((${arg}) deg)`;
                });
            }

            const res = math.evaluate(exprToEval);
            if (res !== undefined && typeof res !== 'function') {
                const formatted = typeof res === 'number'
                    ? Number(res.toFixed(10)).toString()
                    : res.toString();
                setResult(formatted);
                setErrorMsg(null);
            }
        } catch (err) {
            // Ignore intermediate typing syntax errors in live preview
        }
    }, [expression, angleUnit]);

    // Calculate final result
    const calculateResult = useCallback(() => {
        if (!expression.trim()) return;
        try {
            let exprToEval = expression
                .replace(/×/g, '*')
                .replace(/÷/g, '/')
                .replace(/π/g, 'pi')
                .replace(/√\(/g, 'sqrt(')
                .replace(/∛\(/g, 'cbrt(');

            if (angleUnit === 'DEG') {
                exprToEval = exprToEval.replace(/(sin|cos|tan)\(([^)]+)\)/g, (match, func, arg) => {
                    return `${func}((${arg}) deg)`;
                });
            }

            const res = math.evaluate(exprToEval);
            if (res !== undefined) {
                const formattedRes = typeof res === 'number'
                    ? Number(res.toFixed(10)).toString()
                    : res.toString();

                setResult(formattedRes);
                onAddHistory({
                    expression,
                    result: formattedRes,
                    timestamp: new Date().toLocaleTimeString(),
                    type: 'calc'
                });

                setExpression(formattedRes);
                setErrorMsg(null);

                // Easter egg confetti for fun calculations like 42 or 777
                if (formattedRes === '42' || formattedRes === '777') {
                    confetti({ particleCount: 50, spread: 60 });
                }
            }
        } catch (err) {
            setErrorMsg('Syntax Error');
        }
    }, [expression, angleUnit, onAddHistory]);

    const handleAppend = (val) => {
        setExpression(prev => prev + val);
    };

    const handleClear = () => {
        setExpression('');
        setResult('');
        setErrorMsg(null);
    };

    const handleDelete = () => {
        setExpression(prev => prev.slice(0, -1));
    };

    const handleCopy = () => {
        const textToCopy = result || expression;
        if (textToCopy) {
            navigator.clipboard.writeText(textToCopy);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // Memory functions
    const handleMemory = (action) => {
        try {
            const currentVal = parseFloat(result || expression || '0');
            if (isNaN(currentVal)) return;

            switch (action) {
                case 'MC':
                    setMemory(0);
                    setHasMemory(false);
                    break;
                case 'MR':
                    setExpression(prev => prev + memory.toString());
                    break;
                case 'M+':
                    setMemory(prev => prev + currentVal);
                    setHasMemory(true);
                    break;
                case 'M-':
                    setMemory(prev => prev - currentVal);
                    setHasMemory(true);
                    break;
                case 'MS':
                    setMemory(currentVal);
                    setHasMemory(true);
                    break;
                default:
                    break;
            }
        } catch (e) { }
    };

    // Keyboard handler
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
                return;
            }

            if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
                handleAppend(e.key);
            } else if (['+', '-', '*', '/', '(', ')', '^', '%'].includes(e.key)) {
                let op = e.key;
                if (op === '*') op = '×';
                if (op === '/') op = '÷';
                handleAppend(op);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                calculateResult();
            } else if (e.key === 'Backspace') {
                handleDelete();
            } else if (e.key === 'Escape') {
                handleClear();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [calculateResult]);

    return (
        <div className="dashboard-grid">

            {/* Main Display & Keypad */}
            <div className="glass-panel responsive-span-8">
                <div style={{ padding: '24px' }}>

                    {/* Top Bar: Angle mode & Copy */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                onClick={() => setAngleUnit('DEG')}
                                className={`glass-button ${angleUnit === 'DEG' ? 'active' : ''}`}
                                style={{ padding: '4px 12px', fontSize: '0.75rem' }}
                            >
                                DEG
                            </button>
                            <button
                                onClick={() => setAngleUnit('RAD')}
                                className={`glass-button ${angleUnit === 'RAD' ? 'active' : ''}`}
                                style={{ padding: '4px 12px', fontSize: '0.75rem' }}
                            >
                                RAD
                            </button>
                            {hasMemory && (
                                <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--accent-amber)', background: 'rgba(245, 158, 11, 0.15)', padding: '4px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Cpu size={12} /> M={memory}
                                </span>
                            )}
                        </div>

                        <button
                            onClick={handleCopy}
                            className="glass-button"
                            style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                        >
                            {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                            <span>{copied ? 'Copied' : 'Copy'}</span>
                        </button>
                    </div>

                    {/* Calculator Screen Display */}
                    <div style={{
                        background: 'rgba(0, 0, 0, 0.4)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '20px',
                        marginBottom: '20px',
                        boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5)'
                    }}>
                        {/* Upper expression line */}
                        <div className="mono" style={{
                            fontSize: '1rem',
                            color: 'var(--text-secondary)',
                            minHeight: '24px',
                            textAlign: 'right',
                            overflowX: 'auto',
                            whiteSpace: 'nowrap',
                            wordBreak: 'break-all'
                        }}>
                            {expression || '0'}
                        </div>

                        {/* Main result / preview line */}
                        <div className="mono" style={{
                            fontSize: '2.4rem',
                            fontWeight: '700',
                            color: errorMsg ? 'var(--accent-rose)' : '#ffffff',
                            textAlign: 'right',
                            marginTop: '8px',
                            overflowX: 'auto',
                            minHeight: '48px',
                            textShadow: result ? '0 0 20px rgba(59, 130, 246, 0.3)' : 'none'
                        }}>
                            {errorMsg ? errorMsg : result ? `= ${result}` : ''}
                        </div>
                    </div>

                    {/* Sub-Tabs for Keypad modes */}
                    <div className="sub-tabs-flex" style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                        <button
                            onClick={() => setActiveTabKeypad('scientific')}
                            className={`glass-button ${activeTabKeypad === 'scientific' ? 'active' : ''}`}
                            style={{ flex: 1, justifyContent: 'center', fontSize: '0.8rem' }}
                        >
                            Scientific
                        </button>
                        <button
                            onClick={() => setActiveTabKeypad('functions')}
                            className={`glass-button ${activeTabKeypad === 'functions' ? 'active' : ''}`}
                            style={{ flex: 1, justifyContent: 'center', fontSize: '0.8rem' }}
                        >
                            Advanced
                        </button>
                        <button
                            onClick={() => setActiveTabKeypad('constants')}
                            className={`glass-button ${activeTabKeypad === 'constants' ? 'active' : ''}`}
                            style={{ flex: 1, justifyContent: 'center', fontSize: '0.8rem' }}
                        >
                            Constants
                        </button>
                    </div>

                    {/* Keypad Layout Grid */}
                    <div className="keypad-grid-5" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>

                        {/* Row 1: Memory & Clear */}
                        <button onClick={() => handleMemory('MC')} className="keypad-btn fn-btn">MC</button>
                        <button onClick={() => handleMemory('MR')} className="keypad-btn fn-btn">MR</button>
                        <button onClick={() => handleMemory('M+')} className="keypad-btn fn-btn">M+</button>
                        <button onClick={handleDelete} className="keypad-btn clear-btn"><Delete size={18} /></button>
                        <button onClick={handleClear} className="keypad-btn clear-btn"><RotateCcw size={18} /></button>

                        {/* Scientific Keypad Mode */}
                        {activeTabKeypad === 'scientific' && (
                            <>
                                <button onClick={() => handleAppend('sin(')} className="keypad-btn fn-btn">sin</button>
                                <button onClick={() => handleAppend('cos(')} className="keypad-btn fn-btn">cos</button>
                                <button onClick={() => handleAppend('tan(')} className="keypad-btn fn-btn">tan</button>
                                <button onClick={() => handleAppend('^')} className="keypad-btn op-btn">x^y</button>
                                <button onClick={() => handleAppend('÷')} className="keypad-btn op-btn">÷</button>

                                <button onClick={() => handleAppend('log10(')} className="keypad-btn fn-btn">log₁₀</button>
                                <button onClick={() => handleAppend('7')} className="keypad-btn">7</button>
                                <button onClick={() => handleAppend('8')} className="keypad-btn">8</button>
                                <button onClick={() => handleAppend('9')} className="keypad-btn">9</button>
                                <button onClick={() => handleAppend('×')} className="keypad-btn op-btn">×</button>

                                <button onClick={() => handleAppend('ln(')} className="keypad-btn fn-btn">ln</button>
                                <button onClick={() => handleAppend('4')} className="keypad-btn">4</button>
                                <button onClick={() => handleAppend('5')} className="keypad-btn">5</button>
                                <button onClick={() => handleAppend('6')} className="keypad-btn">6</button>
                                <button onClick={() => handleAppend('-')} className="keypad-btn op-btn">-</button>

                                <button onClick={() => handleAppend('√(')} className="keypad-btn fn-btn">√x</button>
                                <button onClick={() => handleAppend('1')} className="keypad-btn">1</button>
                                <button onClick={() => handleAppend('2')} className="keypad-btn">2</button>
                                <button onClick={() => handleAppend('3')} className="keypad-btn">3</button>
                                <button onClick={() => handleAppend('+')} className="keypad-btn op-btn">+</button>

                                <button onClick={() => handleAppend('π')} className="keypad-btn fn-btn">π</button>
                                <button onClick={() => handleAppend('0')} className="keypad-btn">0</button>
                                <button onClick={() => handleAppend('.')} className="keypad-btn">.</button>
                                <button onClick={() => handleAppend('(')} className="keypad-btn fn-btn">(</button>
                                <button onClick={calculateResult} className="keypad-btn equals-btn">=</button>
                            </>
                        )}

                        {/* Advanced / Hyperbolic Keypad Mode */}
                        {activeTabKeypad === 'functions' && (
                            <>
                                <button onClick={() => handleAppend('asin(')} className="keypad-btn fn-btn">sin⁻¹</button>
                                <button onClick={() => handleAppend('acos(')} className="keypad-btn fn-btn">cos⁻¹</button>
                                <button onClick={() => handleAppend('atan(')} className="keypad-btn fn-btn">tan⁻¹</button>
                                <button onClick={() => handleAppend('abs(')} className="keypad-btn fn-btn">|x|</button>
                                <button onClick={() => handleAppend('mod(')} className="keypad-btn op-btn">mod</button>

                                <button onClick={() => handleAppend('sinh(')} className="keypad-btn fn-btn">sinh</button>
                                <button onClick={() => handleAppend('cosh(')} className="keypad-btn fn-btn">cosh</button>
                                <button onClick={() => handleAppend('tanh(')} className="keypad-btn fn-btn">tanh</button>
                                <button onClick={() => handleAppend('!')} className="keypad-btn fn-btn">n!</button>
                                <button onClick={() => handleAppend('%')} className="keypad-btn op-btn">%</button>

                                <button onClick={() => handleAppend('10^(')} className="keypad-btn fn-btn">10ⁿ</button>
                                <button onClick={() => handleAppend('e^(')} className="keypad-btn fn-btn">eⁿ</button>
                                <button onClick={() => handleAppend('^2')} className="keypad-btn fn-btn">x²</button>
                                <button onClick={() => handleAppend('^3')} className="keypad-btn fn-btn">x³</button>
                                <button onClick={() => handleAppend('∛(')} className="keypad-btn fn-btn">∛x</button>

                                <button onClick={() => handleAppend(')')} className="keypad-btn fn-btn">)</button>
                                <button onClick={() => handleAppend(',')} className="keypad-btn fn-btn">,</button>
                                <button onClick={() => handleAppend('e')} className="keypad-btn fn-btn">e</button>
                                <button onClick={() => handleAppend('phi')} className="keypad-btn fn-btn">φ</button>
                                <button onClick={calculateResult} className="keypad-btn equals-btn">=</button>
                            </>
                        )}

                        {/* Constants Keypad Mode */}
                        {activeTabKeypad === 'constants' && (
                            <>
                                <button onClick={() => handleAppend('3.1415926535')} className="keypad-btn fn-btn">π (Pi)</button>
                                <button onClick={() => handleAppend('2.7182818284')} className="keypad-btn fn-btn">e (Euler)</button>
                                <button onClick={() => handleAppend('1.6180339887')} className="keypad-btn fn-btn">φ (Golden)</button>
                                <button onClick={() => handleAppend('299792458')} className="keypad-btn fn-btn">c (Speed of Light)</button>
                                <button onClick={() => handleAppend('6.6743e-11')} className="keypad-btn fn-btn">G (Gravitational)</button>

                                <button onClick={() => handleAppend('6.62607015e-34')} className="keypad-btn fn-btn">h (Planck)</button>
                                <button onClick={() => handleAppend('1.380649e-23')} className="keypad-btn fn-btn">k (Boltzmann)</button>
                                <button onClick={() => handleAppend('1.602176634e-19')} className="keypad-btn fn-btn">e⁻ (Charge)</button>
                                <button onClick={() => handleAppend('9.80665')} className="keypad-btn fn-btn">g (Gravity)</button>
                                <button onClick={() => handleAppend('6.02214076e23')} className="keypad-btn fn-btn">N₇ (Avogadro)</button>

                                <button onClick={() => handleAppend('8.314462618')} className="keypad-btn fn-btn">R (Gas Const)</button>
                                <button onClick={() => handleAppend('8.8541878128e-12')} className="keypad-btn fn-btn">ε₀ (Permittivity)</button>
                                <button onClick={() => handleAppend('1.25663706212e-6')} className="keypad-btn fn-btn">μ₀ (Permeability)</button>
                                <button onClick={() => handleAppend('9.1093837015e-31')} className="keypad-btn fn-btn">mₑ (Electron M)</button>
                                <button onClick={calculateResult} className="keypad-btn equals-btn">=</button>
                            </>
                        )}

                    </div>

                </div>
            </div>

            {/* Side Quick Tools Banner */}
            <div className="glass-panel responsive-span-4">
                <div style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Zap size={18} color="var(--accent-amber)" /> Quick Scientific Actions
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <button
                            onClick={() => { setExpression('sin(45)'); }}
                            className="glass-button"
                            style={{ justifyContent: 'space-between' }}
                        >
                            <span>Trig Evaluation</span>
                            <span className="mono" style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)' }}>sin(45°)</span>
                        </button>

                        <button
                            onClick={() => { setExpression('log10(1000)'); }}
                            className="glass-button"
                            style={{ justifyContent: 'space-between' }}
                        >
                            <span>Base-10 Logarithm</span>
                            <span className="mono" style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)' }}>log₁₀(1000)</span>
                        </button>

                        <button
                            onClick={() => { setExpression('2^10'); }}
                            className="glass-button"
                            style={{ justifyContent: 'space-between' }}
                        >
                            <span>Binary Power</span>
                            <span className="mono" style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)' }}>2¹⁰</span>
                        </button>

                        <button
                            onClick={() => { setExpression('5!'); }}
                            className="glass-button"
                            style={{ justifyContent: 'space-between' }}
                        >
                            <span>Factorial</span>
                            <span className="mono" style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)' }}>5!</span>
                        </button>

                        <button
                            onClick={() => { setExpression('sqrt(144) + cbrt(27)'); }}
                            className="glass-button"
                            style={{ justifyContent: 'space-between' }}
                        >
                            <span>Roots Combination</span>
                            <span className="mono" style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)' }}>√144 + ∛27</span>
                        </button>
                    </div>

                    <div style={{ marginTop: '24px', padding: '14px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--accent-blue)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <HelpCircle size={14} /> Keyboard Shortcuts
                        </h4>
                        <ul style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', paddingLeft: '16px', lineHeight: '1.6' }}>
                            <li>Numbers & Operators: <span className="mono">0-9, +, -, *, /</span></li>
                            <li>Equals: <span className="mono">Enter</span> key</li>
                            <li>Clear / Delete: <span className="mono">Esc / Backspace</span></li>
                        </ul>
                    </div>

                </div>
            </div>

        </div>
    );
}

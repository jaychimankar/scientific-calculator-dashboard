import React, { useState } from 'react';
import { BookOpen, Search, CornerUpLeft, Tag } from 'lucide-react';

export default function FormulaReference({ onInsertFormula }) {
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');

    const formulas = [
        // Algebra & Polynomials
        { name: 'Quadratic Formula', expr: '(-b + sqrt(b^2 - 4*a*c)) / (2*a)', cat: 'Algebra', desc: 'Solves quadratic equations ax² + bx + c = 0' },
        { name: 'Binomial Theorem Expansion', expr: '(a + b)^n', cat: 'Algebra', desc: 'Polynomial expansion of power (a + b)ⁿ' },
        { name: 'Logarithm Change of Base', expr: 'log(x) / log(b)', cat: 'Algebra', desc: 'Converts logarithm from base b to natural log' },

        // Geometry & Trigonometry
        { name: 'Pythagorean Theorem', expr: 'sqrt(a^2 + b^2)', cat: 'Trigonometry', desc: 'Hypotenuse calculation c = √(a² + b²)' },
        { name: 'Euler Identity', expr: 'e^(i * pi) + 1', cat: 'Trigonometry', desc: 'Fundamental mathematical identity' },
        { name: 'Law of Cosines', expr: 'sqrt(a^2 + b^2 - 2*a*b*cos(C))', cat: 'Trigonometry', desc: 'Side c in non-right triangles' },

        // Calculus & Analysis
        { name: 'Taylor Series Expansion', expr: 'sum((f^n(a)/n!) * (x-a)^n)', cat: 'Calculus', desc: 'Infinite sum approximation of smooth function' },
        { name: 'Gaussian Normal Distribution', expr: '(1 / (sigma * sqrt(2*pi))) * e^(-0.5 * ((x - mu) / sigma)^2)', cat: 'Calculus', desc: 'Probability density function of normal distribution' },

        // Physics & Relativity
        { name: 'Einstein Mass-Energy', expr: 'm * c^2', cat: 'Physics', desc: 'Energy equivalent E = mc²' },
        { name: 'Newton Universal Gravitation', expr: '(G * m1 * m2) / (r^2)', cat: 'Physics', desc: 'Gravitational force between two masses' },
        { name: 'Kinetic Energy', expr: '0.5 * m * v^2', cat: 'Physics', desc: 'Energy of an object in motion' },
        { name: 'De Broglie Wavelength', expr: 'h / (m * v)', cat: 'Physics', desc: 'Wavelength associated with a particle' },

        // Electrical Engineering
        { name: 'Ohm Law Voltage', expr: 'I * R', cat: 'Engineering', desc: 'Electrical potential difference V = I × R' },
        { name: 'Resonance Frequency', expr: '1 / (2 * pi * sqrt(L * C))', cat: 'Engineering', desc: 'LC circuit resonant frequency' }
    ];

    const categories = ['All', 'Algebra', 'Trigonometry', 'Calculus', 'Physics', 'Engineering'];

    const filteredFormulas = formulas.filter(f => {
        const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase()) ||
            f.expr.toLowerCase().includes(search.toLowerCase()) ||
            f.desc.toLowerCase().includes(search.toLowerCase());
        const matchesCat = categoryFilter === 'All' || f.cat === categoryFilter;
        return matchesSearch && matchesCat;
    });

    return (
        <div style={{ maxWidth: '950px', margin: '0 auto' }} className="glass-panel">
            <div style={{ padding: '28px' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <BookOpen size={24} color="var(--accent-cyan)" /> Scientific Formula & Equation Reference
                    </h3>
                </div>

                {/* Filters & Search */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="glass-input"
                            placeholder="Search math, physics, engineering equations..."
                            style={{ paddingLeft: '38px' }}
                        />
                        <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                    </div>

                    <div style={{ display: 'flex', gap: '6px', overflowX: 'auto' }}>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setCategoryFilter(cat)}
                                className={`glass-button ${categoryFilter === cat ? 'active' : ''}`}
                                style={{ fontSize: '0.8rem' }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Formula Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                    {filteredFormulas.map((formula, idx) => (
                        <div
                            key={idx}
                            className="glass-panel"
                            style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                        >
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                    <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#ffffff' }}>
                                        {formula.name}
                                    </h4>
                                    <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--accent-purple)', background: 'rgba(139, 92, 246, 0.15)', padding: '2px 8px', borderRadius: '4px' }}>
                                        {formula.cat}
                                    </span>
                                </div>

                                <div className="mono" style={{
                                    background: 'rgba(0, 0, 0, 0.3)',
                                    padding: '10px 14px',
                                    borderRadius: 'var(--radius-md)',
                                    color: 'var(--accent-cyan)',
                                    fontSize: '0.9rem',
                                    marginBottom: '10px',
                                    borderLeft: '3px solid var(--accent-cyan)',
                                    wordBreak: 'break-all'
                                }}>
                                    {formula.expr}
                                </div>

                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                                    {formula.desc}
                                </p>
                            </div>

                            <button
                                onClick={() => onInsertFormula(formula.expr)}
                                className="glass-button"
                                style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem' }}
                            >
                                <CornerUpLeft size={14} /> Insert into Calculator
                            </button>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}

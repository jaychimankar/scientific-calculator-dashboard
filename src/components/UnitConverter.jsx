import React, { useState, useMemo } from 'react';
import { Scale, ArrowRightLeft, Copy, Check } from 'lucide-react';

export default function UnitConverter() {
    const [category, setCategory] = useState('length');
    const [fromUnit, setFromUnit] = useState('meter');
    const [toUnit, setToUnit] = useState('kilometer');
    const [inputValue, setInputValue] = useState('1000');
    const [copied, setCopied] = useState(false);

    const categories = {
        length: {
            name: 'Length & Distance',
            units: {
                meter: 1,
                kilometer: 0.001,
                centimeter: 100,
                millimeter: 1000,
                mile: 0.000621371,
                yard: 1.09361,
                foot: 3.28084,
                inch: 39.3701,
                nautical_mile: 0.000539957
            }
        },
        weight: {
            name: 'Weight & Mass',
            units: {
                kilogram: 1,
                gram: 1000,
                milligram: 1000000,
                pound: 2.20462,
                ounce: 35.274,
                ton: 0.001
            }
        },
        temperature: {
            name: 'Temperature',
            custom: true,
            units: ['celsius', 'fahrenheit', 'kelvin']
        },
        data: {
            name: 'Data Storage',
            units: {
                byte: 1,
                kilobyte: 1 / 1024,
                megabyte: 1 / (1024 * 1024),
                gigabyte: 1 / (1024 * 1024 * 1024),
                terabyte: 1 / (1024 * 1024 * 1024 * 1024)
            }
        },
        speed: {
            name: 'Speed',
            units: {
                meter_per_sec: 1,
                km_per_hour: 3.6,
                mile_per_hour: 2.23694,
                knot: 1.94384
            }
        },
        angle: {
            name: 'Angle',
            units: {
                degree: 1,
                radian: Math.PI / 180,
                gradian: 400 / 360
            }
        }
    };

    // Set default units on category change
    const handleCategoryChange = (catKey) => {
        setCategory(catKey);
        const catObj = categories[catKey];
        if (catObj.custom) {
            setFromUnit(catObj.units[0]);
            setToUnit(catObj.units[1]);
        } else {
            const keys = Object.keys(catObj.units);
            setFromUnit(keys[0]);
            setToUnit(keys[1] || keys[0]);
        }
    };

    // Convert function logic
    const convertedValue = useMemo(() => {
        const val = parseFloat(inputValue);
        if (isNaN(val)) return '---';

        if (category === 'temperature') {
            if (fromUnit === toUnit) return val.toString();
            let celsiusVal = val;
            if (fromUnit === 'fahrenheit') celsiusVal = (val - 32) * (5 / 9);
            if (fromUnit === 'kelvin') celsiusVal = val - 273.15;

            if (toUnit === 'celsius') return celsiusVal.toFixed(4);
            if (toUnit === 'fahrenheit') return ((celsiusVal * 9 / 5) + 32).toFixed(4);
            if (toUnit === 'kelvin') return (celsiusVal + 273.15).toFixed(4);
        } else {
            const unitMap = categories[category].units;
            const baseVal = val / unitMap[fromUnit];
            const result = baseVal * unitMap[toUnit];
            return result < 0.0001 || result > 1000000
                ? result.toExponential(6)
                : Number(result.toFixed(6)).toString();
        }
    }, [category, fromUnit, toUnit, inputValue]);

    const handleSwap = () => {
        setFromUnit(toUnit);
        setToUnit(fromUnit);
    };

    const handleCopy = () => {
        if (convertedValue !== '---') {
            navigator.clipboard.writeText(convertedValue);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }} className="glass-panel">
            <div style={{ padding: '28px' }}>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Scale size={24} color="var(--accent-amber)" /> Scientific & Metric Unit Converter
                    </h3>
                </div>

                {/* Category Tabs */}
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '24px', paddingBottom: '4px' }}>
                    {Object.keys(categories).map((catKey) => (
                        <button
                            key={catKey}
                            onClick={() => handleCategoryChange(catKey)}
                            className={`glass-button ${category === catKey ? 'active' : ''}`}
                            style={{ fontSize: '0.85rem' }}
                        >
                            {categories[catKey].name}
                        </button>
                    ))}
                </div>

                {/* Converter Inputs Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(11, 1fr)', gap: '16px', alignItems: 'center' }}>

                    {/* From Input */}
                    <div style={{ gridColumn: 'span 5' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                            From Value
                        </label>
                        <input
                            type="number"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="glass-input"
                            style={{ fontSize: '1.2rem', marginBottom: '12px' }}
                        />

                        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                            From Unit
                        </label>
                        <select
                            value={fromUnit}
                            onChange={(e) => setFromUnit(e.target.value)}
                            className="glass-input"
                            style={{ textTransform: 'capitalize' }}
                        >
                            {(categories[category].custom
                                ? categories[category].units
                                : Object.keys(categories[category].units)
                            ).map((u) => (
                                <option key={u} value={u} style={{ background: '#111827', color: '#ffffff' }}>
                                    {u.replace(/_/g, ' ')}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Swap Button */}
                    <div style={{ gridColumn: 'span 1', display: 'flex', justifyContent: 'center' }}>
                        <button
                            onClick={handleSwap}
                            className="glass-button"
                            style={{ padding: '12px', borderRadius: '50%' }}
                            title="Swap Units"
                        >
                            <ArrowRightLeft size={18} color="var(--accent-blue)" />
                        </button>
                    </div>

                    {/* To Output */}
                    <div style={{ gridColumn: 'span 5' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                            Converted Result
                        </label>
                        <div style={{
                            background: 'rgba(0, 0, 0, 0.4)',
                            border: '1px solid var(--border-highlight)',
                            borderRadius: 'var(--radius-md)',
                            padding: '10px 14px',
                            minHeight: '48px',
                            display: 'flex',
                            alignItems: 'center',
                            justify: 'space-between',
                            marginBottom: '12px'
                        }}>
                            <span className="mono" style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--accent-cyan)' }}>
                                {convertedValue}
                            </span>
                            <button
                                onClick={handleCopy}
                                className="glass-button"
                                style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                            >
                                {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                            </button>
                        </div>

                        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                            To Unit
                        </label>
                        <select
                            value={toUnit}
                            onChange={(e) => setToUnit(e.target.value)}
                            className="glass-input"
                            style={{ textTransform: 'capitalize' }}
                        >
                            {(categories[category].custom
                                ? categories[category].units
                                : Object.keys(categories[category].units)
                            ).map((u) => (
                                <option key={u} value={u} style={{ background: '#111827', color: '#ffffff' }}>
                                    {u.replace(/_/g, ' ')}
                                </option>
                            ))}
                        </select>
                    </div>

                </div>

            </div>
        </div>
    );
}

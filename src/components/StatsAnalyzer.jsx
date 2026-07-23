import React, { useState, useMemo } from 'react';
import * as math from 'mathjs';
import { BarChart3, Calculator, PieChart, Sparkles } from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function StatsAnalyzer() {
    const [inputText, setInputText] = useState('12, 15, 18, 22, 25, 25, 30, 32, 38, 42, 45, 50');

    // Parsed numbers array
    const parsedData = useMemo(() => {
        return inputText
            .split(/[\s,;\n]+/)
            .map(v => parseFloat(v))
            .filter(v => !isNaN(v));
    }, [inputText]);

    // Statistical calculations
    const stats = useMemo(() => {
        if (parsedData.length === 0) return null;
        const count = parsedData.length;
        const sorted = [...parsedData].sort((a, b) => a - b);
        const sum = math.sum(parsedData);
        const mean = math.mean(parsedData);
        const median = math.median(parsedData);
        const min = math.min(parsedData);
        const max = math.max(parsedData);
        const range = max - min;
        const stdDev = count > 1 ? math.std(parsedData) : 0;
        const variance = count > 1 ? math.variance(parsedData) : 0;

        // Mode calculation
        const freqMap = {};
        parsedData.forEach(num => freqMap[num] = (freqMap[num] || 0) + 1);
        let maxFreq = 0;
        let modes = [];
        Object.keys(freqMap).forEach(key => {
            const f = freqMap[key];
            if (f > maxFreq) {
                maxFreq = f;
                modes = [parseFloat(key)];
            } else if (f === maxFreq && maxFreq > 1) {
                modes.push(parseFloat(key));
            }
        });

        return {
            count,
            sum: Number(sum.toFixed(4)),
            mean: Number(mean.toFixed(4)),
            median: Number(median.toFixed(4)),
            min,
            max,
            range: Number(range.toFixed(4)),
            stdDev: Number(stdDev.toFixed(4)),
            variance: Number(variance.toFixed(4)),
            mode: maxFreq > 1 ? modes.join(', ') : 'No Mode',
            sorted
        };
    }, [parsedData]);

    // Chart data setup
    const chartData = useMemo(() => {
        if (!stats || stats.count === 0) return null;

        return {
            labels: stats.sorted.map((val, idx) => `#${idx + 1}`),
            datasets: [
                {
                    label: 'Data Point Values',
                    data: stats.sorted,
                    backgroundColor: 'rgba(6, 182, 212, 0.6)',
                    borderColor: '#06b6d4',
                    borderWidth: 2,
                    borderRadius: 6
                }
            ]
        };
    }, [stats]);

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                labels: { color: '#9ca3af', font: { family: 'Plus Jakarta Sans' } }
            },
            tooltip: {
                backgroundColor: 'rgba(17, 24, 39, 0.9)',
                titleFont: { family: 'JetBrains Mono' },
                bodyFont: { family: 'JetBrains Mono' }
            }
        },
        scales: {
            x: {
                ticks: { color: '#9ca3af', font: { family: 'JetBrains Mono' } },
                grid: { color: 'rgba(255, 255, 255, 0.05)' }
            },
            y: {
                ticks: { color: '#9ca3af', font: { family: 'JetBrains Mono' } },
                grid: { color: 'rgba(255, 255, 255, 0.05)' }
            }
        }
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '20px' }}>

            {/* Input Data Box */}
            <div style={{ gridColumn: 'span 5' }} className="glass-panel">
                <div style={{ padding: '24px' }}>

                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <BarChart3 size={20} color="var(--accent-cyan)" /> Statistical Dataset Input
                    </h3>

                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>
                        Enter numbers separated by space, comma, or new line:
                    </label>

                    <textarea
                        rows={8}
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="glass-input mono"
                        placeholder="e.g. 10, 20, 30, 40, 50"
                        style={{ resize: 'vertical', lineHeight: '1.5' }}
                    />

                    <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                        <button
                            onClick={() => setInputText('5, 10, 15, 20, 25, 30, 35, 40, 45, 50')}
                            className="glass-button"
                            style={{ fontSize: '0.75rem', flex: 1 }}
                        >
                            Linear Sample
                        </button>
                        <button
                            onClick={() => setInputText('100, 102, 98, 101, 99, 103, 97, 100, 102')}
                            className="glass-button"
                            style={{ fontSize: '0.75rem', flex: 1 }}
                        >
                            Normal Dist Sample
                        </button>
                    </div>

                </div>
            </div>

            {/* Analytics Summary & Chart */}
            <div style={{ gridColumn: 'span 7' }} className="glass-panel">
                <div style={{ padding: '24px' }}>

                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Sparkles size={20} color="var(--accent-purple)" /> Descriptive Metrics Summary
                    </h3>

                    {stats ? (
                        <>
                            {/* Metrics Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
                                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Count (N)</div>
                                    <div className="mono" style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--accent-blue)' }}>{stats.count}</div>
                                </div>

                                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Mean (Average)</div>
                                    <div className="mono" style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--accent-cyan)' }}>{stats.mean}</div>
                                </div>

                                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Median</div>
                                    <div className="mono" style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--accent-purple)' }}>{stats.median}</div>
                                </div>

                                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Std Deviation (σ)</div>
                                    <div className="mono" style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--accent-emerald)' }}>{stats.stdDev}</div>
                                </div>

                                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Variance (σ²)</div>
                                    <div className="mono" style={{ fontSize: '1.2rem', fontWeight: '700' }}>{stats.variance}</div>
                                </div>

                                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Min / Max</div>
                                    <div className="mono" style={{ fontSize: '1.1rem', fontWeight: '700' }}>{stats.min} / {stats.max}</div>
                                </div>

                                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Range</div>
                                    <div className="mono" style={{ fontSize: '1.2rem', fontWeight: '700' }}>{stats.range}</div>
                                </div>

                                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Sum (Σ)</div>
                                    <div className="mono" style={{ fontSize: '1.2rem', fontWeight: '700' }}>{stats.sum}</div>
                                </div>
                            </div>

                            {/* Chart Visualization */}
                            {chartData && (
                                <div style={{ height: '220px' }}>
                                    <Bar data={chartData} options={chartOptions} />
                                </div>
                            )}
                        </>
                    ) : (
                        <div style={{ color: 'var(--text-secondary)', padding: '40px', textAlign: 'center' }}>
                            Please enter valid numbers to view statistics.
                        </div>
                    )}

                </div>
            </div>

        </div>
    );
}

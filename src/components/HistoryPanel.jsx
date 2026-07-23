import React, { useState } from 'react';
import { History, Trash2, Download, Copy, Check, CornerUpLeft } from 'lucide-react';

export default function HistoryPanel({ history, onClearHistory, onInsertExpression }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [copiedId, setCopiedId] = useState(null);

    const filtered = history.filter(item =>
        item.expression.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.result.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCopy = (id, text) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleExportCSV = () => {
        if (history.length === 0) return;
        const header = 'Timestamp,Expression,Result\n';
        const rows = history.map(h => `"${h.timestamp}","${h.expression.replace(/"/g, '""')}","${h.result}"`).join('\n');
        const blob = new Blob([header + rows], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `omnicalc-history-${Date.now()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }} className="glass-panel">
            <div style={{ padding: '28px' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <History size={24} color="var(--accent-blue)" /> Calculation History Stack
                    </h3>

                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={handleExportCSV} className="glass-button" style={{ fontSize: '0.8rem' }}>
                            <Download size={16} /> Export CSV
                        </button>
                        <button onClick={onClearHistory} className="glass-button clear-btn" style={{ fontSize: '0.8rem' }}>
                            <Trash2 size={16} /> Clear History
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                <div style={{ marginBottom: '20px' }}>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="glass-input"
                        placeholder="Search history expressions or results..."
                    />
                </div>

                {/* History Items List */}
                {filtered.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '480px', overflowY: 'auto', paddingRight: '4px' }}>
                        {filtered.map((item, idx) => (
                            <div
                                key={idx}
                                className="glass-panel"
                                style={{
                                    padding: '16px',
                                    display: 'flex',
                                    justify: 'space-between',
                                    alignItems: 'center',
                                    background: 'rgba(0, 0, 0, 0.25)'
                                }}
                            >
                                <div>
                                    <div className="mono" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                                        {item.expression}
                                    </div>
                                    <div className="mono" style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--accent-cyan)' }}>
                                        = {item.result}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                                        {item.timestamp}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        onClick={() => onInsertExpression(item.expression)}
                                        className="glass-button"
                                        style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                                        title="Recall Expression to Calculator"
                                    >
                                        <CornerUpLeft size={14} /> Recall
                                    </button>

                                    <button
                                        onClick={() => handleCopy(idx, item.result)}
                                        className="glass-button"
                                        style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                                    >
                                        {copiedId === idx ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        No calculations recorded in history yet.
                    </div>
                )}

            </div>
        </div>
    );
}

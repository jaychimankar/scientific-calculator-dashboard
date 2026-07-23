import React, { useState, useEffect } from 'react';
import {
    Calculator,
    LineChart,
    Scale,
    Grid3X3,
    BarChart3,
    BookOpen,
    History,
    Cloud,
    Sun,
    Moon,
    Sparkles,
    Terminal,
    Shapes
} from 'lucide-react';

export default function Header({ activeTab, setActiveTab, theme, setTheme, onOpenGcpModal }) {
    const [time, setTime] = useState(new Date().toLocaleTimeString());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
        return () => clearInterval(timer);
    }, []);

    const navItems = [
        { id: 'calculator', label: 'Calculator', icon: Calculator },
        { id: 'grapher', label: '2D Grapher', icon: LineChart },
        { id: 'area', label: 'Area & Geometry', icon: Shapes },
        { id: 'converter', label: 'Unit Converter', icon: Scale },
        { id: 'matrix', label: 'Matrix', icon: Grid3X3 },
        { id: 'stats', label: 'Statistics', icon: BarChart3 },
        { id: 'formulas', label: 'Formulas', icon: BookOpen },
        { id: 'history', label: 'History', icon: History }
    ];

    return (
        <header className="glass-panel" style={{ padding: '12px 24px', marginBottom: '20px', borderRadius: 'var(--radius-xl)' }}>
            <div className="mobile-header-stack" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>

                {/* Logo & Brand */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
                        padding: '10px',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        boxShadow: 'var(--glow-purple)'
                    }}>
                        <Sparkles size={22} color="#ffffff" />
                    </div>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <h1 style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #ffffff, #93c5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                OmniCalc Studio
                            </h1>
                            <span className="badge-gcp">
                                <Cloud size={12} /> GCP Ready
                            </span>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            Scientific Calculator & Analytics Dashboard
                        </p>
                    </div>
                </div>

                {/* Center Tabs with Mobile Horizontal Scrolling */}
                <nav className="nav-tabs-scroll" style={{ display: 'flex', gap: '6px', overflowX: 'auto', padding: '4px', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)' }}>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`glass-button ${isActive ? 'active' : ''}`}
                                style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                            >
                                <Icon size={16} />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                {/* Right Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                        onClick={onOpenGcpModal}
                        className="glass-button"
                        style={{
                            background: 'rgba(66, 133, 244, 0.15)',
                            borderColor: 'rgba(66, 133, 244, 0.3)',
                            color: '#60a5fa'
                        }}
                    >
                        <Terminal size={16} />
                        <span>Deploy to GCP</span>
                    </button>

                    <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="glass-button"
                        style={{ padding: '8px', borderRadius: '50%' }}
                        title="Toggle Light/Dark Theme"
                    >
                        {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#60a5fa" />}
                    </button>

                    <div className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.25)', padding: '6px 12px', borderRadius: 'var(--radius-md)' }}>
                        {time}
                    </div>
                </div>

            </div>
        </header>
    );
}

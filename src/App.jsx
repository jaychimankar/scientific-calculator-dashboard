import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Calculator from './components/Calculator';
import Grapher from './components/Grapher';
import AreaVisualizer from './components/AreaVisualizer';
import UnitConverter from './components/UnitConverter';
import MatrixCalc from './components/MatrixCalc';
import StatsAnalyzer from './components/StatsAnalyzer';
import HistoryPanel from './components/HistoryPanel';
import FormulaReference from './components/FormulaReference';
import GcpGuideModal from './components/GcpGuideModal';
import { Sparkles, Calculator as CalcIcon, LineChart, History } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('calculator');
  const [theme, setTheme] = useState('dark');
  const [isGcpModalOpen, setIsGcpModalOpen] = useState(false);
  const [history, setHistory] = useState([
    { expression: 'sin(45 deg)^2 + cos(45 deg)^2', result: '1', timestamp: '12:00:00 PM', type: 'calc' },
    { expression: 'sqrt(144) + 5!', result: '132', timestamp: '12:05:30 PM', type: 'calc' }
  ]);
  const [externalInsert, setExternalInsert] = useState(null);

  // Apply theme attribute to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleAddHistory = (item) => {
    setHistory(prev => [item, ...prev]);
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleInsertExpression = (expr) => {
    setExternalInsert(expr);
    setActiveTab('calculator');
    setTimeout(() => setExternalInsert(null), 100);
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '16px', minHeight: '100vh' }}>

      {/* Header Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        setTheme={setTheme}
        onOpenGcpModal={() => setIsGcpModalOpen(true)}
      />

      {/* Quick Dashboard Stat Banner */}
      <div className="quick-stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>

        <div className="glass-panel" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.15)', padding: '10px', borderRadius: 'var(--radius-md)' }}>
            <CalcIcon size={22} color="var(--accent-blue)" />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Calculations Executed</div>
            <div className="mono" style={{ fontSize: '1.25rem', fontWeight: '700', color: '#ffffff' }}>
              {history.length} Saved
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ background: 'rgba(6, 182, 212, 0.15)', padding: '10px', borderRadius: 'var(--radius-md)' }}>
            <LineChart size={22} color="var(--accent-cyan)" />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>2D Plot Engine</div>
            <div className="mono" style={{ fontSize: '1.25rem', fontWeight: '700', color: '#ffffff' }}>
              Canvas Active
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ background: 'rgba(139, 92, 246, 0.15)', padding: '10px', borderRadius: 'var(--radius-md)' }}>
            <Sparkles size={22} color="var(--accent-purple)" />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Matrix & Linear Alg</div>
            <div className="mono" style={{ fontSize: '1.25rem', fontWeight: '700', color: '#ffffff' }}>
              2×2 & 3×3 Ready
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '10px', borderRadius: 'var(--radius-md)' }}>
            <History size={22} color="var(--accent-emerald)" />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Hosting Target</div>
            <div className="mono" style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--accent-emerald)' }}>
              Google Cloud SDK
            </div>
          </div>
        </div>

      </div>

      {/* Active Tab View */}
      <main className="animate-fade-in">
        {activeTab === 'calculator' && (
          <Calculator
            onAddHistory={handleAddHistory}
            externalInsert={externalInsert}
          />
        )}
        {activeTab === 'grapher' && <Grapher />}
        {activeTab === 'area' && <AreaVisualizer />}
        {activeTab === 'converter' && <UnitConverter />}
        {activeTab === 'matrix' && <MatrixCalc />}
        {activeTab === 'stats' && <StatsAnalyzer />}
        {activeTab === 'formulas' && (
          <FormulaReference onInsertFormula={handleInsertExpression} />
        )}
        {activeTab === 'history' && (
          <HistoryPanel
            history={history}
            onClearHistory={handleClearHistory}
            onInsertExpression={handleInsertExpression}
          />
        )}
      </main>

      {/* GCP Deployment Modal */}
      <GcpGuideModal
        isOpen={isGcpModalOpen}
        onClose={() => setIsGcpModalOpen(false)}
      />

    </div>
  );
}

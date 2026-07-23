import React, { useState } from 'react';
import { X, Cloud, Terminal, Copy, Check, Server, ShieldCheck, ExternalLink } from 'lucide-react';

export default function GcpGuideModal({ isOpen, onClose }) {
    const [copiedStep, setCopiedStep] = useState(null);

    if (!isOpen) return null;

    const handleCopyCode = (stepId, code) => {
        navigator.clipboard.writeText(code);
        setCopiedStep(stepId);
        setTimeout(() => setCopiedStep(null), 2000);
    };

    const steps = [
        {
            id: 'gcp-auth',
            title: '1. Authenticate Google Cloud SDK',
            desc: 'Open PowerShell or Terminal and log in to your Google Cloud account:',
            code: 'gcloud auth login\ngcloud config set project YOUR_PROJECT_ID'
        },
        {
            id: 'gcp-appengine',
            title: '2. Deploy to Google App Engine (Option A - Static Hosting)',
            desc: 'Build the production static bundle and deploy using app.yaml:',
            code: 'npm run build\ngcloud app deploy app.yaml --quiet'
        },
        {
            id: 'gcp-cloudrun',
            title: '3. Deploy to Google Cloud Run (Option B - Containerized)',
            desc: 'Build & deploy using the provided Dockerfile and Nginx container:',
            code: 'gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/omnicalc-dashboard\ngcloud run deploy omnicalc-dashboard --image gcr.io/YOUR_PROJECT_ID/omnicalc-dashboard --platform managed --allow-unauthenticated'
        }
    ];

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
        }}>
            <div className="glass-panel animate-fade-in" style={{
                maxWidth: '750px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                padding: '28px',
                position: 'relative',
                background: '#0d1322',
                border: '1px solid var(--accent-blue)',
                boxShadow: 'var(--glow-blue)'
            }}>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ padding: '8px', background: 'rgba(66, 133, 244, 0.2)', borderRadius: 'var(--radius-md)' }}>
                            <Cloud size={24} color="#60a5fa" />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#ffffff' }}>
                                Google Cloud Platform Hosting Guide
                            </h3>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                Deploy OmniCalc Studio using Google Cloud SDK (`gcloud`)
                            </p>
                        </div>
                    </div>

                    <button onClick={onClose} className="glass-button" style={{ padding: '8px', borderRadius: '50%' }}>
                        <X size={18} />
                    </button>
                </div>

                {/* Info Banner */}
                <div style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '24px',
                    fontSize: '0.85rem',
                    color: 'var(--text-primary)',
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'flex-start'
                }}>
                    <ShieldCheck size={20} color="var(--accent-blue)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                        Your workspace already includes pre-configured <span className="mono" style={{ color: 'var(--accent-cyan)' }}>app.yaml</span>, <span className="mono" style={{ color: 'var(--accent-cyan)' }}>Dockerfile</span>, <span className="mono" style={{ color: 'var(--accent-cyan)' }}>nginx.conf</span>, and <span className="mono" style={{ color: 'var(--accent-cyan)' }}>deploy-gcp.ps1</span> deployment scripts!
                    </div>
                </div>

                {/* Steps List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {steps.map(step => (
                        <div key={step.id} style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '6px', color: '#ffffff' }}>
                                {step.title}
                            </h4>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                                {step.desc}
                            </p>

                            <div style={{ position: 'relative' }}>
                                <pre className="mono" style={{
                                    background: '#090d16',
                                    padding: '12px 14px',
                                    borderRadius: 'var(--radius-sm)',
                                    fontSize: '0.82rem',
                                    color: 'var(--accent-cyan)',
                                    overflowX: 'auto',
                                    lineHeight: '1.5'
                                }}>
                                    {step.code}
                                </pre>

                                <button
                                    onClick={() => handleCopyCode(step.id, step.code)}
                                    className="glass-button"
                                    style={{ position: 'absolute', top: '8px', right: '8px', padding: '4px 8px', fontSize: '0.75rem' }}
                                >
                                    {copiedStep === step.id ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <button onClick={onClose} className="glass-button active">
                        Got it, ready to deploy!
                    </button>
                </div>

            </div>
        </div>
    );
}

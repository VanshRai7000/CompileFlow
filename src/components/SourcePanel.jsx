import { useState, useRef } from 'react';
import styles from './SourcePanel.module.css';

const DEFAULT_CODE = `int a = 10;
float b = a + 20;
double c = b;
`;

const PHASES = [
    { id: 'lexical', icon: 'L', label: '1. Lexical Analysis', color: '#a855f7' },
    { id: 'syntax', icon: 'S', label: '2. Syntax Analysis', color: '#d946ef' },
    { id: 'semantic', icon: 'M', label: '3. Semantic Analysis', color: '#ec4899' },
    { id: 'icg', icon: 'I', label: '4. Intermediate Code', color: '#f97316' },
    { id: 'optimization', icon: 'O', label: '5. Code Optimization', color: '#eab308' },
    { id: 'target', icon: 'T', label: '6. Code Generation', color: '#10b981' },
];

export default function SourcePanel({
    onCompile, activePhase, onPhaseChange, completedPhases,
    isCompiling, error, status
}) {
    const [code, setCode] = useState(DEFAULT_CODE);
    const taRef = useRef(null);

    function handleReset() {
        setCode(DEFAULT_CODE);
    }

    function handleCompile() {
        onCompile(code);
    }

    const statusDot = {
        idle: { bg: '#475569', shadow: 'none' },
        running: { bg: '#facc15', shadow: '0 0 8px rgba(250,204,21,.8)' },
        success: { bg: '#10b981', shadow: '0 0 8px rgba(16,185,129,.8)' },
        error: { bg: '#ef4444', shadow: '0 0 8px rgba(239,68,68,.8)' },
    }[status] || { bg: '#475569', shadow: 'none' };

    return (
        <aside className={styles.panel}>
            {/* Code Editor Card */}
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <h2 className={styles.cardTitle}>
                        <CodeIcon /> Source Code
                    </h2>
                    <button className={styles.resetBtn} onClick={handleReset} title="Reset to default">
                        ↺ Reset
                    </button>
                </div>

                <textarea
                    ref={taRef}
                    className={`${styles.editor} code-font`}
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    spellCheck={false}
                    placeholder="Enter your source code here…"
                    id="sourceCode"
                />

                {error && (
                    <div className={styles.errorBanner}>
                        <span className={styles.errorIcon}>⚠</span>
                        <span>{error}</span>
                    </div>
                )}

                <button
                    className={styles.compileBtn}
                    onClick={handleCompile}
                    disabled={isCompiling}
                    id="compileBtn"
                >
                    {isCompiling
                        ? <><span className={`${styles.spinnerIcon} spin`}>⚙</span> Processing Pipeline…</>
                        : status === 'success'
                            ? <><span>✓</span> Compilation Success</>
                            : <><span>▶</span> Compile &amp; Analyze</>
                    }
                </button>
            </div>

            {/* Pipeline Nav */}
            <div className={styles.pipelineCard}>
                <div className={styles.pipelineHeader}>
                    <span className={styles.pipelineTitle}>Pipeline Stages</span>
                    <span
                        className={styles.statusDot}
                        style={{ backgroundColor: statusDot.bg, boxShadow: statusDot.shadow }}
                    />
                </div>
                <nav className={styles.pipelineNav}>
                    {PHASES.map(phase => {
                        const done = completedPhases.includes(phase.id);
                        const active = activePhase === phase.id;
                        return (
                            <button
                                key={phase.id}
                                id={`btn-${phase.id}`}
                                className={`${styles.phaseBtn} ${active ? styles.phaseBtnActive : ''}`}
                                onClick={() => onPhaseChange(phase.id)}
                                style={active ? { borderColor: phase.color } : {}}
                            >
                                <span className={styles.phaseLabel}>
                                    <span
                                        className={styles.phaseIconWrap}
                                        style={{ color: phase.color }}
                                    >
                                        {PhaseIcon(phase.id)}
                                    </span>
                                    {phase.label}
                                </span>
                                {done && (
                                    <span className={styles.checkIcon} style={{ color: phase.color }}>✓</span>
                                )}
                            </button>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
}

function CodeIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
        </svg>
    );
}

function PhaseIcon(id) {
    const icons = {
        lexical: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>,
        syntax: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M17 22v-2H9V8H7V6H3v12h4v2zm4-6V4h-4V2h-4v4h4v2h-4v8z" /></svg>,
        semantic: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" /><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" /></svg>,
        icg: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>,
        optimization: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>,
        target: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><path d="M15 2v2M9 2v2M15 20v2M9 20v2M2 15h2M2 9h2M20 15h2M20 9h2" /></svg>,
    };
    return icons[id] || null;
}

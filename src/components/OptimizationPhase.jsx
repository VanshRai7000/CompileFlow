import styles from './phases.module.css';

export default function OptimizationPhase({ beforeTac, opt }) {
    return (
        <div className={styles.phaseWrap}>
            <div className={styles.phaseCard}>
                <div className={styles.phaseHead}>
                    <div>
                        <h3 className={styles.phaseTitle} style={{ color: '#eab308' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                            Code Optimization
                        </h3>
                        <p className={styles.phaseDesc}>Transforming ICG to reduce execution time and resources.</p>
                    </div>
                    <div className={styles.badgeRow}>
                        <span className={styles.tagBadge} style={{ background: 'rgba(234,179,8,.1)', color: '#fbbf24', borderColor: 'rgba(234,179,8,.2)' }}>Constant Folding</span>
                        <span className={styles.tagBadge} style={{ background: 'rgba(239,68,68,.1)', color: '#f87171', borderColor: 'rgba(239,68,68,.2)' }}>Dead Code Elim</span>
                    </div>
                </div>

                <div className={styles.twoCol}>
                    <div className={styles.subCard}>
                        <div className={styles.subCardHead} style={{ color: '#f87171' }}>Before (Unoptimized TAC)</div>
                        <div className={`${styles.codeBlock} code-font`} style={{ color: 'rgba(248,113,113,.8)' }}>
                            {beforeTac.map((l, i) => (
                                <div key={i} className={styles.codeLine}>{l}</div>
                            ))}
                        </div>
                    </div>
                    <div className={styles.subCard}>
                        <div className={styles.subCardHead} style={{ color: '#34d399' }}>After (Optimized TAC)</div>
                        <div className={`${styles.codeBlock} code-font`} style={{ color: '#34d399' }}>
                            {opt.tac.map((l, i) => (
                                <div key={i} className={styles.codeLine}>{l}</div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={styles.optLog}>
                    <div className={styles.optLogTitle}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                        Optimization Log
                    </div>
                    <ul className={styles.optLogList}>
                        {opt.strategies.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                </div>
            </div>
        </div>
    );
}

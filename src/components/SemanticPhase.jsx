import styles from './phases.module.css';

export default function SemanticPhase({ semantics }) {
    const { flatSymbolTable, logs } = semantics;

    return (
        <div className={styles.phaseWrap}>
            <div className={styles.phaseCard}>
                <div className={styles.phaseHead}>
                    <div>
                        <h3 className={styles.phaseTitle} style={{ color: '#ec4899' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" /><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" /></svg>
                            Semantic Analysis
                        </h3>
                        <p className={styles.phaseDesc}>Scope stack management and symbol table generation.</p>
                    </div>
                </div>

                <div className={styles.twoCol}>
                    {/* Symbol Table */}
                    <div className={styles.subCard}>
                        <div className={styles.subCardHead}>Symbol Table</div>
                        <div className={styles.tableWrap}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Name</th><th>Type</th><th>Scope</th><th>Mem</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {flatSymbolTable.length === 0 ? (
                                        <tr><td colSpan={4} className={styles.emptyCell}>No variables declared</td></tr>
                                    ) : flatSymbolTable.map((s, i) => (
                                        <tr key={i} className={styles.tableRow}>
                                            <td className={styles.nameCell}>{s.name}</td>
                                            <td className={styles.typeCell}>{s.type}</td>
                                            <td>
                                                <span className={styles.scopeBadge}>
                                                    {s.scopeLevel === 0 ? 'Global' : `Local L${s.scopeLevel}`}
                                                </span>
                                            </td>
                                            <td className={`${styles.memCell} code-font`}>{s.mem}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Semantic Logs */}
                    <div className={styles.subCard}>
                        <div className={styles.subCardHead}>Semantic Actions / Errors</div>
                        <div className={styles.logsList}>
                            {logs.map((log, i) => (
                                <div key={i} className={`${styles.logEntry} fade-in`} style={{ animationDelay: `${i * 40}ms` }}>
                                    <span className={log.toLowerCase().includes('error') ? styles.logIconError : styles.logIconOk}>
                                        {log.toLowerCase().includes('error') ? '✕' : '✓'}
                                    </span>
                                    <span>{log}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

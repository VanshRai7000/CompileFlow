import styles from './phases.module.css';

export default function ICGPhase({ icg }) {
    const { tac, quads } = icg;

    return (
        <div className={styles.phaseWrap}>
            <div className={styles.phaseCard}>
                <div className={styles.phaseHead}>
                    <div>
                        <h3 className={styles.phaseTitle} style={{ color: '#f97316' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
                            Intermediate Code Generation
                        </h3>
                        <p className={styles.phaseDesc}>Three-Address Code (TAC) and Quadruple representation.</p>
                    </div>
                </div>

                <div className={styles.twoCol}>
                    {/* TAC */}
                    <div className={styles.subCard}>
                        <div className={styles.subCardHead}>Three-Address Code</div>
                        <div className={`${styles.codeBlock} code-font`} style={{ color: '#34d399' }}>
                            {tac.map((line, i) => (
                                <div key={i} className={`${styles.codeLine} fade-in`} style={{ animationDelay: `${i * 18}ms` }}>
                                    <span className={styles.lineNum}>{String(i + 1).padStart(2, '0')}</span>
                                    {line}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quadruples */}
                    <div className={styles.subCard}>
                        <div className={styles.subCardHead}>Quadruples (Op, Arg1, Arg2, Res)</div>
                        <div className={styles.tableWrap}>
                            <table className={`${styles.table} ${styles.centerTable}`}>
                                <thead><tr><th>#</th><th>OP</th><th>ARG1</th><th>ARG2</th><th>RES</th></tr></thead>
                                <tbody>
                                    {quads.map((q, i) => (
                                        <tr key={i} className={`${styles.tableRow} fade-in`} style={{ animationDelay: `${i * 18}ms` }}>
                                            <td className={styles.indexCell}>{i}</td>
                                            <td className={styles.opCell}>{q.op}</td>
                                            <td className={`code-font ${styles.dimCell}`}>{q.arg1}</td>
                                            <td className={`code-font ${styles.dimCell}`}>{q.arg2}</td>
                                            <td className={styles.resCell}>{q.res}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

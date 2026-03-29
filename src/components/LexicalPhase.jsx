import styles from './phases.module.css';

const TYPE_COLORS = {
    KEYWORD: 'badge-KEYWORD',
    IDENTIFIER: 'badge-IDENTIFIER',
    OPERATOR: 'badge-OPERATOR',
    PUNCTUATION: 'badge-PUNCTUATION',
    INT_CONST: 'badge-INT_CONST',
    FLOAT_CONST: 'badge-FLOAT_CONST',
    STRING: 'badge-STRING',
};

export default function LexicalPhase({ tokens }) {
    return (
        <div className={styles.phaseWrap}>
            <div className={styles.phaseCard}>
                <div className={styles.phaseHead}>
                    <div>
                        <h3 className={styles.phaseTitle} style={{ color: '#a855f7' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
                            Lexical Analysis
                        </h3>
                        <p className={styles.phaseDesc}>DFA-based tokenization — ignoring whitespace and comments.</p>
                    </div>
                    <div className={styles.statChip}>{tokens.length} tokens</div>
                </div>

                <div className={styles.tableWrap}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Lexeme</th>
                                <th>Type</th>
                                <th>Line:Col</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tokens.map((t, i) => (
                                <tr key={i} className={`${styles.tableRow} fade-in`} style={{ animationDelay: `${Math.min(i * 8, 400)}ms` }}>
                                    <td className={styles.indexCell}>{i + 1}</td>
                                    <td className={`${styles.lexemeCell} code-font`}>{t.lexeme}</td>
                                    <td><span className={`${styles.typeBadge} ${TYPE_COLORS[t.type] || ''}`}>{t.type}</span></td>
                                    <td className={styles.posCell}>{t.line}:{t.col}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

import styles from './phases.module.css';

const REGISTERS = ['A (Acc)', 'B', 'C', 'H', 'L'];
const INSTRUCTIONS = ['LDA addr', 'STA addr', 'MOV r1, r2', 'MVI r, data', 'ADD r', 'SUB r', 'CMP r', 'JMP/JZ label', 'OUT port'];

export default function TargetPhase({ asm }) {
    return (
        <div className={styles.phaseWrap}>
            <div className={styles.phaseCard}>
                <div className={styles.phaseHead}>
                    <div>
                        <h3 className={styles.phaseTitle} style={{ color: '#10b981' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><path d="M15 2v2M9 2v2M15 20v2M9 20v2M2 15h2M2 9h2M20 15h2M20 9h2" /></svg>
                            Target Code Generation
                        </h3>
                        <p className={styles.phaseDesc}>Mapping optimized TAC to Intel 8085 microprocessor instruction set.</p>
                    </div>
                </div>

                <div className={styles.asmLayout}>
                    {/* Assembly listing */}
                    <div className={`${styles.asmBlock} code-font`}>
                        <div className={styles.asmHeader}>
                            <span className={styles.asmCol16}>ADDR</span>
                            <span className={styles.asmCol16}>OPCODE</span>
                            <span>OPERAND</span>
                        </div>
                        <div id="asmOutput">
                            {asm.map((inst, i) =>
                                inst.isLabel ? (
                                    <div key={i} className={styles.asmLabel}>{inst.label}:</div>
                                ) : (
                                    <div key={i} className={`${styles.asmRow} fade-in`} style={{ animationDelay: `${Math.min(i * 12, 500)}ms` }}>
                                        <span className={styles.asmAddr}>{inst.addr}</span>
                                        <span className={styles.asmOp}>{inst.inst}</span>
                                        <span className={styles.asmOperand}>
                                            {inst.ops}
                                            {inst.comment && <span className={styles.asmComment}>; {inst.comment}</span>}
                                        </span>
                                    </div>
                                )
                            )}
                        </div>
                    </div>

                    {/* Info panel */}
                    <div className={styles.asmInfo}>
                        <div className={styles.infoCard}>
                            <div className={styles.infoLabel}>Architecture</div>
                            <div className={styles.infoValue} style={{ color: '#10b981' }}>Intel 8085</div>
                        </div>
                        <div className={styles.infoCard}>
                            <div className={styles.infoLabel}>Registers</div>
                            <div className={styles.regList}>
                                {REGISTERS.map(r => (
                                    <span key={r} className={styles.regBadge}>{r}</span>
                                ))}
                            </div>
                        </div>
                        <div className={`${styles.infoCard} ${styles.infoCardFlex}`}>
                            <div className={styles.infoLabel}>Instruction Set</div>
                            <ul className={`${styles.instrList} code-font`}>
                                {INSTRUCTIONS.map(ins => <li key={ins}>{ins}</li>)}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

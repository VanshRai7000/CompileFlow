import styles from './Header.module.css';

export default function Header() { 
    return (
        <header className={styles.header}>
            <div className={styles.inner}>
                <div className={styles.brand}>
                    <div className={styles.logo}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
                            <path d="m6 8 3 3-3 3M13 14h4" />
                        </svg>
                    </div>
                    <h1 className={styles.title}>Compiler<span className={styles.accent}>Pro</span></h1>
                </div>
                <span className={styles.badge}>Full Pipeline Edition</span>
            </div>
        </header>
    );
}

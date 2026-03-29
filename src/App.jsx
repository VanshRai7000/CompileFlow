import { useState, useCallback } from 'react';
import Header from './components/Header';
import SourcePanel from './components/SourcePanel';
import WelcomeScreen from './components/WelcomeScreen';
import LexicalPhase from './components/LexicalPhase';
import SyntaxPhase from './components/SyntaxPhase';
import SemanticPhase from './components/SemanticPhase';
import ICGPhase from './components/ICGPhase';
import OptimizationPhase from './components/OptimizationPhase';
import TargetPhase from './components/TargetPhase';
import { compileAll, CompilerError } from './compiler/engine';
import styles from './App.module.css';

const PHASE_ORDER = ['lexical', 'syntax', 'semantic', 'icg', 'optimization', 'target'];

export default function App() {
  const [result, setResult] = useState(null);
  const [activePhase, setActivePhase] = useState('lexical');
  const [completed, setCompleted] = useState([]);
  const [isCompiling, setIsCompiling] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('idle'); // idle | running | success | error

  const handleCompile = useCallback(async (code) => {
    if (!code.trim()) return;
    setError('');
    setIsCompiling(true);
    setStatus('running');
    setCompleted([]);

    // Use a micro-delay so the UI can update before the (synchronous) heavy lifting
    await new Promise(r => setTimeout(r, 10));

    try {
      const data = compileAll(code);
      setResult(data);

      // Animate phase check marks one by one
      for (let i = 0; i < PHASE_ORDER.length; i++) {
        await new Promise(r => setTimeout(r, 150));
        setCompleted(prev => [...prev, PHASE_ORDER[i]]);
        if (i === 0) setActivePhase('lexical');
      }
      setStatus('success');

      // Reset button label after 2 s
      setTimeout(() => setStatus('idle'), 2000);
    } catch (err) {
      console.error(err);
      if (err instanceof CompilerError) {
        setError(`[Line ${err.line}, Col ${err.col}]: ${err.message}`);
      } else {
        setError('Unknown internal compiler error.');
      }
      setStatus('error');
    } finally {
      setIsCompiling(false);
    }
  }, []);

  function renderPhase() {
    if (!result) return <WelcomeScreen />;
    switch (activePhase) {
      case 'lexical': return <LexicalPhase tokens={result.tokens} />;
      case 'syntax': return <SyntaxPhase ast={result.ast} />;
      case 'semantic': return <SemanticPhase semantics={result.semantics} />;
      case 'icg': return <ICGPhase icg={result.icg} />;
      case 'optimization': return <OptimizationPhase beforeTac={result.icg.tac} opt={result.opt} />;
      case 'target': return <TargetPhase asm={result.asm} />;
      default: return <WelcomeScreen />;
    }
  }

  return (
    <>
      <Header />
      <main className={styles.main}>
        {/* Left: source + controls */}
        <div className={styles.leftCol}>
          <SourcePanel
            onCompile={handleCompile}
            activePhase={activePhase}
            onPhaseChange={setActivePhase}
            completedPhases={completed}
            isCompiling={isCompiling}
            error={error}
            status={status}
          />
        </div>

        {/* Right: phase output */}
        <div className={styles.rightCol}>
          {renderPhase()}
        </div>
      </main>
    </>
  );
}

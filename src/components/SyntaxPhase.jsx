import { useEffect, useRef } from 'react';
import styles from './phases.module.css';

export default function SyntaxPhase({ ast }) {
    const svgRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        if (!ast || !containerRef.current) return;
        renderTree(ast, containerRef.current);
    }, [ast]);

    return (
        <div className={styles.phaseWrap}>
            <div className={styles.phaseCard}>
                <div className={styles.phaseHead}>
                    <div>
                        <h3 className={styles.phaseTitle} style={{ color: '#d946ef' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                            Syntax Analysis
                        </h3>
                        <p className={styles.phaseDesc}>Abstract Syntax Tree (AST) — Recursive Descent / LL(1) Parser.</p>
                    </div>
                    <div className={styles.badgeRow}>
                        <span className={styles.tagBadge} style={{ background: 'rgba(16,185,129,.1)', color: '#34d399', borderColor: 'rgba(16,185,129,.2)' }}>Recursive Descent</span>
                        <span className={styles.tagBadge} style={{ background: 'rgba(59,130,246,.1)', color: '#60a5fa', borderColor: 'rgba(59,130,246,.2)' }}>LL(1)</span>
                    </div>
                </div>
                <div ref={containerRef} className={styles.astContainer} id="treeContainer" />
            </div>
        </div>
    );
}

function renderTree(ast, container) {
    const xSpacing = 80;
    const ySpacing = 70;
    let leafX = 50;
    let maxDepth = 0;

    function assignCoords(node, depth) {
        if (depth > maxDepth) maxDepth = depth;
        node.y = depth * ySpacing + 40;
        if (!node.children || node.children.length === 0) {
            node.x = leafX;
            leafX += xSpacing;
        } else {
            let minX = Infinity, maxX = -Infinity;
            node.children.forEach(child => {
                assignCoords(child, depth + 1);
                minX = Math.min(minX, child.x);
                maxX = Math.max(maxX, child.x);
            });
            node.x = node.children.length === 1 ? node.children[0].x : (minX + maxX) / 2;
        }
    }

    assignCoords(ast, 0);

    const cw = container.clientWidth || 700;
    const treeWidth = leafX;
    const xOffset = treeWidth < cw ? (cw - treeWidth) / 2 : 20;
    const svgW = Math.max(cw, treeWidth + 40);
    const svgH = maxDepth * ySpacing + 100;

    let edges = '', nodes = '';

    function draw(node) {
        const nx = node.x + xOffset;
        const ny = node.y;
        if (node.children) {
            node.children.forEach(child => {
                const cx = child.x + xOffset;
                const cy = child.y;
                edges += `<line x1="${nx}" y1="${ny}" x2="${cx}" y2="${cy}" stroke="#94a3b8" stroke-width="1.5" stroke-opacity="0.6"/>`;
                draw(child);
            });
        }
        let label = node.name === 'Assign' ? '=' : (node.name || '');
        label = label.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const w = Math.max(44, label.length * 8.5 + 20);
        const h = 34;
        const r = h / 2;
        nodes += `
      <g transform="translate(${nx},${ny})" style="cursor:pointer">
        <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="${r}"
              fill="#eef2ff" stroke="#c7d2fe" stroke-width="1"
              style="filter:drop-shadow(0 2px 4px rgba(0,0,0,.15))"/>
        <text text-anchor="middle" dominant-baseline="central"
              fill="#1e1b4b" font-size="12.5" font-family="Inter,sans-serif" font-weight="600">
          ${label}
        </text>
      </g>`;
    }

    draw(ast);

    container.innerHTML = `
    <div style="width:100%;height:100%;overflow:auto;position:absolute;inset:0">
      <svg width="${svgW}" height="${svgH}" style="min-width:100%;min-height:100%">
        <g id="edges">${edges}</g>
        <g id="nodes">${nodes}</g>
      </svg>
    </div>`;
}

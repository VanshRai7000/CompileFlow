// ==========================================
// COMPILER CORE ENGINE
// Ported from CompilerPro HTML project
// ==========================================

export class CompilerError extends Error {
    constructor(message, line, col) {
        super(message);
        this.line = line;
        this.col = col;
    }
}

// --- 1. Lexical Analyzer (DFA-based approach) ---
export function lexer(code) {
    const tokens = [];
    let i = 0, line = 1, col = 1;

    const keywords = [
        'int', 'float', 'double', 'char', 'string', 'boolean', 'long',
        'short', 'const', 'void', 'if', 'else', 'while', 'print', 'printf'
    ];
    const multiCharOps = ['==', '!=', '<=', '>=', '&&', '||'];
    const singleCharOps = ['+', '-', '*', '/', '=', '<', '>', '!'];
    const punctuation = ['(', ')', '{', '}', ';', ','];

    while (i < code.length) {
        let char = code[i];

        if (char === '\n') { line++; col = 1; i++; continue; }
        if (/\s/.test(char)) { col++; i++; continue; }

        // Line comments
        if (char === '/' && code[i + 1] === '/') {
            while (i < code.length && code[i] !== '\n') { i++; col++; }
            continue;
        }
        // Block comments
        if (char === '/' && code[i + 1] === '*') {
            i += 2; col += 2;
            while (i < code.length && !(code[i] === '*' && code[i + 1] === '/')) {
                if (code[i] === '\n') { line++; col = 1; } else { col++; }
                i++;
            }
            i += 2; col += 2;
            continue;
        }

        // String Literals
        if (char === '"') {
            let startCol = col;
            let str = '"';
            i++; col++;
            while (i < code.length && code[i] !== '"') {
                str += code[i];
                if (code[i] === '\n') { line++; col = 1; } else { col++; }
                i++;
            }
            if (i >= code.length) throw new CompilerError('Unterminated string literal', line, startCol);
            str += '"'; i++; col++;
            tokens.push({ type: 'STRING', lexeme: str, line, col: startCol });
            continue;
        }

        // Numbers
        if (/\d/.test(char)) {
            let startCol = col;
            let num = '';
            let hasDot = false;
            while (i < code.length && /[\d.]/.test(code[i])) {
                if (code[i] === '.') {
                    if (hasDot) throw new CompilerError('Invalid number format', line, col);
                    hasDot = true;
                }
                num += code[i]; i++; col++;
            }
            tokens.push({ type: hasDot ? 'FLOAT_CONST' : 'INT_CONST', lexeme: num, line, col: startCol });
            continue;
        }

        // Identifiers & Keywords
        if (/[a-zA-Z_]/.test(char)) {
            let startCol = col;
            let word = '';
            while (i < code.length && /[a-zA-Z0-9_]/.test(code[i])) {
                word += code[i]; i++; col++;
            }
            tokens.push({
                type: keywords.includes(word) ? 'KEYWORD' : 'IDENTIFIER',
                lexeme: word, line, col: startCol
            });
            continue;
        }

        // Multi-char Operators
        let isOp = false;
        for (let op of multiCharOps) {
            if (code.substr(i, 2) === op) {
                tokens.push({ type: 'OPERATOR', lexeme: op, line, col });
                i += 2; col += 2; isOp = true; break;
            }
        }
        if (isOp) continue;

        if (singleCharOps.includes(char)) {
            tokens.push({ type: 'OPERATOR', lexeme: char, line, col });
            i++; col++; continue;
        }

        if (punctuation.includes(char)) {
            tokens.push({ type: 'PUNCTUATION', lexeme: char, line, col });
            i++; col++; continue;
        }

        throw new CompilerError(`Unrecognized character: ${char}`, line, col);
    }
    return tokens;
}

// --- 2. Syntax Analyzer (Recursive Descent Parser) ---
export class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.pos = 0;
    }

    peek() { return this.tokens[this.pos] || null; }
    advance() { return this.tokens[this.pos++]; }

    matchLex(lex) {
        const t = this.peek();
        if (t && t.lexeme === lex) return this.advance();
        return null;
    }
    matchType(type) {
        const t = this.peek();
        if (t && t.type === type) return this.advance();
        return null;
    }
    expectLex(lex) {
        const t = this.matchLex(lex);
        if (!t) throw new CompilerError(`Expected '${lex}'`, this.peek()?.line || 'EOF', this.peek()?.col || 'EOF');
        return t;
    }

    parse() {
        let root = { name: 'Program', children: [] };
        while (this.pos < this.tokens.length) {
            root.children.push(this.parseStatement());
        }
        return root;
    }

    parseStatement() {
        const t = this.peek();
        if (!t) throw new CompilerError('Unexpected EOF', 'EOF', 'EOF');

        if (t.lexeme === '{') return this.parseBlock();
        if (['int', 'float', 'double', 'char', 'string', 'boolean', 'long', 'short', 'const'].includes(t.lexeme))
            return this.parseVarDecl();
        if (t.lexeme === 'if') return this.parseIf();
        if (t.lexeme === 'while') return this.parseWhile();
        if (t.lexeme === 'print' || t.lexeme === 'printf') return this.parsePrint();
        if (t.type === 'IDENTIFIER') return this.parseAssignment();

        throw new CompilerError(`Unexpected token '${t.lexeme}'`, t.line, t.col);
    }

    parseBlock() {
        this.expectLex('{');
        let node = { name: 'Block', children: [] };
        while (this.peek() && this.peek().lexeme !== '}') {
            node.children.push(this.parseStatement());
        }
        this.expectLex('}');
        return node;
    }

    parseVarDecl() {
        let typeParts = [];
        let t = this.peek();
        while (t && ['int', 'float', 'double', 'char', 'string', 'boolean', 'long', 'short', 'const'].includes(t.lexeme)) {
            typeParts.push(this.advance().lexeme);
            t = this.peek();
        }
        let type = typeParts.join(' ');
        if (typeParts.length === 0) throw new CompilerError('Expected type declaration', this.peek()?.line, this.peek()?.col);

        let id = this.matchType('IDENTIFIER');
        if (!id) throw new CompilerError('Expected identifier', this.peek()?.line, this.peek()?.col);

        let node = {
            name: 'VarDecl', typeInfo: type, id: id.lexeme,
            children: [{ name: type, isLeaf: true }, { name: id.lexeme, isLeaf: true }]
        };

        if (this.matchLex('=')) {
            let expr = this.parseExpression();
            node.children.push(expr);
            node.expr = expr;
        }
        this.expectLex(';');
        return node;
    }

    parseAssignment() {
        let id = this.advance().lexeme;
        this.expectLex('=');
        let expr = this.parseExpression();
        this.expectLex(';');
        return { name: 'Assign', id, expr, children: [{ name: id, isLeaf: true }, expr] };
    }

    parseIf() {
        this.expectLex('if');
        this.expectLex('(');
        let cond = this.parseExpression();
        this.expectLex(')');
        let body = this.parseStatement();
        let node = { name: 'If', cond, body, children: [cond, body] };
        if (this.matchLex('else')) {
            let elseBody = this.parseStatement();
            node.elseBody = elseBody;
            node.children.push(elseBody);
        }
        return node;
    }

    parseWhile() {
        this.expectLex('while');
        this.expectLex('(');
        let cond = this.parseExpression();
        this.expectLex(')');
        let body = this.parseStatement();
        return { name: 'While', cond, body, children: [cond, body] };
    }

    parsePrint() {
        let cmd = this.advance().lexeme;
        this.expectLex('(');
        let args = [];
        if (this.peek() && this.peek().lexeme !== ')') {
            args.push(this.parseExpression());
            while (this.matchLex(',')) args.push(this.parseExpression());
        }
        this.expectLex(')');
        this.expectLex(';');
        return { name: 'Print', children: args };
    }

    parseExpression() { return this.parseLogical(); }

    parseLogical() {
        let node = this.parseRelational();
        while (this.peek() && (this.peek().lexeme === '&&' || this.peek().lexeme === '||')) {
            let op = this.advance().lexeme;
            let right = this.parseRelational();
            node = { name: op, op, left: node, right, children: [node, right] };
        }
        return node;
    }

    parseRelational() {
        let node = this.parseAdditive();
        const relOps = ['<', '>', '<=', '>=', '==', '!='];
        while (this.peek() && relOps.includes(this.peek().lexeme)) {
            let op = this.advance().lexeme;
            let right = this.parseAdditive();
            node = { name: op, op, left: node, right, children: [node, right] };
        }
        return node;
    }

    parseAdditive() {
        let node = this.parseTerm();
        while (this.peek() && (this.peek().lexeme === '+' || this.peek().lexeme === '-')) {
            let op = this.advance().lexeme;
            let right = this.parseTerm();
            node = { name: op, op, left: node, right, children: [node, right] };
        }
        return node;
    }

    parseTerm() {
        let node = this.parseFactor();
        while (this.peek() && (this.peek().lexeme === '*' || this.peek().lexeme === '/')) {
            let op = this.advance().lexeme;
            let right = this.parseFactor();
            node = { name: op, op, left: node, right, children: [node, right] };
        }
        return node;
    }

    parseFactor() {
        if (this.matchLex('(')) {
            let node = this.parseExpression();
            this.expectLex(')');
            return node;
        }
        let t = this.peek();
        if (!t) throw new CompilerError('Unexpected EOF in expression', 'EOF', 'EOF');
        if (['INT_CONST', 'FLOAT_CONST', 'STRING', 'IDENTIFIER'].includes(t.type)) {
            this.advance();
            return { name: t.lexeme, typeClass: t.type, isLeaf: true };
        }
        throw new CompilerError(`Invalid expression factor '${t.lexeme}'`, t.line, t.col);
    }
}

// --- 3. Semantic Analyzer ---
export function analyzeSemantics(ast) {
    let symbolMapStack = [new Map()];
    let flatSymbolTable = [];
    let logs = [];
    let memOffset = 0;
    let currentScopeLevel = 0;

    function enterScope() {
        currentScopeLevel++;
        symbolMapStack.push(new Map());
        logs.push(`Entered new scope level ${currentScopeLevel}`);
    }
    function exitScope() {
        symbolMapStack.pop();
        logs.push(`Exited scope level ${currentScopeLevel}`);
        currentScopeLevel--;
    }
    function lookup(name) {
        for (let i = symbolMapStack.length - 1; i >= 0; i--) {
            if (symbolMapStack[i].has(name)) return symbolMapStack[i].get(name);
        }
        return null;
    }

    function traverse(node) {
        if (!node) return;
        if (node.name === 'Block') {
            enterScope();
            node.children.forEach(traverse);
            exitScope();
        } else if (node.name === 'VarDecl') {
            let scopeMap = symbolMapStack[symbolMapStack.length - 1];
            if (scopeMap.has(node.id))
                throw new CompilerError(`Duplicate declaration of '${node.id}' in current scope`, 'Semantics', '-');

            let memSize = 4;
            if (node.typeInfo.includes('double') || node.typeInfo.includes('long')) memSize = 8;
            else if (node.typeInfo.includes('char') || node.typeInfo.includes('boolean')) memSize = 1;

            let sym = {
                name: node.id, type: node.typeInfo,
                scopeLevel: currentScopeLevel,
                mem: `0x${memOffset.toString(16).padStart(4, '0')}`
            };
            scopeMap.set(node.id, sym);
            flatSymbolTable.push(sym);
            memOffset += memSize;
            logs.push(`Declared variable [${node.id}] of type ${node.typeInfo} (${memSize} bytes)`);
            if (node.expr) traverse(node.expr);
        } else if (node.name === 'Assign') {
            if (!lookup(node.id))
                throw new CompilerError(`Undeclared variable '${node.id}'`, 'Semantics', '-');
            logs.push(`Assignment to [${node.id}] validated`);
            traverse(node.expr);
        } else if (node.name === 'Print') {
            node.children.forEach(traverse);
        } else if (node.isLeaf && node.typeClass === 'IDENTIFIER') {
            if (!lookup(node.name))
                throw new CompilerError(`Use of undeclared variable '${node.name}'`, 'Semantics', '-');
        } else {
            if (node.cond) traverse(node.cond);
            if (node.body) traverse(node.body);
            if (node.elseBody) traverse(node.elseBody);
            if (node.expr) traverse(node.expr);
            if (node.left) traverse(node.left);
            if (node.right) traverse(node.right);
            if (node.children && !node.left && !node.cond && node.name === 'Program')
                node.children.forEach(traverse);
        }
    }

    traverse(ast);
    return { flatSymbolTable, logs };
}

// --- 4. Intermediate Code Generator (TAC & Quadruples) ---
export function generateICG(ast) {
    let quads = [];
    let tac = [];
    let tempCount = 1;
    let labelCount = 1;

    function newTemp() { return `t${tempCount++}`; }
    function newLabel() { return `L${labelCount++}`; }

    function emit(op, arg1, arg2, res) {
        quads.push({ op, arg1, arg2, res });
        if (op === '=') tac.push(`${res} = ${arg1}`);
        else if (['+', '-', '*', '/', '<', '>', '<=', '>=', '==', '!=', '&&', '||'].includes(op))
            tac.push(`${res} = ${arg1} ${op} ${arg2}`);
        else if (op === 'ifFalse') tac.push(`ifFalse ${arg1} goto ${res}`);
        else if (op === 'goto') tac.push(`goto ${res}`);
        else if (op === 'label') tac.push(`${res}:`);
        else if (op === 'print') tac.push(`print ${arg1}`);
    }

    function genExpr(node) {
        if (node.isLeaf) return node.name;
        let left = genExpr(node.left);
        let right = genExpr(node.right);
        let t = newTemp();
        emit(node.op, left, right, t);
        return t;
    }

    function genStmt(node) {
        if (!node) return;
        if (node.name === 'Program' || node.name === 'Block') {
            node.children.forEach(genStmt);
        } else if (node.name === 'VarDecl') {
            if (node.expr) { let val = genExpr(node.expr); emit('=', val, '', node.id); }
        } else if (node.name === 'Assign') {
            let val = genExpr(node.expr); emit('=', val, '', node.id);
        } else if (node.name === 'Print') {
            node.children.forEach(arg => { let val = genExpr(arg); emit('print', val, '', ''); });
        } else if (node.name === 'If') {
            let condVar = genExpr(node.cond);
            let lElse = newLabel(), lEnd = newLabel();
            emit('ifFalse', condVar, '', lElse);
            genStmt(node.body);
            emit('goto', '', '', lEnd);
            emit('label', '', '', lElse);
            if (node.elseBody) genStmt(node.elseBody);
            emit('label', '', '', lEnd);
        } else if (node.name === 'While') {
            let lStart = newLabel(), lEnd = newLabel();
            emit('label', '', '', lStart);
            let condVar = genExpr(node.cond);
            emit('ifFalse', condVar, '', lEnd);
            genStmt(node.body);
            emit('goto', '', '', lStart);
            emit('label', '', '', lEnd);
        }
    }

    genStmt(ast);
    return { quads, tac };
}

// --- 5. Code Optimization ---
export function optimize(quads) {
    let optQuads = [];
    let tac = [];
    let strategies = new Set();
    let constants = {};

    // Pass 1: Constant Folding & Propagation
    for (let q of quads) {
        let { op } = q;
        let arg1 = q.arg1, arg2 = q.arg2, res = q.res;

        if (constants[arg1] !== undefined) {
            strategies.add(`Constant Propagation: Replaced ${arg1} with ${constants[arg1]}`);
            arg1 = constants[arg1];
        }
        if (constants[arg2] !== undefined) {
            strategies.add(`Constant Propagation: Replaced ${arg2} with ${constants[arg2]}`);
            arg2 = constants[arg2];
        }

        if (['+', '-', '*', '/'].includes(op) && !isNaN(arg1) && !isNaN(arg2)) {
            // eslint-disable-next-line no-eval
            let resultVal = eval(`${arg1} ${op} ${arg2}`);
            strategies.add(`Constant Folding: ${arg1} ${op} ${arg2} -> ${resultVal}`);
            optQuads.push({ op: '=', arg1: resultVal, arg2: '', res });
            constants[res] = resultVal;
        } else if (op === '=' && !isNaN(arg1)) {
            constants[res] = arg1;
            optQuads.push({ op, arg1, arg2, res });
        } else {
            if (res && res !== '' && isNaN(arg1)) delete constants[res];
            optQuads.push({ op, arg1, arg2, res });
        }
    }

    // Pass 2: Dead Code Elimination
    let used = new Set();
    for (let q of optQuads) {
        if (q.arg1) used.add(String(q.arg1));
        if (q.arg2) used.add(String(q.arg2));
        if (q.op === 'ifFalse' || q.op === 'print') used.add(String(q.arg1));
    }

    let finalQuads = [];
    for (let q of optQuads) {
        if (q.res && q.res.startsWith('t') && !used.has(q.res) && !['label', 'goto', 'print'].includes(q.op)) {
            strategies.add(`Dead Code Elimination: Removed unused assignment to ${q.res}`);
            continue;
        }
        finalQuads.push(q);
        const { op, arg1, arg2, res } = q;
        if (op === '=') tac.push(`${res} = ${arg1}`);
        else if (['+', '-', '*', '/', '<', '>', '<=', '>=', '==', '!=', '&&', '||'].includes(op))
            tac.push(`${res} = ${arg1} ${op} ${arg2}`);
        else if (op === 'ifFalse') tac.push(`ifFalse ${arg1} goto ${res}`);
        else if (op === 'goto') tac.push(`goto ${res}`);
        else if (op === 'label') tac.push(`${res}:`);
        else if (op === 'print') tac.push(`print ${arg1}`);
    }

    if (strategies.size === 0) strategies.add('No major optimizations applicable.');
    return { quads: finalQuads, tac, strategies: Array.from(strategies) };
}

// --- 6. Code Generation (Intel 8085 Assembly) ---
export function generateASM(quads) {
    let instructions = [];
    let memoryAddr = 0x2000;

    function emitInst(inst, ops = '', comment = '') {
        let size = 1;
        if (['LDA', 'STA', 'JMP', 'JZ', 'JNZ', 'CALL'].includes(inst)) size = 3;
        else if (['MVI', 'ADI', 'SUI', 'CPI', 'OUT'].includes(inst)) size = 2;
        const addrStr = memoryAddr.toString(16).toUpperCase().padStart(4, '0');
        instructions.push({ addr: addrStr, inst, ops, comment, isLabel: false });
        memoryAddr += size;
    }

    function emitLabel(label) {
        instructions.push({ addr: '', inst: '', ops: '', comment: '', isLabel: true, label });
    }

    function loadToA(operand) {
        if (!isNaN(operand)) emitInst('MVI', `A, ${operand}H`, 'Load immediate to Accumulator');
        else emitInst('LDA', operand, 'Load variable to Accumulator');
    }

    function loadToB(operand) {
        if (!isNaN(operand)) emitInst('MVI', `B, ${operand}H`, 'Load immediate to B reg');
        else { emitInst('LDA', operand); emitInst('MOV', 'B, A', 'Move A to B'); }
    }

    for (let q of quads) {
        if (q.op === 'label') {
            emitLabel(q.res);
        } else if (q.op === '=') {
            loadToA(q.arg1);
            emitInst('STA', q.res, `Store Accumulator to ${q.res}`);
        } else if (['+', '-', '*', '/'].includes(q.op)) {
            if (q.op === '+') {
                if (!isNaN(q.arg2)) { loadToA(q.arg1); emitInst('ADI', `${q.arg2}H`, 'Add immediate to A'); }
                else { loadToB(q.arg2); loadToA(q.arg1); emitInst('ADD', 'B', 'Add register B to A'); }
            } else if (q.op === '-') {
                if (!isNaN(q.arg2)) { loadToA(q.arg1); emitInst('SUI', `${q.arg2}H`, 'Subtract immediate from A'); }
                else { loadToB(q.arg2); loadToA(q.arg1); emitInst('SUB', 'B', 'Subtract register B from A'); }
            } else if (q.op === '*' || q.op === '/') {
                loadToB(q.arg2); loadToA(q.arg1);
                emitInst('CALL', q.op === '*' ? 'MULT' : 'DIV', '8085 simulated operation subroutine');
            }
            emitInst('STA', q.res);
        } else if (['<', '>', '<=', '>=', '==', '!='].includes(q.op)) {
            loadToB(q.arg2); loadToA(q.arg1);
            emitInst('CMP', 'B', 'Compare B with A (Sets flags)');
            emitInst('STA', q.res, 'Store condition flag state');
        } else if (q.op === 'ifFalse') {
            loadToA(q.arg1);
            emitInst('CPI', '00H', 'Compare A with 0');
            emitInst('JZ', q.res, 'Jump if Zero flag is set');
        } else if (q.op === 'goto') {
            emitInst('JMP', q.res, 'Unconditional jump');
        } else if (q.op === 'print') {
            loadToA(q.arg1);
            emitInst('OUT', '01H', 'Output to port 01 (Display)');
        }
    }
    emitInst('HLT', '', 'Halt Processor');
    return instructions;
}

// --- Master compile function ---
export function compileAll(code) {
    const tokens = lexer(code);
    const parser = new Parser(tokens);
    const ast = parser.parse();
    const semantics = analyzeSemantics(ast);
    const icg = generateICG(ast);
    const opt = optimize(icg.quads);
    const asm = generateASM(opt.quads);
    return { tokens, ast, semantics, icg, opt, asm };
}

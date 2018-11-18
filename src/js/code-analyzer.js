import * as esprima from 'esprima';

const parseCode = (codeToParse) => {
    return esprima.parseScript(codeToParse, {loc: true});
};

let structures = [];

function createTable(parsedCode) {
    structures = [];
    createStructures(parsedCode, structures);
    return structures;
}

function createTableRow(line, type, condition, name, value){
    return {line: line, type: type, condition: condition, name: name, value: value};
}

const parseDataType = {
    'FunctionDeclaration': parseFunctionDeclaration,
    'VariableDeclaration': parseVariableDeclaration,
    'ExpressionStatement': parseExpressionStatement,
    'WhileStatement': parseWhileStatement,
    'ReturnStatement': parseReturnStatement,
    'ForStatement': parseForStatement,
    'BlockStatement': createStructures
};

const parseIfStatementType = {
    false: parseIfStatement,
    true: parseIfElseStatement
};

function createStructures(parsedCode, structures) {
    if (parsedCode !== [] && parsedCode.body !== undefined && parsedCode.body != null)
        for (let i = 0; i < parsedCode.body.length; i++)
            parseStatement(structures, parsedCode.body[i], false);
}

function parseStatement(structures, expression, elseIf) {
    if (expression.type in parseDataType)
        parseDataType[expression.type](expression, structures);
    else parseIfStatementType[elseIf](expression, structures);
}

function parseFunctionDeclaration(expression, structures) {
    structures.push(createTableRow(expression.id.loc.start.line, 'function declaration', '',  expression.id.name, ''));
    for (const param of expression.params)
        structures.push(createTableRow(param.loc.start.line, 'variable declaration', '', param.name, ''));
    createStructures(expression.body, structures);
}

function parseVariableDeclaration(expression, structures) {
    for (const declaration of expression.declarations)
        if (declaration.init != null)
            structures.push(createTableRow(declaration.loc.start.line, 'variable declaration', '', declaration.id.name, declaration.init.value));
        else
            structures.push(createTableRow(declaration.loc.start.line, 'variable declaration', '', declaration.id.name, 'null'));
}

function parseIfStatement(expression, structures) {
    structures.push(createTableRow(expression.loc.start.line, 'if statement', parseExpression(expression.test), '',''));
    parseStatement(structures, expression.consequent, false);
    if (expression.alternate != null) parseStatement(structures, expression.alternate, true);
}

function parseIfElseStatement(expression, structures) {
    structures.push(createTableRow(expression.loc.start.line, 'else if statement', parseExpression(expression.test), '', ''));
    parseStatement(structures, expression.consequent, false);
    if (expression.alternate != null) parseStatement(structures, expression.alternate, true);
}

function parseWhileStatement(expression, structures) {
    structures.push(createTableRow(expression.loc.start.line, 'while statement', parseExpression(expression.test), '', ''));
    createStructures(expression.body, structures);
}

function parseForStatement(expression, structures) {
    structures.push(createTableRow(expression.loc.start.line, 'for statement', parseExpression(expression.test), '', ''));
    createStructures(expression.body, structures);
}

function parseExpressionStatement(expression, structures) {
    if (expression.expression.left != null && expression.expression.left !== undefined)
        structures.push(createTableRow(expression.loc.start.line, 'assignment expression', '', expression.expression.left.name, parseExpression(expression.expression.right)));
    else
    if (expression.expression.name != null && expression.expression.name !== undefined)
        structures.push(createTableRow(expression.loc.start.line, 'expression statement', '', expression.expression.name, ''));
    else
        structures.push(createTableRow(expression.loc.start.line, 'expression statement', '', '', expression.expression.value));
}

function parseExpression(right) {
    const tryParse = right.type === 'Literal' ? right.value.toString() : right.type === 'Identifier' ? right.name : false;
    if (tryParse) return tryParse;
    switch(right.type) {
    case 'UnaryExpression': return right.operator + '' + parseExpression(right.argument);
    case 'MemberExpression': return parseExpression(right.object) + '[' + parseExpression(right.property) + ']';
    case 'BinaryExpression': return parseExpression(right.left) + '' + right.operator + '' + parseExpression(right.right);
    }
}

function parseReturnStatement(expression, structures) {
    structures.push(createTableRow(expression.loc.start.line, 'return statement', '', '', parseExpression(expression.argument)));
}

export {parseCode, createTable, structures};

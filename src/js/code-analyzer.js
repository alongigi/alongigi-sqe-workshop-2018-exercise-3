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
    'BlockStatement': createStructures,
    'DoWhileStatement': parseDoWhileStatement
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

function parseDoWhileStatement(expression, structures) {
    structures.push(createTableRow(expression.loc.start.line, 'do while statement', parseExpression(expression.test), '', ''));
    createStructures(expression.body, structures);
}

function parseForStatement(expression, structures) {
    structures.push(createTableRow(expression.loc.start.line, 'for statement', parseExpression(expression.test), '', ''));
    createStructures(expression.body, structures);
}

function parseUpdateExpression(expression, structures){
    if(expression.expression.operator === '++')
        structures.push(createTableRow(expression.loc.start.line, 'assignment statement', '', expression.expression.argument.name, expression.expression.argument.name + '+1'));
    else
        structures.push(createTableRow(expression.loc.start.line, 'assignment statement', '', expression.expression.argument.name, expression.expression.argument.name + '-1'));
}

function parseExpressionStatement(expression, structures) {
    if (expression.expression.left != null && expression.expression.left !== undefined)
        structures.push(createTableRow(expression.loc.start.line, 'assignment expression', '', expression.expression.left.name, parseExpression(expression.expression.right)));
    else
        parseUpdateExpression(expression, structures);
}

function simpleParse(right) {
    if(right.type  === 'Literal')
        return right.value.toString();
    if(right.type === 'Identifier')
        return right.name;
}

function recursionParse(right) {
    if (right.type === 'UnaryExpression')
        return right.operator + '' + parseExpression(right.argument);
    if (right.type === 'MemberExpression')
        return parseExpression(right.object) + '[' + parseExpression(right.property) + ']';
    if (right.type === 'BinaryExpression')
        return parseExpression(right.left) + '' + right.operator + '' + parseExpression(right.right);
}

function parseExpression(right) {
    const simple = ['Literal', 'Identifier'];
    const recursion = ['UnaryExpression', 'MemberExpression', 'BinaryExpression'];
    if(simple.includes(right.type))
        return simpleParse(right);
    else if (recursion.includes(right.type))
        return recursionParse(right);
}

function parseReturnStatement(expression, structures) {
    structures.push(createTableRow(expression.loc.start.line, 'return statement', '', '', parseExpression(expression.argument)));
}

export {parseCode, createTable, structures};

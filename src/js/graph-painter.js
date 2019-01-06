import * as esprima from 'esprima';
import * as escodegen from 'escodegen';
import * as esgraph from 'esgraph';

const parseDataType = ['Literal', 'MemberExpression', 'Identifier', 'UnaryExpression', 'BinaryExpression', 'ArrayExpression'];
let argument = [[],[]];
let evaluate = '';

function colorVertex(vertex, vertexTypes, edges){
    let color = [];
    for(let i = 0; i < vertex.length; i++){
        color.push(vertex[i][0]);
        evaluate = evaluate + vertex[i][1] + '\n';
        if (vertex[i][1].includes('return')) return color;
        else if (parseDataType.includes(vertexTypes.get(vertex[i][0])))
            i =  vertex.indexOf(vertex.filter((x) => x[0] === edges.filter((x) => x[0] === vertex[i][0]).filter((x) => x[3] === eval(evaluate).toString())[0][2])[0]) - 1;
        else i = vertex.indexOf(vertex.filter((x) => x[0] === edges[edges.indexOf(edges.filter((x) => x[0] === vertex[i][0])[0])][2])[0]) - 1;
    }
}

function parseCode(codeToParse) {
    return esprima.parseScript(codeToParse, {loc: true, range: true });
}

function parseArray(input, inputVector) {
    input = parseCode(inputVector).body[0].expression;
    return [escodegen.generate(input)];
}

function parseArguments(inputVector, code) {
    let input = '';
    if (!inputVector.includes('[')) input = inputVector.split(',');
    else input = parseArray(input, inputVector);
    let parsed = parseCode(code);
    if (input.length === 1) {
        argument[0][0] = parsed.body[parsed.body.length - 1].params[0].name;
        argument[1][0] = input[0];
    } else {
        for (let i = 0; i < input.length; i++) {
            argument[0][i] = parsed.body[parsed.body.length - 1].params[i].name;
            argument[1][i] = input[i];
        }
    }
}

function addLine(vertexs, i, quote) {
    vertexs[i] = vertexs[i].substring(0, quote + 1) + (i + 1) + '\n' + vertexs[i].substring(quote + 1);
}

function draw(vertexs, i, inputTypes, colorVertex) {
    let index = vertexs[i].lastIndexOf(']');
    let quote = vertexs[i].indexOf('"');
    if (parseDataType.includes(inputTypes[i][1])) {
        vertexs[i] = vertexs[i].substring(0, index) + ' ,shape="diamond"]';
        addLine(vertexs, i, quote);
    } else {
        vertexs[i] = vertexs[i].substring(0, index) + ' ,shape="box"]';
        addLine(vertexs, i, quote);
    }
    if (colorVertex.includes(vertexs[i].split(' ')[0])) {
        index = vertexs[i].lastIndexOf(']');
        vertexs[i] = vertexs[i].substring(0, index) + ' ,color="green" , style=filled]';
    }
}

function colorPath(inputTypes, inputGraph) {
    let mapInput = new Map();
    for (let i = 0; i < inputTypes.length; i++)
        mapInput.set(inputTypes[i][0], inputTypes[i][1]);
    let edges = inputGraph.filter((x) => x.includes('->')).map((x) => x.split(' '));
    edges = edges.map((x) => x[3] === '[]' ? x : [x[0], x[1], x[2], x[3].slice(x[3].indexOf('"') + 1, x[3].length - 2)]);
    let vertexs = inputGraph.filter((x) => !x.includes('->'));
    vertexs = vertexs.map((x) => [x.slice(0, x.indexOf(' ')), x.slice(x.indexOf(' ') + 1)]);
    vertexs = vertexs.map((x) => [x[0], x[1].slice(x[1].indexOf('"') + 1, x[1].length - 2)]);
    return colorVertex(vertexs, mapInput, edges);
}

function filterInputTypes(exception, graphedInput) {
    let inputTypes = exception.filter((x) => !x.includes('n0')).filter((x) => !x.includes(exception.filter((x) => x.includes('[label="exit", style="rounded"]'))[0].split(' ')[0]));
    inputTypes = inputTypes.filter((x) => !x.includes('->'));
    inputTypes = inputTypes.map((x) => [x.slice(0, x.indexOf(' ')), x.slice(x.indexOf(' ') + 1)]);
    inputTypes = inputTypes.map((x) => [x[0], x[1].slice(x[1].indexOf('"') + 1, x[1].length - 2)]);
    let colorVertex = colorPath(inputTypes, graphedInput);
    let vertex = graphedInput.filter((x) => !x.includes('->'));
    for (let i = 0; i < vertex.length; i++)
        draw(vertex, i, inputTypes, colorVertex);
    return vertex;
}

function filterElements(parsed, code) {
    let cfg = esgraph(parsed.body[parsed.body.length - 1].body);
    let graphedInput = esgraph.dot(cfg, {counter: 0, source: code});
    let exception = (graphedInput.trim().split('\n').filter((x) => !x.includes('label="exception"')));
    graphedInput = exception.filter((x) => !x.includes('n0')).filter((x) => !x.includes(exception.filter((x) => x.includes('[label="exit", style="rounded"]'))[0].split(' ')[0]));
    exception = (esgraph.dot(cfg).trim().split('\n').filter((x) => !x.includes('label="exception"')));
    return filterInputTypes(exception, graphedInput).concat(graphedInput.filter((x) => x.includes('->'))).join('\n');
}

function graphPaint(code, inputVector){
    let parsed = parseCode(code);
    argument = [[],[]];
    evaluate = '';
    if (parsed.body.length > 1)
        for (let i = 0; i < parsed.body.length - 1; i++)
            evaluate = evaluate + escodegen.generate(parsed.body[i]);
    if (inputVector === '') argument = [[], []];
    else parseArguments(inputVector, code);
    for (let i = 0; i < argument[0].length; i++)
        evaluate = evaluate + ' let ' + argument[0][i] + ' = ' + argument[1][i] + ';\n';
    return filterElements(parsed, code);
}

export {graphPaint};
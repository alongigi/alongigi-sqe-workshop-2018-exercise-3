import $ from 'jquery';
import {parseCode, createTable} from './code-analyzer';

let counter;

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
        for (let row = document.getElementById('table').rows.length - 1; row >= 1; row--)
            document.getElementById('table').deleteRow(row);
        const structures = createTable(parsedCode);
        counter = 1;
        for (const structure of structures)
            addLine(document.getElementById('table'), structure.line, structure.type, structure.name, structure.condition, structure.value);
    });
});

function addLine(table, line, type, name, condition, value) {
    const row = table.insertRow(counter);
    row.insertCell(0).appendChild(document.createTextNode(line));
    row.insertCell(1).appendChild(document.createTextNode(type));
    row.insertCell(2).appendChild(document.createTextNode(name));
    row.insertCell(3).appendChild(document.createTextNode(condition));
    row.insertCell(4).appendChild(document.createTextNode(value));
    counter++;
}

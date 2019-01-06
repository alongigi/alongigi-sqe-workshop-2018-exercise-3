import $ from 'jquery';
import {graphPaint} from './graph-painter';
import Viz from 'viz.js';
import { Module, render } from 'viz.js/full.render.js';

let viz = new Viz({ Module, render });

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        viz.renderString('digraph  { ' + graphPaint($('#codePlaceholder').val(), $('#argumentsPlaceholder').val()) + ' }')
            .then(result => {
                document.getElementById('parsedCode').innerHTML = result;
            });
    });
});
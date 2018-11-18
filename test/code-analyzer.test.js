import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';
import {structures, createTable} from '../src/js/code-analyzer';

describe('The function declaration', () => {
    it('is parsing a function declaration with arguments', () => {
        createTable(parseCode('function binarySearch(X, V, n){}'));
        assert.deepEqual(
            structures,
            [{line: 1, type: 'function declaration', name: 'binarySearch', condition: '', value: ''},
                {line: 1, type: 'variable declaration', name: 'X', condition: '', value: ''},
                {line: 1, type: 'variable declaration', name: 'V', condition: '', value: ''},
                {line: 1, type: 'variable declaration', name: 'n', condition: '', value: ''}]
        );
    });
    it('is parsing a function declaration without arguments', () => {
        createTable(parseCode('function binarySearch(){}'));
        assert.deepEqual(
            structures,
            [{line: 1, type: 'function declaration', name: 'binarySearch', condition: '', value: ''}
            ]);
    });
});

describe('The variable declaration', () => {
    it('is parsing a variable declaration with value', () => {
        createTable(parseCode('let a = 10;'));
        assert.deepEqual(
            structures, [{line: 1, type: 'variable declaration', name: 'a', condition: '', value: '10'}]
        );
    });
    it('is parsing a variable declaration without value', () => {
        createTable(parseCode('let a;'));
        assert.deepEqual(
            structures,[{line: 1, type: 'variable declaration', name: 'a', condition: '', value: 'null'}]
        );
    });
});

describe('The assignment expression', () => {
    it('is parsing a simple assignment expression', () => {
        createTable(parseCode('a = 17;'));
        assert.deepEqual(
            structures, [{line: 1, type: 'assignment expression', name: 'a', condition: '', value: '17'}]
        );
    });
    it('is parsing a complex assignment expression', () => {
        createTable(parseCode('a = x + y + z;'));
        assert.deepEqual(
            structures,[{line: 1, type: 'assignment expression', name: 'a', condition: '', value: 'x+y+z'}]
        );
    });
});

describe('The if statement', () => {
    it('is parsing a simple if statement', () => {
        createTable(parseCode('if(a < b){}'));
        assert.deepEqual(
            structures,
            [{line: 1, type: 'if statement', name: '', condition: 'a<b', value: ''}]
        );
    });
    it('is parsing a complex if statement', () => {
        createTable(parseCode('if (x < y)\n' +
            '            x = x + 1;'));
        assert.deepEqual(
            structures,
            [{line: 1, type: 'if statement', name: '', condition: 'x<y', value: ''},
                {line: 2, type: 'assignment expression', name: 'x', condition: '', value: 'x+1'}]
        );
    });
});

describe('The if else statement', () => {
    it('is parsing a simple if else statement', () => {
        createTable(parseCode(' if (a < b)\n' +
            '            a = b - 1;\n' +
            '        else if (b > a)\n' +
            '            b = a + 1;'));
        assert.deepEqual(
            structures,
            [{line: 1, type: 'if statement', name: '', condition: 'a<b', value: ''},
                {line: 2, type: 'assignment expression', name: 'a', condition: '', value: 'b-1'},
                {line: 3, type: 'else if statement', name: '', condition: 'b>a', value: ''},
                {line: 4, type: 'assignment expression', name: 'b', condition: '', value: 'a+1'}]
        );
    });
    it('is parsing a complex if else statement', () => {
        createTable(parseCode('if (x > y)\n' +
            '            y = y * 2;\n' +
            '        else if (x < y)\n' +
            '            x = x * 2;\n' +
            '        else\n' +
            '            y = x * y;'));
        assert.deepEqual(
            structures,
            [{line: 1, type: 'if statement', name: '', condition: 'x>y', value: ''},
                {line: 2, type: 'assignment expression', name: 'y', condition: '', value: 'y*2'},
                {line: 3, type: 'else if statement', name: '', condition: 'x<y', value: ''},
                {line: 4, type: 'assignment expression', name: 'x', condition: '', value: 'x*2'},
                {line: 6, type: 'assignment expression', name: 'y', condition: '', value: 'x*y'}]
        );
    });
});

describe('The while statement', () => {
    it('is parsing simple while statement', () => {
        createTable(parseCode('while(a < b){}'));
        assert.deepEqual(
            structures,
            [{line: 1, type: 'while statement', name: '', condition: 'a<b', value: ''}]
        );
    });
    it('is parsing complex while statement', () => {
        createTable(parseCode('while(b <= a){}'));
        assert.deepEqual(
            structures,
            [{line: 1, type: 'while statement', name: '', condition: 'b<=a', value: ''}]
        );
    });
});

describe('The full function', () => {
    it('is parsing full function', () => {
        createTable(parseCode('function binarySearch(X, V, n){\n' +
            '    let low, high, mid;\n' +
            '    low = 0;\n' +
            '    high = n - 1;\n' +
            '    while (low <= high) {\n' +
            '        mid = (low + high)/2;\n' +
            '        if (X < V[mid])\n' +
            '            high = mid - 1;\n' +
            '        else if (X > V[mid])\n' +
            '            low = mid + 1;\n' +
            '        else\n' +
            '            return mid;\n' +
            '    }\n' +
            '    return -1;\n' +
            '}'));
        assert.deepEqual(
            structures,
            [{line: 1, type: 'function declaration', name: 'binarySearch', condition: '', value: ''},
                {line: 1, type: 'variable declaration', name: 'X', condition: '', value: ''},
                {line: 1, type: 'variable declaration', name: 'V', condition: '', value: ''},
                {line: 1, type: 'variable declaration', name: 'n', condition: '', value: ''},
                {line: 2, type: 'variable declaration', name: 'low', condition: '', value: 'null'},
                {line: 2, type: 'variable declaration', name: 'high', condition: '', value: 'null'},
                {line: 2, type: 'variable declaration', name: 'mid', condition: '', value: 'null'},
                {line: 3, type: 'assignment expression', name: 'low', condition: '', value: '0'},
                {line: 4, type: 'assignment expression', name: 'high', condition: '', value: 'n-1'},
                {line: 5, type: 'while statement', name: '', condition: 'low<=high', value: ''},
                {line: 6, type: 'assignment expression', name: 'mid', condition: '', value: 'low+high/2'},
                {line: 7, type: 'if statement', name: '', condition: 'X<V[mid]', value: ''},
                {line: 8, type: 'assignment expression', name: 'high', condition: '', value: 'mid-1'},
                {line: 9, type: 'else if statement', name: '', condition: 'X>V[mid]', value: ''},
                {line: 10, type: 'assignment expression', name: 'low', condition: '', value: 'mid+1'},
                {line: 12, type: 'return statement', name: '', condition: '', value: 'mid'},
                {line: 14, type: 'return statement', name: '', condition: '', value: '-1'}
            ]
        );
    });
});



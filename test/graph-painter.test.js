import assert from 'assert';
import {graphPaint} from '../src/js/graph-painter';

describe('The function declaration', () => {
    it('is parsing a function declaration with arguments', () => {
        assert.equal(
            graphPaint(
                `function binarySearch(X, V, n){
                }`,'1,2,3'),
            ''
        );
    });

    it('is parsing a function declaration without arguments', () => {
        assert.equal(
            graphPaint(
                `function binarySearch(){
                }`,''),
            ''
        );
    });
});

describe('The variable declaration', () => {
    it('is parsing a variable declaration with value', () => {
        assert.equal(
            graphPaint(
                `function binarySearch(X, V, n){
                let a = 10;
                return a;
                }`,'1,2,3'),
            'n1 [label="1\n' +
            'let a = 10;" ,shape="box" ,color="green" , style=filled]\n' +
            'n2 [label="2\n' +
            'return a;" ,shape="box" ,color="green" , style=filled]\n' +
            'n1 -> n2 []'
        );
    });

    it('is parsing a variable declaration without value', () => {
        assert.equal(
            graphPaint(
                `function binarySearch(){
                let a;
                return true;
                }`,''),
            'n1 [label="1\n' +
            'let a;" ,shape="box" ,color="green" , style=filled]\n' +
            'n2 [label="2\n' +
            'return true;" ,shape="box" ,color="green" , style=filled]\n' +
            'n1 -> n2 []'
        );
    });
});

describe('The assignment expression', () => {
    it('is parsing a simple assignment expression', () => {
        assert.equal(
            graphPaint(
                `function binarySearch(X, V, n){
                n = 17;
                return n;
                }`,'1, 2, 3'),
            'n1 [label="1\n' +
            'n = 17" ,shape="box" ,color="green" , style=filled]\n' +
            'n2 [label="2\n' +
            'return n;" ,shape="box" ,color="green" , style=filled]\n' +
            'n1 -> n2 []'
        );
    });

    it('is parsing a complex assignment expression', () => {
        assert.equal(
            graphPaint(`
            function binarySearch(x, y, z){
            z = x + y;
            return z;
            }`,'1, 2, 3'),
            'n1 [label="1\n' +
            'z = x + y" ,shape="box" ,color="green" , style=filled]\n' +
            'n2 [label="2\n' +
            'return z;" ,shape="box" ,color="green" , style=filled]\n' +
            'n1 -> n2 []'
        );
    });
});

describe('The if statement', () => {
    it('is parsing a simple if statement', () => {
        assert.equal(
            graphPaint(`
            function binarySearch(X, V, n){
            if(X < V){
            return n;}
            }`, '1, 2, 3'),
            'n1 [label="1\n' +
            'X < V" ,shape="diamond" ,color="green" , style=filled]\n' +
            'n2 [label="2\n' +
            'return n;" ,shape="box" ,color="green" , style=filled]\n' +
            'n1 -> n2 [label="true"]'
        );
    });
    it('is parsing a complex if statement', () => {
        assert.equal(
            graphPaint(`
            function binarySearch(x, y ,z){
            if (x < y){
            x = x + 1;
            return z;
            }
            }`, '1, 2, 3'),
            'n1 [label="1\n' +
            'x < y" ,shape="diamond" ,color="green" , style=filled]\n' +
            'n2 [label="2\n' +
            'x = x + 1" ,shape="box" ,color="green" , style=filled]\n' +
            'n3 [label="3\n' +
            'return z;" ,shape="box" ,color="green" , style=filled]\n' +
            'n1 -> n2 [label="true"]\n' +
            'n2 -> n3 []'
        );
    });
});

describe('The if else statement', () => {
    it('is parsing a simple if else statement', () => {
        assert.equal(
            graphPaint(`
            function binarySearch(a, b, c){
            if (a < b){
            a = b + 1;
            return c;
            }
            else if (b < a){
            b = a + 1;
            }
            }`, '1, 2, 3'),
            'n1 [label="1\n' +
            'a < b" ,shape="diamond" ,color="green" , style=filled]\n' +
            'n2 [label="2\n' +
            'a = b + 1" ,shape="box" ,color="green" , style=filled]\n' +
            'n3 [label="3\n' +
            'return c;" ,shape="box" ,color="green" , style=filled]\n' +
            'n4 [label="4\n' +
            'b < a" ,shape="diamond"]\n' +
            'n5 [label="5\n' +
            'b = a + 1" ,shape="box"]\n' +
            'n1 -> n2 [label="true"]\n' +
            'n1 -> n4 [label="false"]\n' +
            'n2 -> n3 []\n' +
            'n4 -> n5 [label="true"]'
        );
    });

    it('is parsing a complex if else statement', () => {
        assert.equal(
            graphPaint(`
            function binarySearch(x, y ,z){
            if (x < y){
            y = y * 2;
            }else if (x > y){
            x = x * 2;
            }else{
            y = x * y;
            }
            return z;
            }`, '1, 2, 3'),
            'n1 [label="1\n' +
            'x < y" ,shape="diamond" ,color="green" , style=filled]\n' +
            'n2 [label="2\n' +
            'y = y * 2" ,shape="box" ,color="green" , style=filled]\n' +
            'n3 [label="3\n' +
            'return z;" ,shape="box" ,color="green" , style=filled]\n' +
            'n4 [label="4\n' +
            'x > y" ,shape="diamond"]\n' +
            'n5 [label="5\n' +
            'x = x * 2" ,shape="box"]\n' +
            'n6 [label="6\n' +
            'y = x * y" ,shape="box"]\n' +
            'n1 -> n2 [label="true"]\n' +
            'n1 -> n4 [label="false"]\n' +
            'n2 -> n3 []\n' +
            'n4 -> n5 [label="true"]\n' +
            'n4 -> n6 [label="false"]\n' +
            'n5 -> n3 []\n' +
            'n6 -> n3 []'
        );
    });
});

describe('The while statement', () => {
    it('is parsing a simple while statement', () => {
        assert.equal(
            graphPaint(
                `function binarySearch(a, b, c){
                while(a < b){
                a = a + 1;
                }
                return a;
                }`, '1, 2, 3'),
            'n1 [label="1\n' +
            'a < b" ,shape="diamond" ,color="green" , style=filled]\n' +
            'n2 [label="2\n' +
            'a = a + 1" ,shape="box" ,color="green" , style=filled]\n' +
            'n3 [label="3\n' +
            'return a;" ,shape="box" ,color="green" , style=filled]\n' +
            'n1 -> n2 [label="true"]\n' +
            'n1 -> n3 [label="false"]\n' +
            'n2 -> n1 []'

        );
    });
    it('is parsing a complex while statement', () => {
        assert.equal(
            graphPaint(`
            function binarySearch(a, b, c){
            while(a < b){
            a = a + 1;
            b = b - 1;
            }
            return b;
            }`, '1, 2, 3'),
            'n1 [label="1\n' +
            'a < b" ,shape="diamond" ,color="green" , style=filled]\n' +
            'n2 [label="2\n' +
            'a = a + 1" ,shape="box" ,color="green" , style=filled]\n' +
            'n3 [label="3\n' +
            'b = b - 1" ,shape="box" ,color="green" , style=filled]\n' +
            'n4 [label="4\n' +
            'return b;" ,shape="box" ,color="green" , style=filled]\n' +
            'n1 -> n2 [label="true"]\n' +
            'n1 -> n4 [label="false"]\n' +
            'n2 -> n3 []\n' +
            'n3 -> n1 []'
        );
    });
});

describe('The Update Expression', () => {
    it('is parsing an update expression plus', () => {
        assert.equal(
            graphPaint(`
            function binarySearch(){
            let y = 3;
            y++;
            return y;
            }`, ''),
            'n1 [label="1\n' +
            'let y = 3;" ,shape="box" ,color="green" , style=filled]\n' +
            'n2 [label="2\n' +
            'y++" ,shape="box" ,color="green" , style=filled]\n' +
            'n3 [label="3\n' +
            'return y;" ,shape="box" ,color="green" , style=filled]\n' +
            'n1 -> n2 []\n' +
            'n2 -> n3 []'
        );
    });
});

describe('The array expression', () => {
    it('is parsing a simple array expression', () => {
        assert.equal(
            graphPaint(`
            function binarySearch(){
                let a = [1,2,3];
                a[1] = 2;
                return a[1];
            }`, ''),
            'n1 [label="1\n' +
            'let a = [1,2,3];" ,shape="box" ,color="green" , style=filled]\n' +
            'n2 [label="2\n' +
            'a[1] = 2" ,shape="box" ,color="green" , style=filled]\n' +
            'n3 [label="3\n' +
            'return a[1];" ,shape="box" ,color="green" , style=filled]\n' +
            'n1 -> n2 []\n' +
            'n2 -> n3 []'
        );
    });

    it('is parsing a complex array expression', () => {
        assert.equal(
            graphPaint(`
            function binarySearch(x, y){
                x[3] = 3;
                return x[3];
            }`, '[1,2,3,4,5], 1'),
            'n1 [label="1\n' +
            'x[3] = 3" ,shape="box" ,color="green" , style=filled]\n' +
            'n2 [label="2\n' +
            'return x[3];" ,shape="box" ,color="green" , style=filled]\n' +
            'n1 -> n2 []'
        );
    });
});
//
describe('The full function', () => {
    it('is parsing full function while', () => {
        assert.equal(
            graphPaint(`
            function foo(x, y, z){
            let a = x + 1;
            let b = a + y;
            let c = 0;
            while(a < b){
            a = a + 1;
            }
            return z;
            }
            `, '1, 2, 3'),
            'n1 [label="1\n' +
            'let a = x + 1;" ,shape="box" ,color="green" , style=filled]\n' +
            'n2 [label="2\n' +
            'let b = a + y;" ,shape="box" ,color="green" , style=filled]\n' +
            'n3 [label="3\n' +
            'let c = 0;" ,shape="box" ,color="green" , style=filled]\n' +
            'n4 [label="4\n' +
            'a < b" ,shape="diamond" ,color="green" , style=filled]\n' +
            'n5 [label="5\n' +
            'a = a + 1" ,shape="box" ,color="green" , style=filled]\n' +
            'n6 [label="6\n' +
            'return z;" ,shape="box" ,color="green" , style=filled]\n' +
            'n1 -> n2 []\n' +
            'n2 -> n3 []\n' +
            'n3 -> n4 []\n' +
            'n4 -> n5 [label="true"]\n' +
            'n4 -> n6 [label="false"]\n' +
            'n5 -> n4 []'
        );
    });

    it('is parsing full function if', () => {
        assert.equal(
            graphPaint(`
            function foo(x, y, z){
            let a = x + 1;
            let b = a + y;
            let c = 0;

            if (b < z) {
                c = c + 5;
                return x + y + z + c;
            } else if (b < z * 2) {
                c = c + x + 5;
                return x + y + z + c;
            } else {
                c = c + z + 5;
                return x + y + z + c;
            }
            }`, '1, 2, 3'),
            'n1 [label="1\n' +
            'let a = x + 1;" ,shape="box" ,color="green" , style=filled]\n' +
            'n2 [label="2\n' +
            'let b = a + y;" ,shape="box" ,color="green" , style=filled]\n' +
            'n3 [label="3\n' +
            'let c = 0;" ,shape="box" ,color="green" , style=filled]\n' +
            'n4 [label="4\n' +
            'b < z" ,shape="diamond" ,color="green" , style=filled]\n' +
            'n5 [label="5\n' +
            'c = c + 5" ,shape="box"]\n' +
            'n6 [label="6\n' +
            'return x + y + z + c;" ,shape="box"]\n' +
            'n7 [label="7\n' +
            'b < z * 2" ,shape="diamond" ,color="green" , style=filled]\n' +
            'n8 [label="8\n' +
            'c = c + x + 5" ,shape="box" ,color="green" , style=filled]\n' +
            'n9 [label="9\n' +
            'return x + y + z + c;" ,shape="box" ,color="green" , style=filled]\n' +
            'n10 [label="10\n' +
            'c = c + z + 5" ,shape="box"]\n' +
            'n11 [label="11\n' +
            'return x + y + z + c;" ,shape="box"]\n' +
            'n1 -> n2 []\n' +
            'n2 -> n3 []\n' +
            'n3 -> n4 []\n' +
            'n4 -> n5 [label="true"]\n' +
            'n4 -> n7 [label="false"]\n' +
            'n5 -> n6 []\n' +
            'n7 -> n8 [label="true"]\n' +
            'n7 -> n10 [label="false"]\n' +
            'n8 -> n9 []\n' +
            'n10 -> n11 []'
        );
    });



    it('is parsing global variable', () => {
        assert.equal(
            graphPaint(`
            let a = [1,2,3];
            function foo (x){
            let b = a[1];
            if(b == 1){
            return 1;
            }
            else if(b == 2){
            return a[2];
            }
            return b;
            }`, '1'),
            'n1 [label="1\n' +
            'let b = a[1];" ,shape="box" ,color="green" , style=filled]\n' +
            'n2 [label="2\n' +
            'b == 1" ,shape="diamond" ,color="green" , style=filled]\n' +
            'n3 [label="3\n' +
            'return 1;" ,shape="box"]\n' +
            'n4 [label="4\n' +
            'b == 2" ,shape="diamond" ,color="green" , style=filled]\n' +
            'n5 [label="5\n' +
            'return a[2];" ,shape="box" ,color="green" , style=filled]\n' +
            'n6 [label="6\n' +
            'return b;" ,shape="box"]\n' +
            'n1 -> n2 []\n' +
            'n2 -> n3 [label="true"]\n' +
            'n2 -> n4 [label="false"]\n' +
            'n4 -> n5 [label="true"]\n' +
            'n4 -> n6 [label="false"]'
        );
    });
});
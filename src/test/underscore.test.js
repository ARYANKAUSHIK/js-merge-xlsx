const _ = require('underscore');
require('../lib/underscore');
const assert = require('chai').assert;

describe('underscore.js', () => {

    describe('stringValue()', () => {
        it('should return the same value if not array', () => {
            assert.strictEqual(_.stringValue('test'), 'test');
        });
        it('should return first element if array', () => {
            assert.strictEqual(_.stringValue(['first', 'second', 'third']), 'first');
        });
        it('should return attribute "mustache" if have', () => {
            assert.strictEqual(_.stringValue([{_: 'mustache', key1: 'value1'}]), 'mustache');
        });
    });

    describe('variables()', () => {
        it('should parse from word surrounded by triple-brace', () => {
            let parsed = _.variables('{{{word}}}');
            assert.isOk(_.isArray(parsed));
            assert.strictEqual(parsed.length, 1);
            assert.strictEqual(parsed[0], 'word');
        });

        it('should parse from all word surrounded by triple-brace', () => {
            let parsed = _.variables('{{{word1}}}, {{{word2}}}}, {{{word3}}}');
            assert.isOk(_.isArray(parsed));
            assert.strictEqual(parsed.length, 3);
            assert.strictEqual(parsed[0], 'word1');
            assert.strictEqual(parsed[1], 'word2');
            assert.strictEqual(parsed[2], 'word3');
        });

        it('should not parse from word surrounded by double-brace', () => {
            let parsed = _.variables('{{word1}}');
            assert.isOk(_.isArray(parsed));
            assert.strictEqual(parsed.length, 0);
        });

        it('should not parse from word surrounded by double-brace', () => {
            let parsed = _.variables('{{word1}}, {{word2}}, {{word3}}');
            assert.isOk(_.isArray(parsed));
            assert.strictEqual(parsed.length, 0);
        });

        it('should not encode when parsing', () => {
            let parsed = _.variables('{{{<>\"\\\&\'}}}');
            assert.isOk(_.isArray(parsed));
            assert.strictEqual(parsed.length, 1);
            assert.strictEqual(parsed[0], '<>\"\\\&\'');
        });

        it('should return null if not string', () => {
            let parsed = _.variables(['{{{value1}}}']);
            assert.strictEqual(parsed, null);
        });

        it('should return null if null', () => {
            let parsed = _.variables(null);
            assert.strictEqual(parsed, null);
        });

        it('should return null if undefined', () => {
            let parsed = _.variables(undefined);
            assert.strictEqual(parsed, null);
        });

    });

    describe('hasVariable()', () => {
        it('should return true if having a triple-brace', () => {
            let hasVariable = _.hasVariable('{{{word}}}');
            assert.strictEqual(hasVariable, true);
        });

        it('should return true if having triple-braces', () => {
            let hasVariable = _.hasVariable('{{{word1}}}, {{{word2}}}');
            assert.strictEqual(hasVariable, true);
        });

        it('should return false if having a double-brace', () => {
            let hasVariable = _.hasVariable('{{word1}}');
            assert.strictEqual(hasVariable, false);
        });

        it('should return false if having double-braces', () => {
            let hasVariable = _.hasVariable('{{word1}}, {{word2}}');
            assert.strictEqual(hasVariable, false);
        });

        it('should return false if not string', () => {
            let hasVariable = _.hasVariable(['{{word1}}']);
            assert.strictEqual(hasVariable, false);
        });

        it('should return false if null', () => {
            let hasVariable = _.hasVariable(null);
            assert.strictEqual(hasVariable, false);
        });

        it('should return false if undefined', () => {
            let hasVariable = _.hasVariable(undefined);
            assert.strictEqual(hasVariable, false);
        });

    });

    describe('deepCopy()', () => {
        it('should throw error if string', () => {
            try {
                _.deepCopy('string');
                assert.isOk(false);
            } catch(e) {
                assert.isOk(true);
            }
        });

        it('should throw error if number', () => {
            try {
                _.deepCopy(10);
                assert.isOk(false);
            } catch(e) {
                assert.isOk(true);
            }
        });

        it('should throw error if boolean', () => {
            try {
                _.deepCopy(true);
                assert.isOk(false);
            } catch(e) {
                assert.isOk(true);
            }
        });

        it('should throw error if null', () => {
            try {
                _.deepCopy(null);
                assert.isOk(false);
            } catch(e) {
                assert.isOk(true);
            }
        });

        it('should throw error if undefined', () => {
            try {
                _.deepCopy(undefined);
                assert.isOk(false);
            } catch(e) {
                assert.isOk(true);
            }
        });

        it('should clone from object', () => {
            let cloned = _.deepCopy({key1: 'value1', key2: 'value2'});
            assert.strictEqual(cloned.key1, 'value1');
            assert.strictEqual(cloned.key2, 'value2');
        });

        it('should clone from object including non-object value', () => {
            let cloned = _.deepCopy({key1: 1, key2: true, key3: null, key4: undefined});
            assert.strictEqual(cloned.key1, 1);
            assert.strictEqual(cloned.key2, true);
            assert.strictEqual(cloned.key3, null);
            assert.strictEqual(cloned.key4, undefined);

        });

        it('should be the different reference when cloning object', () => {
            let source = {key1: 'value1', key2: 'value2'};
            let cloned = _.deepCopy(source);
            cloned.key1 = 'value3';
            assert.strictEqual(source.key1, 'value1');
        });

        it('should clone from array', () => {
            let cloned = _.deepCopy(['val1', 'val2', 'val3']);
            assert.strictEqual(_.isArray(cloned), true);
            assert.strictEqual(cloned.length, 3);
            assert.strictEqual(cloned[0], 'val1');
            assert.strictEqual(cloned[1], 'val2');
            assert.strictEqual(cloned[2], 'val3');
        });

        it('should be the different reference when cloning array', () => {
            let source = ['val1', 'val2', 'val3'];
            let cloned = _.deepCopy(source);
            cloned[0] = 'differentVal1';
            cloned[1] = 'differentVal2';
            cloned[2] = 'differentVal3';
            assert.strictEqual(source[0], 'val1');
            assert.strictEqual(source[1], 'val2');
            assert.strictEqual(source[2], 'val3');
        });

        it('should clone from array including non-object value', () => {
            let cloned = _.deepCopy([1, true, null]);
            assert.strictEqual(_.isArray(cloned), true);
            assert.strictEqual(cloned.length, 3);
            assert.strictEqual(cloned[0], 1);
            assert.strictEqual(cloned[1], true);
            assert.strictEqual(cloned[2], null);
        });

        it('should return null if undefined in array', () => {
            let cloned = _.deepCopy([undefined]);
            assert.strictEqual(_.isArray(cloned), true);
            assert.strictEqual(cloned.length, 1);
            assert.strictEqual(cloned[0], null);
        });

        it('should return undefined if undefined in object', () => {
            let cloned = _.deepCopy({key: undefined});
            assert.strictEqual(cloned.key, undefined);
        });

        it('should clone from nested object', () => {
            let source = [
                'value1', {key2: 'value2'}, 1, true, null, undefined,
                {key3: 1, key4: true, key5: null, key6: undefined}
            ];
            let cloned = _.deepCopy(source);
            assert.strictEqual(cloned[0], 'value1');
            assert.strictEqual(cloned[1].key2, 'value2');
            assert.strictEqual(cloned[2], 1);
            assert.strictEqual(cloned[3], true);
            assert.strictEqual(cloned[4], null);
            assert.strictEqual(cloned[5], null);
            assert.strictEqual(cloned[6].key3, 1);
            assert.strictEqual(cloned[6].key4, true);
            assert.strictEqual(cloned[6].key5, null);
            assert.strictEqual(cloned[6].key6, undefined);
        });

    });

    describe('deleteProps()', () => {
        it('should delete property', () => {
            let deleted = _.deleteProps({key1: 'value1', key2: 'value2'}, ['key1']);
            assert.strictEqual(deleted.key1, undefined);
            assert.strictEqual(deleted.key2, 'value2');
        });

        it('should delete property even if last property', () => {
            let deleted = _.deleteProps({key1: 'value1'}, ['key1']);
            assert.strictEqual(deleted.key1, undefined);
            assert.notStrictEqual(deleted, null);
            assert.notStrictEqual(deleted, undefined);
        });

        it('should not fail if invalid property name', () => {
            let deleted = _.deleteProps({key1: 'value1'}, ['invalidKey']);
            assert.strictEqual(deleted.key1, 'value1');
        });

        it('should delete all properties', () => {
            let deleted = _.deleteProps(
                {key1: 'value1', key2: 'value2', key3: 'value3'},
                ['key1', 'key3']
            );
            assert.strictEqual(deleted.key1, undefined);
            assert.strictEqual(deleted.key2, 'value2');
            assert.strictEqual(deleted.key3, undefined);
        });

        it('should delete property of all elements', () => {
            let target = [
                {key1: 'value11', key2: 'value21'},
                {key1: 'value12', key2: 'value22'},
                {key1: 'value13', key2: 'value23'}
            ];
            let deleted = _.deleteProps(target, ['key1']);
            assert.strictEqual(target[0].key1, undefined);
            assert.strictEqual(target[0].key2, 'value21');
            assert.strictEqual(target[1].key1, undefined);
            assert.strictEqual(target[1].key2, 'value22');
            assert.strictEqual(target[2].key1, undefined);
            assert.strictEqual(target[2].key2, 'value23');
        });

        it('should delete property of all elements', () => {
            let target = [
                {key1: 'value11', key2: 'value21'},
                {key3: 'value12', key4: 'value22'},
                {key5: 'value13', key6: 'value23'}
            ];
            let deleted = _.deleteProps(target, ['key1']);
            assert.strictEqual(target[0].key1, undefined);
            assert.strictEqual(target[0].key2, 'value21');
            assert.strictEqual(target[1].key3, 'value12');
            assert.strictEqual(target[1].key4, 'value22');
            assert.strictEqual(target[2].key5, 'value13');
            assert.strictEqual(target[2].key6, 'value23');
        });

    });

    describe('reverseEach()', () => {
        it('should call element of array in reverse', () => {
            let test = '';
            _.reverseEach(['first', 'second', 'third'], (e) => {
                test += `${e}/`;
            });
            assert.strictEqual(test, 'third/second/first/');
        });
    });

    describe('arrayFrom()', () => {
        it('should generate array having this length', () => {
            let array = _.arrayFrom(3);
            assert.strictEqual(_.isArray(array), true);
            assert.strictEqual(array.length, 3);
            assert.strictEqual(array[0], 0);
            assert.strictEqual(array[1], 1);
            assert.strictEqual(array[2], 2);
        });

        it('should generate empty array if length is 0', () => {
            let array = _.arrayFrom(0);
            assert.strictEqual(_.isArray(array), true);
            assert.strictEqual(array.length, 0);
        });
    });

    describe('reduceInReverse()', () => {
        it('should call element of array in reverse', () => {
            let test = _.reduceInReverse(['first', 'second', 'third'], (combined, e) => {
                return `${combined}/${e}`
            }, 'initial');
            assert.strictEqual(test, 'initial/third/second/first');
        });

        it('should not be destructive', () => {
            let array = ['first', 'second', 'third'];
            _.reduceInReverse(array, (combined, e) => `${combined}/${e}`, '');

            assert.strictEqual(_.isArray(array), true);
            assert.strictEqual(array.length, 3);
            assert.strictEqual(array[0], 'first');
            assert.strictEqual(array[1], 'second');
            assert.strictEqual(array[2], 'third');
        });

    });

    describe('nestedEach()', () => {
        const appendString = (array1, array2) => {
            let ret = '';
            _.nestedEach(array1, array2, (e1, e2) => {
                ret += `${e1}-${e2}/`;
            });
            return ret;
        };

        it('should call each element of both arrays', () => {
            let appended = appendString(
                ['a', 'b', 'c'],
                ['1', '2', '3']
            );
            assert.strictEqual(appended, 'a-1/a-2/a-3/b-1/b-2/b-3/c-1/c-2/c-3/');
        });

        it('should not call if array1 is empty', () => {
            let appended = appendString(
                [],
                ['1', '2', '3']
            );
            assert.strictEqual(appended, '');

            appended = appendString(
                null,
                ['1', '2', '3']
            );
            assert.strictEqual(appended, '');

            appended = appendString(
                undefined,
                ['1', '2', '3']
            );
            assert.strictEqual(appended, '');
        });

        it('should not call if array2 is empty', () => {
            let appended = appendString(
                ['1', '2', '3'],
                []
            );
            assert.strictEqual(appended, '');

            appended = appendString(
                ['1', '2', '3'],
                null
            );
            assert.strictEqual(appended, '');

            appended = appendString(
                ['1', '2', '3'],
                undefined
            );
            assert.strictEqual(appended, '');
        });

        it('should not call if both array are empty', () => {
            let appended = appendString([], []);
            assert.strictEqual(appended, '');

            appended = appendString(null, null);
            assert.strictEqual(appended, '');

            appended = appendString(undefined, undefined);
            assert.strictEqual(appended, '');
        });
    });

    describe('splice()', () => {
        it('should remove each element valued as true by function', () => {
            let integers = [1, 2, 3, 4, 5, 6];
            let odd = _.splice(integers, (x) => (x % 2 === 0));
            assert.strictEqual(_.isArray(odd), true);
            assert.strictEqual(odd.length, 3);
            assert.strictEqual(odd[0], 1);
            assert.strictEqual(odd[1], 3);
            assert.strictEqual(odd[2], 5);
        });

        it('should not remove any element if returing false everytime', () => {
            let integers = [1, 2, 3, 4, 5, 6];
            let all = _.splice(integers, (x) => false);
            assert.strictEqual(_.isArray(all), true);
            assert.strictEqual(all.length, 6);
            assert.strictEqual(all[0], 1);
            assert.strictEqual(all[1], 2);
            assert.strictEqual(all[2], 3);
            assert.strictEqual(all[3], 4);
            assert.strictEqual(all[4], 5);
            assert.strictEqual(all[5], 6);
        });

        it('should remove all elements if returing true everytime', () => {
            let integers = [1, 2, 3, 4, 5, 6];
            let empty = _.splice(integers, (x) => true);
            assert.strictEqual(_.isArray(empty), true);
            assert.strictEqual(empty.length, 0);
        });
    });

    describe('containsAsPartial()', () => {

        it('should retrun true if matched exactly', () => {
            let keyword = ['keyword'];
            assert.strictEqual(_.containsAsPartial(keyword, 'keyword'), true);
        });

        it('should retrun true if matched partial', () => {
            let keyword = ['this is keyword. '];
            assert.strictEqual(_.containsAsPartial(keyword, 'keyword'), true);
        });

        it('should retrun false if not matched exactly', () => {
            let keyword = ['keyword'];
            assert.strictEqual(_.containsAsPartial(keyword, 'invalid word'), false);
        });

        it('should retrun true if some element is not matched exactly', () => {
            let keywords = ['keyword', 'keyword1', 'invalid word'];
            assert.strictEqual(_.containsAsPartial(keywords, 'keyword'), true);
        });

    });

    describe('count()', () => {
        it('should count up by value-funciton', () => {
            assert.strictEqual(
                _.count([1, 2, 3, 4, 5], (e) => (e % 2 === 0)),
                2
            );
        });

        it('should return zero if empty', () => {
            assert.strictEqual(_.count([], (e) => (e % 2 === 0)), 0);
        });

        it('should return zero if null', () => {
            assert.strictEqual(_.count(null, (e) => (e % 2 === 0)), 0);
        });

        it('should return zero if undefined', () => {
            assert.strictEqual(_.count(undefined, (e) => (e % 2 === 0)), 0);
        });
    });

    describe('sum()', () => {
        it('should sum up by value-funciton', () => {
            assert.strictEqual(
                _.sum([1, 2, 3, 4, 5], (e) => e*2),
                30
            );
        });

        it('should return zero if empty', () => {
            assert.strictEqual(_.sum([], (e) => e*2), 0);
        });

        it('should return zero if null', () => {
            assert.strictEqual(_.sum(null, (e) => e*2), 0);
        });

        it('should return zero if undefined', () => {
            assert.strictEqual(_.sum(undefined, (e) => e*2), 0);
        });
    });

    describe('consistOf()', () => {

        it('should return true if having single string property', () => {
            let testObj = {field1: 'value1', field2: 'value2', field3: 'value3'};
            assert.isOk(_.consistOf(testObj, 'field1'));
        });

        it('should return true if all elements have single string property', () => {
            let testArray = [{field1: 'value1', field2: 'value2', field3: 'value3'}];
            assert.isOk(_.consistOf(testArray, 'field1'));
        });

        it('should return true if all elements have single string property', () => {
            let testArray = [
                {field1: 'value1', field2: 'value2', field3: 'value3'},
                {field1: 'value1', field4: 'value4', field5: 'value5'}
            ];
            assert.isOk(_.consistOf(testArray, 'field1'));
        });

        it('should return true if having single string property as null', () => {
            let testObj = {field1: null, field2: 'value2', field3: 'value3'};
            assert.isOk(_.consistOf(testObj, 'field1'));
        });

        it('should return true if all elements have single string property as null', () => {
            let testArray = [{field1: null, field2: 'value2', field3: 'value3'}];
            assert.isOk(_.consistOf(testArray, 'field1'));
        });

        it('should return true if all elements have string property as null', () => {
            let testArray = [
                {field1: null, field2: 'value2', field3: 'value3'},
                {field1: null, field4: 'value4', field5: 'value5'}
            ];
            assert.isOk(_.consistOf(testArray, 'field1'));
        });

        it('should return true if having single string property as undefined', () => {
            let testObj = {field1: undefined, field2: 'value2', field3: 'value3'};
            assert.isOk(_.consistOf(testObj, 'field1'));
        });

        it('should return true if all elements have single string property as undefined', () => {
            let testArray = [{field1: undefined, field2: 'value2', field3: 'value3'}];
            assert.isOk(_.consistOf(testArray, 'field1'));
        });

        it('should return true if all elements have single string property as undefined', () => {
            let testArray = [
                {field1: undefined, field2: 'value2', field3: 'value3'},
                {field1: undefined, field4: 'value4', field5: 'value5'}
            ];
            assert.isOk(_.consistOf(testArray, 'field1'));
        });

        it('should return false if not having single string property', () => {
            let testObj = {field1: 'value1', field2: 'value2', field3: 'value3'};
            assert.isNotOk(_.consistOf(testObj, 'invalidField'));
        });

        it('should return false if element doesn\'t have single string property', () => {
            let testArray = [{field1: 'value1', field2: 'value2', field3: 'value3'}];
            assert.isNotOk(_.consistOf(testArray, 'invalidField'));
        });

        it('should return false if element doesn\'t have single string property', () => {
            let testArray = [
                {field1: 'value1', field2: 'value2', field3: 'value3'},
                {field1: 'value1', field2: 'value2', field3: 'value3'}
            ];
            assert.isNotOk(_.consistOf(testArray, 'invalidField'));
        });

        it('should return false if element doesn\'t have single string property', () => {
            let testArray = [
                {field1: 'value1', field2: 'value2', field3: 'value3', fieldX: 'valueX'},
                {field1: 'value1', field2: 'value2', field3: 'value3'}
            ];
            assert.isNotOk(_.consistOf(testArray, 'fieldX'));
        });

        it('should return false if element doesn\'t have single string property', () => {
            let testArray = [
                {field1: 'value1', field2: 'value2', field3: 'value3'},
                {field1: 'value1', field2: 'value2', field3: 'value3', fieldX: 'valueX'}
            ];
            assert.isNotOk(_.consistOf(testArray, 'fieldX'));
        });

        it('should return true if element have all properies', () => {
            let testObj = {field1: 'value1', field2: 'value2', field3: 'value3'};
            assert.isOk(_.consistOf(testObj, ['field1', 'field2', 'field3']));
        });

        it('should return true if all elements have all properies', () => {
            let testArray = [{field1: 'value1', field2: 'value2', field3: 'value3'}];
            assert.isOk(_.consistOf(testArray, ['field1', 'field2', 'field3']));
        });

        it('should return true if all elements have all properies', () => {
            let testArray = [
                {field1: 'value1', field2: 'value2', field3: 'value3'},
                {field1: 'value1', field2: 'value2', field3: 'value3'}
            ];
            assert.isOk(_.consistOf(testArray, ['field1', 'field2', 'field3']));
        });

        it('should return false if not having at least one', () => {
            let testObj = {field1: 'value1', field2: 'value2', field3: 'value3'};
            assert.isNotOk(_.consistOf(testObj, ['field1', 'field2', 'field3', 'invalidField']));
        });

        it('should return false if element doesn\'t have at least one', () => {
            let testArray = [{field1: 'value1', field2: 'value2', field3: 'value3'}];
            assert.isNotOk(_.consistOf(testArray, ['field1', 'field2', 'field3', 'invalidField']));
        });

        it('should return false if element doesn\'t have at least one', () => {
            let testArray = [
                {field1: 'value1', field2: 'value2', field3: 'value3'},
                {field1: 'value1', field2: 'value2', field3: 'value3'}
            ];
            assert.isNotOk(_.consistOf(testArray, ['field1', 'field2', 'field3', 'invalidField']));
        });

        it('should return true if having nested property', () => {
            let testObj = {
                field1: {field2: 'value2'}
            };
            assert.isOk(_.consistOf(testObj, {field1: 'field2'}));
        });

        it('should return true if element doesn\'t have nested property', () => {
            let testArray = [{
                field1: {field2: 'value2'}
            }];
            assert.isOk(_.consistOf(testArray, {field1: 'field2'}));
        });

        it('should return true if element doesn\'t have nested property', () => {
            let testArray = [
                {field1: {field2: 'value2'}},
                {field1: {field2: 'value2'}}
            ];
            assert.isOk(_.consistOf(testArray, {field1: 'field2'}));
        });

        it('should return true if having nested property in array', () => {
            let testObj = {
                field1: {field2: 'value2'}
            };
            assert.isOk(_.consistOf(testObj, [{field1: 'field2'}]));
        });

        it('should return true if element has nested property in array', () => {
            let testArray = [{
                field1: {field2: 'value2'}
            }];
            assert.isOk(_.consistOf(testArray, [{field1: 'field2'}]));
        });

        it('should return true if element has nested property in array', () => {
            let testArray = [
                {field1: {field2: 'value2'}},
                {field1: {field2: 'value2'}}
            ];
            assert.isOk(_.consistOf(testArray, [{field1: 'field2'}]));
        });

        it('should return true if having nested property in array', () => {
            let testObj = {
                field1: 'value1',
                field2: {field3: 'value3'}
            };
            assert.isOk(_.consistOf(testObj, ['field1', {field2: 'field3'}]));
        });

        it('should return true if element has nested property in array', () => {
            let testArray = [{
                field1: 'value1',
                field2: {field3: 'value3'}
            }];
            assert.isOk(_.consistOf(testArray, ['field1', {field2: 'field3'}]));
        });

        it('should return true if element has nested property in array', () => {
            let testArray = [
                {field1: 'value1', field2: {field3: 'value3'}},
                {field1: 'value1', field2: {field3: 'value3'}}
            ];
            assert.isOk(_.consistOf(testArray, ['field1', {field2: 'field3'}]));
        });

        it('should return true if having nested property in array', () => {
            let testObj = {
                field1: 'value1',
                field2: {
                    field3: 'value3',
                    field4: 'value4',
                    field5: 'value5'
                }
            };
            assert.isOk(_.consistOf(testObj, ['field1', {field2: ['field3', 'field4', 'field5']}]));
        });

        it('should return true if element has nested property in array', () => {
            let testArray = [{
                field1: 'value1',
                field2: {
                    field3: 'value3',
                    field4: 'value4',
                    field5: 'value5'
                }
            }];
            assert.isOk(
                _.consistOf(testArray, ['field1', {field2: ['field3', 'field4', 'field5']}])
            );
        });

        it('should return true if element has nested property in array', () => {
            let testArray = [
                {
                    field1: 'value1',
                    field2: {
                        field3: 'value3',
                        field4: 'value4',
                        field5: 'value5'
                    }
                },
                {
                    field1: 'value1',
                    field2: {
                        field3: 'value3',
                        field4: 'value4',
                        field5: 'value5'
                    }
                }
            ];
            assert.isOk(
                _.consistOf(testArray, ['field1', {field2: ['field3', 'field4', 'field5']}])
            );
        });
    });

    describe('includeString()', () => {
        it('should return true if including string', () => {
            assert.strictEqual(_.includeString('this is keyword', 'keyword'), true);
        });
        it('should return false if not including string', () => {
            assert.strictEqual(_.includeString('this is keyword', 'invalid word'), false);
        });

        it('should not fail if empty string', () => {
            assert.strictEqual(_.includeString('', 'invalid word'), false);
        });

        it('should return false if keyword is empty', () => {
            assert.strictEqual(_.includeString('this is keyword', ''), false);
        });

        it('should return false if keyword is null', () => {
            assert.strictEqual(_.includeString('this is keyword', null), false);
        });

        it('should return false if keyword is undefined', () => {
            assert.strictEqual(_.includeString('this is keyword', undefined), false);
        });

    })
});
/**
 * * test_spreadsheet.js
 * * Test code for spreadsheet
 * * @author Satoshi Haga
 * * @date 2015/10/10
 **/
'use strict';

var path = require('path');
var cwd = path.resolve('');
var assert = require('assert');
var JSZip = require('jszip');
var SpreadSheet = require(cwd + '/lib/spreadsheet');
require(cwd + '/lib/underscore_mixin');
var Promise = require('bluebird');
var readYamlAsync = Promise.promisify(require('read-yaml'));
var fs = Promise.promisifyAll(require('fs'));
var _ = require('underscore');

module.exports = {
    checkLoadWithNoParameterShouldReturnError: function checkLoadWithNoParameterShouldReturnError() {
        return new SpreadSheet().load().then(function () {
            throw new Error('test_load_with_no_parameter_should_return_error failed ');
        })['catch'](function (err) {
            assert.equal(err, 'First parameter must be JSZip instance including MS-Excel data');
        });
    },

    checkLoadShouldReturnThisInstance: function checkLoadShouldReturnThisInstance() {
        return fs.readFileAsync(__dirname + '/../templates/Template.xlsx').then(function (validTemplate) {
            return new SpreadSheet().load(new JSZip(validTemplate));
        }).then(function (spreadsheet) {
            assert(spreadsheet instanceof SpreadSheet, 'SpreadSheet#load() should return this instance');
        });
    },

    checkLoadEachMemberFromValidTemplate: function checkLoadEachMemberFromValidTemplate() {
        return fs.readFileAsync(__dirname + '/../templates/Template.xlsx').then(function (validTemplate) {
            return new SpreadSheet().load(new JSZip(validTemplate));
        }).then(function (spreadsheet) {

            //excel
            assert(spreadsheet.excel instanceof JSZip, 'SpreadSheet#excel is not assigned correctly');

            //check if each variables is parsed or not.
            var variables = ['AccountName__c', 'StartDateFormat__c', 'EndDateFormat__c', 'JobDescription__c', 'StartTime__c', 'EndTime__c', 'hasOverTime__c', 'HoliDayType__c', 'Salary__c', 'DueDate__c', 'SalaryDate__c', 'AccountName__c', 'AccountAddress__c'];
            var chkCommonStringsWithVariable = _.map(spreadsheet.commonStringsWithVariable, function (e) {
                return _(e.t).stringValue();
            });
            _.each(variables, function (e) {
                //variables
                assert(_.contains(spreadsheet.variables, e), 'SpreadSheet#load() doesn\'t set up ' + e + ' as variable correctly');
                assert(_.find(chkCommonStringsWithVariable, function (v) {
                    return v.indexOf('{{' + e + '}}') !== -1;
                }), 'SpreadSheet#load() doesn\'t set up ' + e + ' as variable correctly');
            });
        });
    },

    simpleMergeWithNoParameterShouldReturnError: function simpleMergeWithNoParameterShouldReturnError() {
        return fs.readFileAsync(__dirname + '/../templates/Template.xlsx').then(function (validTemplate) {
            return new SpreadSheet().load(new JSZip(validTemplate));
        }).then(function (spreadsheet) {
            return spreadsheet.simpleMerge();
        }).then(function () {
            throw new Error('simpleMergeWithNoParameterShouldReturnError failed ');
        })['catch'](function (err) {
            assert.equal(err, 'simpleMerge() must has parameter');
        });
    },

    checkIfSimpleMergeRendersCorrectly: function checkIfSimpleMergeRendersCorrectly() {
        return fs.readFileAsync(__dirname + '/../templates/Template.xlsx').then(function (validTemplate) {
            return new SpreadSheet().load(new JSZip(validTemplate));
        }).then(function (spreadsheet) {
            return spreadsheet.simpleMerge({ AccountName__c: 'hoge account', AccountAddress__c: 'hoge street' });
        }).then(function (excelData) {
            return new SpreadSheet().load(new JSZip(excelData));
        }).then(function (spreadsheet) {
            assert(spreadsheet.variables.length === 0, "SpreadSheet#simpleMerge() doesn't work correctly");
            assert(spreadsheet.hasAsSharedString('hoge account'), "'hoge account' is not rendered by SpreadSheet#simpleMerge()");
            assert(spreadsheet.hasAsSharedString('hoge street'), "'hoge street' is not rendered by SpreadSheet#simpleMerge()");
        });
    },

    bulkMergeMultiFileNoParameterShouldReturnError: function bulkMergeMultiFileNoParameterShouldReturnError() {
        return fs.readFileAsync(__dirname + '/../templates/Template.xlsx').then(function (validTemplate) {
            return new SpreadSheet().load(new JSZip(validTemplate));
        }).then(function (spreadsheet) {
            return spreadsheet.bulkMergeMultiFile();
        }).then(function () {
            throw new Error('bulkMergeMultiFile_no_parameter_should_return_error failed ');
        })['catch'](function (err) {
            assert.equal(err, 'bulkMergeMultiFile() has only array object');
        });
    },

    bulkMergeMultiFileMustHaveArrayAsParameter: function bulkMergeMultiFileMustHaveArrayAsParameter() {
        return fs.readFileAsync(__dirname + '/../templates/Template.xlsx').then(function (validTemplate) {
            return new SpreadSheet().load(new JSZip(validTemplate));
        }).then(function (spreadsheet) {
            return spreadsheet.bulkMergeMultiFile({ name: 'hogehoge' });
        }).then(function () {
            throw new Error('bulkMergeMultiFile_must_have_array_as_parameter failed ');
        })['catch'](function (err) {
            assert.equal(err, 'bulkMergeMultiFile() has only array object');
        });
    },

    bulkMergeMultiFileMustHaveNameAndData: function bulkMergeMultiFileMustHaveNameAndData() {
        return fs.readFileAsync(__dirname + '/../templates/Template.xlsx').then(function (validTemplate) {
            return new SpreadSheet().load(new JSZip(validTemplate));
        }).then(function (spreadsheet) {
            return spreadsheet.bulkMergeMultiFile([{ name: 'hogehoge' }]);
        }).then(function () {
            throw new Error('bulkMergeMultiFile_must_have_name_and_data failed ');
        })['catch'](function (err) {
            assert.equal(err, 'bulkMergeMultiFile() is called with invalid parameter');
        });
    },

    checkIfBulkMergeMultiFileRendersCorrectly: function checkIfBulkMergeMultiFileRendersCorrectly() {
        return fs.readFileAsync(__dirname + '/../templates/Template.xlsx').then(function (validTemplate) {
            return new SpreadSheet().load(new JSZip(validTemplate));
        }).then(function (spreadsheet) {
            return spreadsheet.bulkMergeMultiFile([{ name: 'file1.xlsx', data: { AccountName__c: 'hoge account1', AccountAddress__c: 'hoge street1' } }, { name: 'file2.xlsx', data: { AccountName__c: 'hoge account2', AccountAddress__c: 'hoge street2' } }, { name: 'file3.xlsx', data: { AccountName__c: 'hoge account3', AccountAddress__c: 'hoge street3' } }]);
        }).then(function (zipData) {
            var zip = new JSZip(zipData);
            var excel1 = zip.file('file1.xlsx').asArrayBuffer();
            var excel2 = zip.file('file2.xlsx').asArrayBuffer();
            var excel3 = zip.file('file3.xlsx').asArrayBuffer();
            return Promise.props({
                sp1: new SpreadSheet().load(new JSZip(excel1)),
                sp2: new SpreadSheet().load(new JSZip(excel2)),
                sp3: new SpreadSheet().load(new JSZip(excel3))
            }).then(function (_ref) {
                var sp1 = _ref.sp1;
                var sp2 = _ref.sp2;
                var sp3 = _ref.sp3;

                assert(sp1.hasAsSharedString('hoge account1'), "'hoge account1' is missing in excel file");
                assert(sp1.hasAsSharedString('hoge street1'), "'hoge street1' is missing in excel file");
                assert(sp2.hasAsSharedString('hoge account2'), "'hoge account2' is missing in excel file");
                assert(sp2.hasAsSharedString('hoge street2'), "'hoge street2' is missing in excel file");
                assert(sp3.hasAsSharedString('hoge account3'), "'hoge account3' is missing in excel file");
                assert(sp3.hasAsSharedString('hoge street3'), "'hoge street3' is missing in excel file");
            });
        });
    },

    addSheetBindingDataWithNoParameterShouldReturnError: function addSheetBindingDataWithNoParameterShouldReturnError() {
        return fs.readFileAsync(__dirname + '/../templates/Template.xlsx').then(function (validTemplate) {
            return new SpreadSheet().load(new JSZip(validTemplate));
        }).then(function (spreadsheet) {
            return spreadsheet.addSheetBindingData();
        }).then(function () {
            throw new Error('addSheetBindingData_with_no_parameter_should_return_error failed ');
        })['catch'](function (err) {
            assert.equal(err, 'addSheetBindingData() needs to have 2 paramter.');
        });
    },

    addSheetBindingDataWith1ParameterShouldReturnError: function addSheetBindingDataWith1ParameterShouldReturnError() {
        return fs.readFileAsync(__dirname + '/../templates/Template.xlsx').then(function (validTemplate) {
            return new SpreadSheet().load(new JSZip(validTemplate));
        }).then(function (spreadsheet) {
            return spreadsheet.addSheetBindingData('hoge');
        }).then(function () {
            throw new Error('addSheetBindingData_with_no_parameter_should_return_error failed ');
        })['catch'](function (err) {
            assert.equal(err, 'addSheetBindingData() needs to have 2 paramter.');
        });
    },

    activateSheetWithNoParameterShouldReturnError: function activateSheetWithNoParameterShouldReturnError() {
        return fs.readFileAsync(__dirname + '/../templates/Template.xlsx').then(function (validTemplate) {
            return new SpreadSheet().load(new JSZip(validTemplate));
        }).then(function (spreadsheet) {
            return spreadsheet.activateSheet();
        }).then(function () {
            throw new Error('activateSheet_with_no_parameter_should_return_error failed ');
        })['catch'](function (err) {
            assert.equal(err, 'activateSheet() needs to have 1 paramter.');
        });
    },

    activateSheetWithInvalidSheetnameShouldReturnError: function activateSheetWithInvalidSheetnameShouldReturnError() {
        return fs.readFileAsync(__dirname + '/../templates/Template.xlsx').then(function (valid_template) {
            return new SpreadSheet().load(new JSZip(valid_template));
        }).then(function (spreadsheet) {
            return spreadsheet.activateSheet('hoge');
        }).then(function () {
            throw new Error('activateSheet_with_no_parameter_should_return_error failed ');
        })['catch'](function (err) {
            assert.equal(err, "Invalid sheet name 'hoge'.");
        });
    },

    deleteSheetWithNoParameterShouldReturnError: function deleteSheetWithNoParameterShouldReturnError() {
        return fs.readFileAsync(__dirname + '/../templates/Template.xlsx').then(function (valid_template) {
            return new SpreadSheet().load(new JSZip(valid_template));
        }).then(function (spreadsheet) {
            return spreadsheet.deleteSheet();
        }).then(function () {
            throw new Error('deleteSheet_with_no_parameter_should_return_error failed ');
        })['catch'](function (err) {
            assert.equal(err, 'deleteSheet() needs to have 1 paramter.');
        });
    },

    deleteSheetWithInvalidSheetnameShouldReturnError: function deleteSheetWithInvalidSheetnameShouldReturnError() {
        return fs.readFileAsync(__dirname + '/../templates/Template.xlsx').then(function (valid_template) {
            return new SpreadSheet().load(new JSZip(valid_template));
        }).then(function (spreadsheet) {
            return spreadsheet.deleteSheet('hoge');
        }).then(function () {
            throw new Error('deleteSheet_with_invalid_sheetname_should_return_error failed ');
        })['catch'](function (err) {
            assert.equal(err, "Invalid sheet name 'hoge'.");
        });
    }
};
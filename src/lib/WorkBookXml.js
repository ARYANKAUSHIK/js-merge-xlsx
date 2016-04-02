/**
 * WorkBookXml.js
 * Manage 'xl/workbook.xml'
 * @author Satoshi Haga
 * @date 2016/04/02
 */

const _ = require('underscore');

class WorkBookXml {

    constructor(workBookXml) {
        this.workBookXml = workBookXml;
        this.sheetDefinitions = workBookXml.workbook.sheets[0].sheet;
    }

    valueWorkBookXml() {
        this.workBookXml.workbook.sheets[0].sheet = this.sheetDefinitions;
        return this.workBookXml;
    }

    addSheetDefinition(sheetName, sheetId) {
        this.sheetDefinitions.push(
            { '$':
                { name: sheetName,
                    sheetId: sheetId.replace('rId',''),
                    'r:id': sheetId
                }
            }
        );
    }

    deleteSheetDefinition(sheetName) {
        _.each(this.sheetDefinitions, (sheet, index) => {
            if(sheet && (sheet['$'].name === sheetName)) {
                this.sheetDefinitions.splice(index,1);
            }
        });
    }

    findSheetId(sheetName) {
        let sheet = _.find(this.sheetDefinitions, (e)=> (e['$'].name === sheetName));
        if(!sheet){
            return null;
        }
        return sheet['$']['r:id'];
    }

    firstSheetName() {
        return this.sheetDefinitions[0]['$'].name;
    }
}

module.exports = WorkBookXml;
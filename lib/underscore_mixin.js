/**
 * * underscore mixin
 * * @author Satoshi Haga
 * * @date 2015/10/03
 **/

'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _mustache = require('mustache');

var _mustache2 = _interopRequireDefault(_mustache);

_underscore2['default'].mixin({
    string_value: function string_value(xml2js_element) {
        if (!_underscore2['default'].isArray(xml2js_element)) {
            return xml2js_element;
        }
        if (xml2js_element[0]._) {
            return xml2js_element[0]._;
        }
        return xml2js_element[0];
    },
    variables: function variables(template) {
        return _underscore2['default'].map(_underscore2['default'].filter(_mustache2['default'].parse(template), function (e) {
            return e[0] === 'name';
        }), function (e) {
            return e[1];
        });
    },
    has_variable: function has_variable(tempalte) {
        return (0, _underscore2['default'])(tempalte).variables().length !== 0;
    },
    render: function render(template, bind_data) {
        return _mustache2['default'].render(template, bind_data);
    }
});
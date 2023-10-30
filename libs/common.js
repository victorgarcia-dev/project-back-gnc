var path = require('path');
var fs   = require('fs');

module.exports.hasRequired = function(required,data,checkLength) {
    if (typeof checkLength === 'undefined') checkLength = false;
    var MissingRequiredException = {};
    var success = true;
    try {
        required.forEach(function(r){
            if (!Object.hasOwnProperty.call(data,r) || data[r] === null) throw MissingRequiredException;
            if (checkLength && (typeof data[r] === 'string' || Array.isArray(data[r])) && !data[r].length) throw MissingRequiredException;
        });
    }
    catch (err) {
        success = (err !== MissingRequiredException);
    }
    return success;
};

module.exports.errorResponse = function(err,res) {
    console.log(err);
    return res.status(err.status?err.status:500).json({success: false, error: err.error?err.error:'Server Error'});
};

module.exports.parseQueryFilters = function(filters, defaultFields, forbiddenFields, searchIn, searchableFields) {

    filters = filters||{};
    defaultFields = defaultFields||{_id:1};
    searchIn = searchIn||[];
    searchableFields = searchableFields||[];

    var limit = 50;
    var skip = limit*page;

    var filter = {};
    var sort = {};
    var fields = {};
    var page = 1;
    var emptyFields = true;
    var values,i,propNameCutted,searchInItem,regex;

    for (var propName in filters) {
        if (propName == "sort") {
            var sfields = filters[propName].split(',');
            sfields.forEach(function(field) {
                if (field[0] == "-") {
                    field = field.substring(1);
                    sort[field] = -1;
                } else if (field[0] == "+") {
                    field = field.substring(1);
                    sort[field] = 1;
                } else {
                    sort[field] = 1;
                }
            });
        }
        else if (propName == "fields") {
            var ffields = filters[propName].split(',');
            ffields.forEach(function(field) {
                emptyFields = false;
                fields[field] = 1;
            });
        }
        else if (propName == "additionalFields") {
            continue;
        }
        else if (propName == "page") {
            page = parseInt(filters[propName]);
        }
        else if (propName == "limit") {
            limit = parseInt(filters[propName]);
        }
        else if (propName == "searchText" && searchIn.length) {
            if (!filter.hasOwnProperty('$or')) filter['$or'] = [];
            searchIn.forEach(function(item) {
                if (searchableFields.indexOf(itme) < 0) return;
                searchInItem = {};
                // regex = new RegExp(filters[propName], 'i');
                var toRegex = filters[propName]
                    .replace(/[aá]/i,'[aá]')
                    .replace(/[eé]/i,'[eé]')
                    .replace(/[ií]/i,'[ií]')
                    .replace(/[oó]/i,'[oó]')
                    .replace(/[uúü]/i,'[uúü]');
                regex = new RegExp(toRegex, 'i');
                searchInItem[item] = { '$regex': regex };
                filter['$or'].push(searchInItem);
            });
        }
        else {
            // vemos si termina con uno de los operadores >(mayor), <(menor), ~(like), -(not), @(in: comma-separated), !(not in: comma-separated)
            if (propName[propName.length-1] == "<") {
                propNameCutted = propName.substring(0, propName.length-1);
                filter[propNameCutted] = {'$lte':filters[propName]};
            }
            else if (propName[propName.length-1] == ">") {
                propNameCutted = propName.substring(0, propName.length-1);
                filter[propNameCutted] = {'$gte':filters[propName]};
            }
            else if (propName[propName.length-1] == "~") {
                propNameCutted = propName.substring(0, propName.length-1);
                filter[propNameCutted] = {'$regex':filters[propName]};
            }
            else if (propName[propName.length-1] == "-") {
                propNameCutted = propName.substring(0, propName.length-1);
                filter[propNameCutted] = {'$not':filters[propName]};
            }
            else if (propName[propName.length-1] == "@") {
                propNameCutted = propName.substring(0, propName.length-1);
                values = filters[propName].split(',');
                filter[propNameCutted] = {'$in':values};
            }
            else if (propName[propName.length-1] == "!") {
                propNameCutted = propName.substring(0, propName.length-1);
                values = filters[propName].split(',');
                filter[propNameCutted] = {'$nin':values};
            }
            else {
                filter[propName] = filters[propName];
            }
        }
    }

    if (emptyFields) {
        fields = defaultFields;
        if (filters.hasOwnProperty('additionalFields')) {
            filters.additionalFields.split(',').forEach(function(additionalField) {
                fields[additionalField] = 1;
            });
        }
    }

    if (page < 1) page = 1;
    if (limit < 0) limit = 1000;

    forbiddenFields.forEach(function(f){
        if (typeof fields[f] !== 'undefined') delete fields[f];
        if (typeof filter[f] !== 'undefined') delete filter[f];
    });

    return { filter:filter, fields:fields, page:page, limit:limit, sort:sort };
};

module.exports.unlinkUploadedFiles = function(files) {
    files.forEach(function(file){
        try { fs.unlinkSync(file.path); } catch (err) { console.log('error on fs.unlinkSync'); console.log(err); }
    });
};

module.exports.makeCode = function(length,type) {
    if (typeof type === 'undefined') var type = 'numeric';
    var text = '';
    var possible = {
        alphanumeric: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
        numeric: '0123456789',
        complex: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ_#$%abcdefghijklmnopqrstuvwxyz_#$%0123456789_#$%',
    };
    for (var i=0; i<length; i++) {
        text += possible[type].charAt(Math.floor(Math.random() * possible[type].length));
    }
    return text;
};

module.exports.makeSalt = function() {
    return Math.round((new Date().valueOf() * Math.random())) + '';
};

module.exports.validatePresenceOf = function(value) {
    return value && value.length;
};

// Create a new object, that prototypally inherits from the Error constructor.
function MyError(code, message) {
    Error.call(this);
    Error.captureStackTrace(this);
    this.name = message || 'MyError';
    this.message = message || 'Server Error';
    this.code = code;
    this.status = code;
    this.statusCode = code;
    this.error = message;
}
MyError.prototype = Object.create(Error.prototype);
MyError.prototype.constructor = MyError;
module.exports.MyError = MyError;

'use strict';

var request = require('request');
var util = require('util');
var _ = require('lodash');
var async = require('async');

/**
 Validates integration options

 @param options
 @returns {{errors: (string|Array.<T>)}}
 @private
 */
var _validateOptions = function (options) {
    let errors = _validateStringOption(options, 'username').concat(
        _validateStringOption(options, 'password'),
        _validateStringOption(options, 'url'),
        _validateStringOption(options, 'project'));

    if(errors.length > 0){
        return {errors:errors};
    }else{
        return;
    }

};

var _validateStringOption = function (options, key) {
    let errors = [];

    if (!_.isString(options[key])) {
        errors.push(_createOptionsErrorObject('The integration option `' + key + '`', key));
    }

    if (options[key].length === 0) {
        errors.push(_createOptionsErrorObject('The integration option `' + key + '` must be at least 1 character', key));
    }

    return errors;
};

var _createJsonErrorObject = function(msg, pointer, httpCode, code, title){
    let error = {
        detail: msg,
        status: httpCode.toString(),
        title: title,
        code: 'POOLPARTY_' + code.toString()
    };

    if(pointer){
        error.source = {
            pointer: pointer
        };
    }

    return error;
};

var _createOptionsErrorObject = function (msg, pointer) {
    return _createJsonErrorObject(msg, pointer, '422', '1A', 'PoolParty Option Validation Failed');
};

var _lookupEntity = function (entity, options, done) {
    let query = "PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#> \
         PREFIX skos:<http://www.w3.org/2004/02/skos/core#> \
         SELECT DISTINCT ?Concept ?prefLabel \
         WHERE \
         { ?Concept ?x skos:Concept . \
         { ?Concept skos:prefLabel ?prefLabel . FILTER (regex(str(?prefLabel), '" + entity.value + "', 'i'))  } \
         } ORDER BY ?prefLabel LIMIT 50 OFFSET 0";

    let uri = options.url + "/PoolParty/sparql/" +
        options.project + "?query=" + encodeURIComponent(query) + "&content-type=application%2Fjson";

    request({
        uri: uri,
        method: 'GET',
        auth: {
            user: options.username,
            password: options.password
        },
        json: true
    }, function (err, response, body) {
        if (err) {
            done(_createJsonErrorObject(err, null, '500', '2A', 'PoolParty HTTP Request Failed'));
            return;
        }

        if (response.statusCode !== 200) {
            if(response.statusCode === 401){
                done(_createJsonErrorObject(typeof body.message === 'undefined' ? 'No Message in Response' : body.message,
                    null, response.statusCode, '2B', 'PoolParty Authentication Failed'));
            }else{
                done(_createJsonErrorObject(typeof body.message === 'undefined' ? 'No Message in Response' : body.message,
                    null, response.statusCode, '2C', 'PoolParty Entity Lookup Failed'));
            }
            return;
        }

        done(null, body);
    });
};

var _lookupDefinitions = function (conceptUrls, options, done) {
    let details = {};
    async.eachLimit(conceptUrls, 5, function (url, eachLimitCallback) {
        let uri = options.url + "/PoolParty/api/thesaurus/" + options.project + "/concept?concept=" + url +
            "&properties=all";

        request({
            uri: uri,
            method: 'GET',
            auth: {
                user: options.username,
                password: options.password
            },
            json: true
        }, function (err, response, body) {

            console.info("DEFINITION LOOKUP BODY:");
            console.info(JSON.stringify(body, null, 4));

            if (err) {
                eachLimitCallback(_createJsonErrorObject(err, null, '500', '3A', 'PoolParty HTTP Request Failed'));
                return;
            }

            if (response.statusCode !== 200) {
                if(response.statusCode === 401){
                    eachLimitCallback(_createJsonErrorObject(typeof body.message === 'undefined' ? 'No Message in Response' : body.message,
                        null, response.statusCode, '3B', 'PoolParty Authentication Failed'));
                }else{
                    eachLimitCallback(_createJsonErrorObject(typeof body.message === 'undefined' ? 'No Message in Response' : body.message,
                        null, response.statusCode, '3C', 'PoolParty Definition Lookup Failed'));
                }
                return;
            }

            let definition = '[No Definition Provided]';
            let prefLabel = body.prefLabel;

            if (typeof body !== 'undefined' && Array.isArray(body.definitions)) {
                definition = response.body.definitions[0];
            }

            details[prefLabel] = definition;
            eachLimitCallback(null);
        });
    }, function (err) {
        done(err, details);
    });
};


var doLookup = function (entities, options, cb) {

    let errors = _validateOptions(options);
    if (errors) {
        cb(errors);
        return;
    }

    var lookupResults = [];

    async.each(entities, function (entity, done) {
        _lookupEntity(entity, options, function (err, body) {
            if (err) {
                done(err);
                return;
            }

            var tags = [];
            var conceptUrls = [];

            console.info("LOOKUP ENTITY RESULT:");
            console.info(JSON.stringify(body, null, 4));

            _.each(body.results.bindings, function (binding) {
                conceptUrls.push(binding.Concept.value);
                tags.push(binding.prefLabel.value);
            });

            _lookupDefinitions(conceptUrls, options, function (err, details) {
                if (err) {
                    done(err);
                    return;
                }

                console.info("LOOKUP DETAILS RESULT:");
                console.info(JSON.stringify(details, null, 4));

                if (tags.length > 0) {
                    console.info("PUSHING LOOKUP RESULTS");
                    lookupResults.push({
                        entity: entity.value,
                        result: {
                            entity_name: entity.value,
                            //the tags for summary
                            tags: tags.splice(0, 5),
                            //Add the results object as the details
                            details: details
                        }
                    });
                }

                done(null);
            });
        });
    }, function (err) {
        cb(err, lookupResults.length, lookupResults);
    });
};

module.exports = {
    doLookup: doLookup
};
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

    if (errors.length > 0) {
        return {errors: errors};
    } else {
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

/**
 * Helper method that creates a fully formed JSON payload for a single error
 * @param msg
 * @param pointer
 * @param httpCode
 * @param code
 * @param title
 * @returns {{errors: *[]}}
 * @private
 */
var _createJsonErrorPayload = function (msg, pointer, httpCode, code, title, meta) {
    return {
        errors: [
            _createJsonErrorObject(msg, pointer, httpCode, code, title, meta)
        ]
    }
};

var _createJsonErrorObject = function (msg, pointer, httpCode, code, title, meta) {
    let error = {
        detail: msg,
        status: httpCode.toString(),
        title: title,
        code: 'POOLPARTY_' + code.toString()
    };

    if (pointer) {
        error.source = {
            pointer: pointer
        };
    }

    if (meta) {
        error.meta = meta;
    }

    return error;
};

var _createOptionsErrorObject = function (msg, pointer) {
    return _createJsonErrorObject(msg, pointer, '422', '1A', 'PoolParty Option Validation Failed');
};

var _lookupEntity = function (entity, options, done) {
    // let query = "PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#> \
    //      PREFIX skos:<http://www.w3.org/2004/02/skos/core#> \
    //      SELECT DISTINCT ?Concept ?prefLabel \
    //      WHERE \
    //      { ?Concept ?x skos:Concept . \
    //      { ?Concept skos:prefLabel ?prefLabel . FILTER (regex(str(?prefLabel), '" + entity.value + "', 'i'))  } \
    //      } ORDER BY ?prefLabel LIMIT 50 OFFSET 0";


    let query = "PREFIX skos:<http://www.w3.org/2004/02/skos/core#> \
        SELECT DISTINCT ?Concept ?prefLabel ?definition ?broaderConcept  ?broaderPrefLabel ?narrowerConcept \
         ?narrowerPrefLabel ?relatedConcept ?relatedPrefLabel \
            WHERE{ \
            ?Concept ?x skos:Concept . \
            { \
                ?Concept skos:prefLabel ?prefLabel . FILTER (regex(str(?prefLabel), '" + entity.value + "', 'i')) \
            } \
            OPTIONAL { \
                ?Concept skos:definition ?definition . \
        } \
            OPTIONAL { \
                ?Concept skos:broader ?broaderConcept . \
                ?broaderConcept skos:prefLabel ?broaderPrefLabel \
        } \
            OPTIONAL{ \
                ?Concept skos:narrower ?narrowerConcept  . \
                ?narrowerConcept skos:prefLabel ?narrowerPrefLabel \
        } \
            OPTIONAL { \
                ?Concept skos:related ?relatedConcept  . \
                ?relatedConcept  skos:prefLabel ?relatedPrefLabel \
        } \
    } ORDER BY ?prefLabel LIMIT 100 OFFSET 0";

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
            done(_createJsonErrorPayload(err, null, '500', '2A', 'PoolParty HTTP Request Failed'));
            return;
        }

        if (response.statusCode !== 200) {
            if (response.statusCode === 401) {
                done(_createJsonErrorPayload('Authentication Failed',
                    null, response.statusCode, '2B', 'PoolParty Authentication Failed', {
                        responseMessage: body.message,
                        statusMessage: response.statusMessage
                    }));
            } else {
                done(_createJsonErrorPayload('Entity Lookup Failed [' + response.statusMessage + ']',
                    null, response.statusCode, '2C', 'PoolParty Entity Lookup Failed', {
                        responseMessage: body.message,
                        statusMessage: response.statusMessage
                    }));
            }
            return;
        }

        done(null, body);
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

            // console.info("LOOKUP ENTITY RESULT:");
            // console.info(JSON.stringify(body, null, 4));

            var entityResults = {};
            var conceptPrefLabelsSet = new Set();

            _.each(body.results.bindings, function (row) {
                // Converts the row object from SPARQL into a formatted object that is easier to process
                let formattedRow = _formatResultRow(row);

                conceptPrefLabelsSet.add(formattedRow.concept.prefLabel);

                // Adds the row to the results object (note this method mutates the results object)
                _addFormattedRowToResults(entityResults, formattedRow);
            });

            // console.info("LOOKUP FORMATTED RESULTS:");
            // console.info(JSON.stringify(entityResults, null, 4));

            let conceptPrefLabels = Array.from(conceptPrefLabelsSet);

            // The final entity results object needs to return arrays instead of sets so
            // this method does the conversion for us
            _convertEntityResults(entityResults);

            if(conceptPrefLabels.length > 0) {
                lookupResults.push({
                    entity: entity.value,
                    result: {
                        entity_name: entity.value,
                        tags: conceptPrefLabels,
                        details: entityResults
                    }
                });
            }

            done(null)
        });
    }, function (err) {
        cb(err, lookupResults.length, lookupResults);
    });
};

var _convertEntityResults = function(entityResults){
    let keys = Object.keys(entityResults);
    for(let i=0; i<keys.length; i++){
        let key = keys[i];
        delete entityResults[key].broaderConceptSet;
        delete entityResults[key].narrowerConceptSet;
        delete entityResults[key].relatedConceptSet;
    }
};

var _formatResultRow = function(row){
    let formattedRow = {};
    // The concept and prefLabel are the only non-optional fields so they will always
    // exist if a row is returned.
    formattedRow.concept = {
        uri: row.Concept.value,
        prefLabel: row.prefLabel.value
    };

    if(row.definition){
        formattedRow.definition = row.definition.value;
    }

    if (row.broaderConcept && row.broaderPrefLabel) {
        formattedRow.broaderConcept = {
            uri: row.broaderConcept.value,
            prefLabel: row.broaderPrefLabel.value
        }
    }

    if (row.narrowerConcept && row.narrowerPrefLabel) {
        formattedRow.narrowerConcept = {
            uri: row.narrowerConcept.value,
            prefLabel: row.narrowerPrefLabel.value
        }
    }

    if (row.relatedConcept && row.relatedPrefLabel) {
        formattedRow.relatedConcept = {
            uri: row.relatedConcept.value,
            prefLabel: row.relatedPrefLabel.value
        }
    }

    return formattedRow;
};

var _addFormattedRowToResults = function(results, formattedRow){
    let conceptPrefLabel = formattedRow.concept.prefLabel;

    if(!results[conceptPrefLabel]){
        results[conceptPrefLabel] = {
            concept: formattedRow.concept,
            definition: '[No Definition]',
            broaderConcepts: [],
            broaderConceptSet: new Set(),
            narrowerConcepts: [],
            narrowerConceptSet: new Set(),
            relatedConcepts: [],
            relatedConceptSet: new Set()
        };
    }

    if(formattedRow.definition){
        results[conceptPrefLabel].definition = formattedRow.definition;
    }

    if(formattedRow.broaderConcept){
        if(!results[conceptPrefLabel].relatedConceptSet.has(formattedRow.broaderConcept.prefLabel)){
            results[conceptPrefLabel].broaderConcepts.push(formattedRow.broaderConcept);
            results[conceptPrefLabel].broaderConceptSet.add(formattedRow.broaderConcept.prefLabel);
        }
    }

    if(formattedRow.narrowerConcept){
        if(!results[conceptPrefLabel].narrowerConceptSet.has(formattedRow.narrowerConcept.prefLabel)){
            results[conceptPrefLabel].narrowerConcepts.push(formattedRow.narrowerConcept);
            results[conceptPrefLabel].narrowerConceptSet.add(formattedRow.narrowerConcept.prefLabel);
        }
    }

    if(formattedRow.relatedConcept){
        if(!results[conceptPrefLabel].relatedConceptSet.has(formattedRow.relatedConcept.prefLabel)){
            results[conceptPrefLabel].relatedConcepts.push(formattedRow.relatedConcept);
            results[conceptPrefLabel].relatedConceptSet.add(formattedRow.relatedConcept.prefLabel);
        }
    }

    return results;
};

module.exports = {
    doLookup: doLookup
};
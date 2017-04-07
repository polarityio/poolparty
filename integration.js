'use strict';

let request = require('request');
let util = require('util');
let _ = require('lodash');
let async = require('async');
let Logger;

function startup(logger){
    Logger = logger;
}

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
function _createJsonErrorPayload(msg, pointer, httpCode, code, title, meta) {
    return {
        errors: [
            _createJsonErrorObject(msg, pointer, httpCode, code, title, meta)
        ]
    }
}

function _createJsonErrorObject(msg, pointer, httpCode, code, title, meta) {
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
}

function _lookupEntity(entity, options, done) {
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
        options.project + "?query=" + encodeURIComponent(query) + "&format=application%2Fjson";

    request({
        uri: uri,
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-encoded'
        },
        json: true
    }, function (err, response, body) {
        if (err) {
            done(_createJsonErrorPayload("Unable to connect to PoolParty server", null, '500', '2A', 'PoolParty HTTP Request Failed', {
                err: err
            }));
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
}

function doLookup(entities, options, cb) {
    let lookupResults = [];

    Logger.debug({entities: entities, options: options}, 'Entities for Lookup');

    async.each(entities, function (entity, done) {
        _lookupEntity(entity, options, function (err, body) {
            if (err) {
                done(err);
                return;
            }

            let entityResults = {};
            let conceptPrefLabelsSet = new Set();

            _.each(body.results.bindings, function (row) {
                // Converts the row object from SPARQL into a formatted object that is easier to process
                let formattedRow = _formatResultRow(row);

                conceptPrefLabelsSet.add(formattedRow.concept.prefLabel);

                // Adds the row to the results object (note this method mutates the results object)
                _addFormattedRowToResults(entityResults, formattedRow);
            });

            let conceptPrefLabels = Array.from(conceptPrefLabelsSet);

            // The final entity results object needs to return arrays instead of sets so
            // this method does the conversion for us
            _convertEntityResults(entityResults);


            if (conceptPrefLabels.length > 0) {
                lookupResults.push({
                    /**
                     * The entity object provided by the `doLookup` function
                     *
                     * @property entity
                     * @type {Object}
                     * @required
                     */
                    entity: entity,
                    /**
                     * Indicator for whether this lookup result is volatile.  If true, the result will not be cached.
                     *
                     * @property isVolatile
                     * @type Boolean
                     * @default false
                     * @optional
                     */
                    isVolatile: false,
                    /**
                     * The display string used as the "title" for the notification window entity block.  This property
                     * defaults to the value of `entity.value`.
                     *
                     * @property displayValue
                     * @type String
                     * @default entity.value
                     * @optional
                     */
                    displayValue: entity.value,
                    /**
                     * Contains the summary and details results of the lookup operation.  If set to null, or not
                     * provided then the fact that no results were found will be cached unless the `volatile` flag
                     * is set to true in which cache no caching will be done.
                     *
                     * @property data
                     * @type {Object}
                     * @required
                     */
                    data: {
                        /**
                         * An array of strings to use as tags with the default summary template, or an object containing
                         * data you want to passed to your custom summary template.
                         *
                         * @property data.summary
                         * @type {String[]}|{Object}
                         * @default [] (empty array)
                         * @optional
                         */
                        summary: conceptPrefLabels,
                        /**
                         * Data to be passed to the details block for this integration. If null, or undefined then
                         * no details block will be rendered.
                         *
                         * @property data.details
                         * @type {Object}
                         * @optional
                         */
                        details: entityResults
                    }
                });
            } else {
                // No data for this entity
                lookupResults.push({
                    entity: entity,
                    data: null
                })
            }
            done(null)
        });
    }, function (err) {
        cb(err, lookupResults);
    });
}

function _convertEntityResults(entityResults) {
    let keys = Object.keys(entityResults);
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        delete entityResults[key].broaderConceptSet;
        delete entityResults[key].narrowerConceptSet;
        delete entityResults[key].relatedConceptSet;
    }
}

function _formatResultRow(row) {
    let formattedRow = {};
    // The concept and prefLabel are the only non-optional fields so they will always
    // exist if a row is returned.
    formattedRow.concept = {
        uri: row.Concept.value,
        prefLabel: row.prefLabel.value
    };

    if (row.definition) {
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
}

function _addFormattedRowToResults(results, formattedRow) {
    let conceptPrefLabel = formattedRow.concept.prefLabel;

    if (!results[conceptPrefLabel]) {
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

    if (formattedRow.definition) {
        results[conceptPrefLabel].definition = formattedRow.definition;
    }

    if (formattedRow.broaderConcept) {
        if (!results[conceptPrefLabel].relatedConceptSet.has(formattedRow.broaderConcept.prefLabel)) {
            results[conceptPrefLabel].broaderConcepts.push(formattedRow.broaderConcept);
            results[conceptPrefLabel].broaderConceptSet.add(formattedRow.broaderConcept.prefLabel);
        }
    }

    if (formattedRow.narrowerConcept) {
        if (!results[conceptPrefLabel].narrowerConceptSet.has(formattedRow.narrowerConcept.prefLabel)) {
            results[conceptPrefLabel].narrowerConcepts.push(formattedRow.narrowerConcept);
            results[conceptPrefLabel].narrowerConceptSet.add(formattedRow.narrowerConcept.prefLabel);
        }
    }

    if (formattedRow.relatedConcept) {
        if (!results[conceptPrefLabel].relatedConceptSet.has(formattedRow.relatedConcept.prefLabel)) {
            results[conceptPrefLabel].relatedConcepts.push(formattedRow.relatedConcept);
            results[conceptPrefLabel].relatedConceptSet.add(formattedRow.relatedConcept.prefLabel);
        }
    }

    return results;
}

/**
 Validates integration options

 @param options
 @returns {{errors: (string|Array.<T>)}}
 @private
 */
function validateOptions(userOptions, cb) {
    let errors = _validateStringOption(userOptions, 'username').concat(
        _validateStringOption(userOptions, 'password'),
        _validateStringOption(userOptions, 'url'),
        _validateStringOption(userOptions, 'project'));

    cb(null, errors);
}

function _validateStringOption(options, key) {
    let errors = [];

    if (!_.isString(options[key].value)) {
        errors.push({
            message: 'You must provide a value for this option',
            key: key
        });
    }

    if (options[key].value.length === 0) {
        errors.push({
            message: 'The value must be at least 1 character',
            key: key
        });
    }

    return errors;
}

module.exports = {
    doLookup: doLookup,
    validateOptions: validateOptions,
    startup: startup
};
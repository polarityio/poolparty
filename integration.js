'use strict';

let request = require('request');
let util = require('util');
let _ = require('lodash');
let async = require('async');
let Logger;

function startup(logger) {
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
    let uri = options.url + "/extractor/api/categorization";

    request({
        uri: uri,
        qs: {
            projectId: options.projectId,
            language: options.language
        },
        form: {
            text: entity.value.replace(/[^a-zA-Z0-9]|(\r\n|\n|\r)/g, ' ')
        },
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-encoded'
        },
        auth: {
            'user': options.username,
            'pass': options.password
        },
        json: true
    }, function (err, response, body) {
        let errorCode = 2;
        _requestErrorHandling(err, response, body, errorCode, function(err){
           if(err){
               done(err);
           }else{
               done(null, body);
           }
        });
    });
}

function _requestErrorHandling(err, response, body, errorCode, cb){
    if (err) {
        cb(_createJsonErrorPayload("Unable to connect to PoolParty server", null, '500', errorCode + 'A', 'PoolParty HTTP Request Failed', {
            err: err
        }));
        return;
    }

    if (response.statusCode !== 200) {
        if (response.statusCode === 401) {
            cb(_createJsonErrorPayload('Authentication Failed',
                null, response.statusCode, errorCode + 'B', 'PoolParty Authentication Failed', {
                    //responseMessage: _.defaults(body.message,
                    statusMessage: response.statusMessage
                }));
        } else {
            cb(_createJsonErrorPayload('Entity Lookup Failed [' + response.statusMessage + ']',
                null, response.statusCode, errorCode + 'C', 'PoolParty Entity Lookup Failed', {
                    //responseMessage: body.message,
                    statusMessage: response.statusMessage
                }));
        }
        return;
    }

    cb(null);
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

            // Groups concepts by label, and then does a secondary group by concept.uri
            // to remove duplicates within a label
            let conceptsMap = new Map();

            if (typeof body === 'undefined' || !Array.isArray(body.categories)) {
                done(null);
                return;
            }

            async.each(body.categories, function (category, nextCategory) {
                if (category.score >= options.minimumCategoryScore) {
                    async.each(category.categoryConceptResults, function (concept, nextConcept) {
                        if (concept.score >= options.minimumConceptScore) {
                            //lookup the definition
                            let uri = options.url + "/PoolParty/api/thesaurus/" + options.projectId + "/concept";
                            request({
                                uri: uri,
                                qs: {
                                    concept: concept.uri,
                                    properties: 'skos:definition'
                                },
                                method: 'GET',
                                headers: {
                                    'Content-Type': 'application/x-www-form-encoded'
                                },
                                auth: {
                                    'user': options.username,
                                    'pass': options.password
                                },
                                json: true
                            }, function (err, response, body) {
                                let errorCode = 3;
                                _requestErrorHandling(err, response, body, errorCode, function(err){
                                    if(err){
                                        nextConcept(err);
                                    }else{
                                        if(Array.isArray(body.definitions) && body.definitions.length > 0){
                                            concept.definition = body.definitions[0];
                                        }else{
                                            concept.definition = '<No Definition Found>';
                                        }
                                        concept.category = category.prefLabel;
                                        if(!conceptsMap.has(concept.prefLabel)){
                                            conceptsMap.set(concept.prefLabel, new Map());
                                        }
                                        conceptsMap.get(concept.prefLabel).set(concept.uri, concept);
                                        nextConcept(null);
                                    }
                                });
                            });
                        } else {
                            nextConcept(null);
                        }
                    }, function (err, result) {
                        nextCategory(err);
                    });
                } else {
                    nextCategory(null);
                }
            }, function (err, result) {
                if (err) {
                    done(err);
                } else {


                    conceptsMap.forEach(function(conceptGroup, prefLabel){
                        let details = {
                            concepts: []
                        };
                        let mergedCategories = [];
                        let copiedEntity  = _.assign({}, entity);

                        conceptGroup.forEach(function(concept, uri){
                            details.concepts.push(concept);
                            mergedCategories.push(concept.category);
                        });

                        details.ocrText = copiedEntity.value;
                        copiedEntity.value = prefLabel;

                        lookupResults.push({
                            entity: copiedEntity,
                            displayValue: prefLabel,
                            data: {
                                summary: mergedCategories,
                                details: details
                            }
                        });
                    });

                    done(null);
                }
            });
        });
    }, function (err) {
        cb(err, lookupResults);
    });
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
        _validateStringOption(userOptions, 'projectId'));

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
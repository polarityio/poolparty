'use strict';

var SparqlClient = require('sparql-client');
var rest = require('unirest');
var util = require('util');
var _ = require('lodash');
var async = require('async');

var doLookup = function(entities, options, cb){
    if(typeof cb !== 'function'){
        return;
    }

    var lookupResults = [];
    var auth = 'Basic ' + new Buffer(options.username + ':' + options.password).toString('base64');

    // auth is: 'Basic VGVzdDoxMjM='
    var header = {
        'Authorization': auth,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/sparql-results+json'
    };

    var jsonHeader = {
        'Authorization': auth,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
    };

    async.each(entities, function(entity, done){
        var query = " PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#> " +
            " PREFIX skos:<http://www.w3.org/2004/02/skos/core#>" +
            " SELECT DISTINCT ?Concept ?prefLabel" +
            " WHERE" +
            " { ?Concept ?x skos:Concept ." +
            " { ?Concept skos:prefLabel ?prefLabel . FILTER (regex(str(?prefLabel), '"+entity.value+"', 'i'))  }" +
            " } ORDER BY ?prefLabel LIMIT 50 OFFSET 0";

        rest.get(options.url+"/PoolParty/sparql/"+options.project+"?query="+encodeURIComponent(query)+"&content-type=application%2Fjson")
            .headers(header)
            .end(function(response){
                if(response.code > 300 || !response.body || !response.body.results){
                     done();
                    return;
                }
                var results = response.body.results;
                var tags = [];
                var details = {};
                var conceptUrls = [];

                _.each(results.bindings, function(binding){
                    conceptUrls.push(binding.Concept.value);
                    tags.push(binding.prefLabel.value);
                    //details[binding.prefLabel.value] = "<a>" + binding.Concept.value + "</a>";
                });

                console.info("ENTITY:");
                console.info(entity.value);
                console.info("GOT CONCEPTS");
                console.info(conceptUrls);

                async.eachLimit(conceptUrls, 5, function(url, eachCallback){
                    let lookupUrl = options.url + "/PoolParty/api/thesaurus/" + options.project + "/concept?concept=" + url +
                        "&properties=all";
                    console.info(lookupUrl);
                    rest.get(lookupUrl)
                        .headers(jsonHeader)
                        .end(function(response){
                            // console.info("LOOKED UP CONCEPT RESULTS:");
                            // console.info(JSON.stringify(response.body, null, 4));

                            if(response.code > 300 || !response.body){
                                eachCallback(response.code);
                                return;
                            }

                            let definition = '<No Definition Provided>';
                            let prefLabel = '<No Pref Label Provided';

                            if(typeof(response.body) !== 'undefined' && Array.isArray(response.body.definitions)){
                                definition = response.body.definitions[0];
                                prefLabel = response.body.prefLabel;
                            }

                            details[prefLabel] = definition;
                            console.info("DETAILS:");
                            console.info(JSON.stringify(details, null, 4));
                            eachCallback(null);
                        });
                }, function(err){
                    if(err){
                        console.info("DEFINITION LOOKUP ERROR:");
                        console.info(err);
                    }

                    console.info("PUSHING LOOKUP RESULTS");

                    if(tags.length > 0){
                        console.info("PUSHING LOOKUP RESULTS");
                        lookupResults.push({
                            entity: entity.value,
                            result: {
                                entity_name: entity.value,
                                //the tags for summary
                                tags: tags.splice(0,5),
                                //Add the results object as the details
                                details: details
                            }
                        });
                    }

                    done();
                });
            });

    }, function(){
        console.info("LOOKUP RESULTS:");
        console.info(JSON.stringify(lookupResults, null, 4));
        cb(null, lookupResults.length, lookupResults);
    });
};

module.exports = {
    doLookup: doLookup
};
'use strict';

var SparqlClient = require('sparql-client');
var rest = require('unirest');
var util = require('util');
var _ = require('underscore');
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

    async.each(entities, function(entity, done){
        // Get the leaderName(s) of the given citys
        // if you do not bind any city, it returns 10 random leaderNames
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

                _.each(results.bindings, function(binding){
                   tags.push(binding.prefLabel.value);
                    details[binding.prefLabel.value] = "<a>" + binding.Concept.value + "</a>";
                });

                if(tags.length > 0){
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

    }, function(){
        cb(null, lookupResults.length, lookupResults);
    });


};



module.exports = {
    doLookup: doLookup
};
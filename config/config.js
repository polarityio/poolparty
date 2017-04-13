module.exports = {
    "acronym":"" ,
    "customTypes": [
        {
            key: 'all',
            regex: /.*/
        }
    ],
    "logging": { level: 'debug'},
    "styles":[
        "./styles/poolparty.less"
    ],
    "block": {
        "component": {
            "file": "./components/poolparty.js"
        },
        "template": {
            "file": "./templates/poolparty.hbs"
        }
    },
    "options":[
        {
            "key"         : "url",
            "name"        : "Concept URL",
            "description" : "",
            "default"     : "",
            "type"        : "text",
            "userCanEdit" : true,
            "adminOnly"    : false
        },
        {
            "key"         : "username",
            "name"        : "Username",
            "description" : "PoolParty Account Username",
            "default"     : "",
            "type"        : "text",
            "userCanEdit" : true,
            "adminOnly"    : false
        },
        {
            "key"         : "password",
            "name"        : "password",
            "description" : "PoolParty Account Password",
            "default"     : "",
            "type"        : "password",
            "userCanEdit" : true,
            "adminOnly"    : false
        },
        {
            "key"         : "projectId",
            "name"        : "Project Id",
            "description" : "Thesaurus Project Id",
            "default"     : "",
            "type"        : "text",
            "userCanEdit" : true,
            "adminOnly"    : false
        },
        {
            "key"         : "language",
            "name"        : "Language",
            "description" : "Language of text being categorized (en|de|es|fr|...)",
            "default"     : "en",
            "type"        : "text",
            "userCanEdit" : true,
            "adminOnly"    : false
        },
        {
            "key"         : "minimumCategoryScore",
            "name"        : "Minimum Category Score",
            "description" : "The minimum category score [0.0 - 1.0] for a category's concepts to be included in results (leave blank for no minimum)",
            "default"     : "0.0",
            "type"        : "number",
            "userCanEdit" : true,
            "adminOnly"    : false
        },
        {
            "key"         : "minimumConceptScore",
            "name"        : "Minimum Concept Score",
            "description" : "The minimum concept score [0 - 100] for a concept to be included in results (leave blank for no minimum)",
            "default"     : "0",
            "type"        : "number",
            "userCanEdit" : true,
            "adminOnly"    : false
        },
        {
            "key"         : "showBroaderConcepts",
            "name"        : "Show Broader Concepts",
            "description" : "If checked, the integration will show broader concepts",
            "default"     : true,
            "type"        : "boolean",
            "userCanEdit" : true,
            "adminOnly"    : false
        },
        {
            "key"         : "showNarrowerConcepts",
            "name"        : "Show Narrower Concepts",
            "description" : "If checked, the integration will show narrower concepts",
            "default"     : true,
            "type"        : "boolean",
            "userCanEdit" : false,
            "adminOnly"    : true
        },
        {
            "key"         : "showRelatedConcepts",
            "name"        : "Show Related Concepts",
            "description" : "If checked, the integration will show related concepts",
            "default"     : true,
            "type"        : "boolean",
            "userCanEdit" : false,
            "adminOnly"    : true
        }
    ]
};
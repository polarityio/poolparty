module.exports = {
    "acronym":"Pool",
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
            "user-can-edit" : true,
            "admin-only"    : false
        },
        {
            "key"         : "project",
            "name"        : "Project Name",
            "description" : "",
            "default"     : "CocktailsTaxonomie",
            "type"        : "text",
            "user-can-edit" : true,
            "admin-only"    : false
        },
        {
            "key"         : "username",
            "name"        : "Username",
            "description" : "PoolParty Account Username",
            "default"     : "",
            "type"        : "text",
            "user-can-edit" : true,
            "admin-only"    : false
        },
        {
            "key"         : "password",
            "name"        : "password",
            "description" : "PoolParty Account Password",
            "default"     : "",
            "type"        : "password",
            "user-can-edit" : true,
            "admin-only"    : false
        },
        {
            "key"         : "showBroaderConcepts",
            "name"        : "Show Broader Concepts",
            "description" : "If checked, the integration will show broader concepts",
            "default"     : true,
            "type"        : "boolean",
            "user-can-edit" : true,
            "admin-only"    : false
        },
        {
            "key"         : "showNarrowerConcepts",
            "name"        : "Show Narrower Concepts",
            "description" : "If checked, the integration will show narrower concepts",
            "default"     : true,
            "type"        : "boolean",
            "user-can-edit" : true,
            "admin-only"    : false
        },
        {
            "key"         : "showRelatedConcepts",
            "name"        : "Show Related Concepts",
            "description" : "If checked, the integration will show related concepts",
            "default"     : true,
            "type"        : "boolean",
            "user-can-edit" : true,
            "admin-only"    : false
        }
    ]
};
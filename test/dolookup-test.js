/*
 * Copyright (c) 2017. Breach Intelligence, Inc.
 * All rights reserved
 */

'use strict';

let chai = require('chai');
let expect = chai.expect;
let _ = require('lodash');
let nock = require('nock');
let integration = require('../integration');

let options = {
    url: 'https://poolparty.test',
    username: '',
    password: '',
    language: 'en',
    projectId: '1234-1234-1234',
    minimumCategoryScore: 0,
    minimumConceptScore: 0,
    text: 'helloworld'
};

describe('doLookup()', function () {
    beforeEach(function (done) {
        integration.startup({
            debug: function (msg) {
                //console.info(JSON.stringify(msg, null, 4));
            }
        });

        nock(options.url)
            .persist()
            .get(/.*/)
            .reply(200, {
                "uri": "http://example.com/RegulatoryOntology/253",
                "prefLabel": "Expected Loss Given Default – ELGD",
                "definitions": [
                    "Report the Expected Loss Given Default (ELGD) parameter for the account as defined in the most recent capital framework. More specifically, report the ELGD associated to the account’s corresponding segment.  Missing or unavailable values should be left blank.If the BHC generates this field, they are required to report it. ELGD is an input into the LGD calculation."
                ]
            });

        nock(options.url)
            .post('/extractor/api/categorization')
            // .query({
            //     projectId: options.projectId,
            //     language: options.language,
            //     text: options.text
            // })
            .query(true)
            .reply(200, {
                "categories": [
                    {
                        "score": 0.18181818181818182,
                        "uri": "http://www.nlm.nih.gov/mesh/D013568",
                        "prefLabel": "Pathological Conditions, Signs and Symptoms",
                        "categoryConceptResults": [
                            {
                                "score": 6,
                                "uri": "http://www.nlm.nih.gov/mesh/D006470",
                                "prefLabel": "Hemorrhage"
                            },
                            {
                                "score": 6,
                                "uri": "http://www.nlm.nih.gov/mesh/D014012",
                                "prefLabel": "Tinnitus"
                            },
                            {
                                "score": 15,
                                "uri": "http://www.nlm.nih.gov/mesh/D005334",
                                "prefLabel": "Fever"
                            },
                            {
                                "score": 16,
                                "uri": "http://www.nlm.nih.gov/mesh/D010146_1",
                                "prefLabel": "Pain"
                            },
                            {
                                "score": 6,
                                "uri": "http://www.nlm.nih.gov/mesh/D014456",
                                "prefLabel": "Ulcer"
                            },
                            {
                                "score": 7,
                                "uri": "http://www.nlm.nih.gov/mesh/D003643",
                                "prefLabel": "Death"
                            }
                        ]
                    },
                    {
                        "score": 0.12121212121212122,
                        "uri": "http://www.nlm.nih.gov/mesh/D009930",
                        "prefLabel": "Organic Chemicals",
                        "categoryConceptResults": [
                            {
                                "score": 6,
                                "uri": "http://www.nlm.nih.gov/mesh/D012459",
                                "prefLabel": "Salicylates"
                            },
                            {
                                "score": 14,
                                "uri": "http://www.nlm.nih.gov/mesh/D020156",
                                "prefLabel": "Salicylic Acid"
                            },
                            {
                                "score": 59,
                                "uri": "http://www.nlm.nih.gov/mesh/D001241",
                                "prefLabel": "Aspirin"
                            }
                        ]
                    },
                    {
                        "score": 0.09090909090909091,
                        "uri": "http://www.nlm.nih.gov/mesh/D056890",
                        "prefLabel": "Eukaryota",
                        "categoryConceptResults": [
                            {
                                "score": 13,
                                "uri": "http://www.nlm.nih.gov/mesh/D000818",
                                "prefLabel": "Animals"
                            },
                            {
                                "score": 13,
                                "uri": "http://www.nlm.nih.gov/mesh/D006801",
                                "prefLabel": "Humans"
                            }
                        ]
                    },
                    {
                        "score": 0.09090909090909091,
                        "uri": "http://www.nlm.nih.gov/mesh/D009422",
                        "prefLabel": "Nervous System Diseases",
                        "categoryConceptResults": [
                            {
                                "score": 6,
                                "uri": "http://www.nlm.nih.gov/mesh/D014012",
                                "prefLabel": "Tinnitus"
                            },
                            {
                                "score": 16,
                                "uri": "http://www.nlm.nih.gov/mesh/D010146_2",
                                "prefLabel": "Pain"
                            },
                            {
                                "score": 9,
                                "uri": "http://www.nlm.nih.gov/mesh/D020521",
                                "prefLabel": "Stroke"
                            }
                        ]
                    },
                    {
                        "score": 0.09090909090909091,
                        "uri": "http://www.nlm.nih.gov/mesh/D004191",
                        "prefLabel": "Behavioral Disciplines and Activities",
                        "categoryConceptResults": [
                            {
                                "score": 2,
                                "uri": "http://www.nlm.nih.gov/mesh/D010330",
                                "prefLabel": "Patents as Topic"
                            },
                            {
                                "score": 16,
                                "uri": "http://www.nlm.nih.gov/mesh/D010146",
                                "prefLabel": "Pain"
                            },
                            {
                                "score": 11,
                                "uri": "http://www.nlm.nih.gov/mesh/D004467",
                                "prefLabel": "Economics"
                            }
                        ]
                    },
                    {
                        "score": 0.09090909090909091,
                        "uri": "http://www.nlm.nih.gov/mesh/D009272",
                        "prefLabel": "Persons",
                        "categoryConceptResults": [
                            {
                                "score": 6,
                                "uri": "http://www.nlm.nih.gov/mesh/D002648",
                                "prefLabel": "Child"
                            },
                            {
                                "score": 6,
                                "uri": "http://www.nlm.nih.gov/mesh/D000293",
                                "prefLabel": "Adolescent"
                            },
                            {
                                "score": 16,
                                "uri": "http://www.nlm.nih.gov/mesh/D033242",
                                "prefLabel": "Minors"
                            }
                        ]
                    },
                    {
                        "score": 0.06060606060606061,
                        "uri": "http://www.nlm.nih.gov/mesh/D004064",
                        "prefLabel": "Digestive System",
                        "categoryConceptResults": [
                            {
                                "score": 6,
                                "uri": "http://www.nlm.nih.gov/mesh/D013270",
                                "prefLabel": "Stomach"
                            },
                            {
                                "score": 6,
                                "uri": "http://www.nlm.nih.gov/mesh/D009055",
                                "prefLabel": "Mouth"
                            }
                        ]
                    },
                    {
                        "score": 0.06060606060606061,
                        "uri": "http://www.nlm.nih.gov/mesh/D002319",
                        "prefLabel": "Cardiovascular System",
                        "categoryConceptResults": [
                            {
                                "score": 11,
                                "uri": "http://www.nlm.nih.gov/mesh/D001808",
                                "prefLabel": "Blood Vessels"
                            },
                            {
                                "score": 23,
                                "uri": "http://www.nlm.nih.gov/mesh/D006321",
                                "prefLabel": "Heart"
                            }
                        ]
                    },
                    {
                        "score": 0.06060606060606061,
                        "uri": "http://www.nlm.nih.gov/mesh/D010811",
                        "prefLabel": "Natural Science Disciplines",
                        "categoryConceptResults": [
                            {
                                "score": 20,
                                "uri": "http://www.nlm.nih.gov/mesh/D012306",
                                "prefLabel": "Risk"
                            },
                            {
                                "score": 16,
                                "uri": "http://www.nlm.nih.gov/mesh/D010146",
                                "prefLabel": "Pain"
                            }
                        ]
                    },
                    {
                        "score": 0.06060606060606061,
                        "uri": "http://www.nlm.nih.gov/mesh/D004472",
                        "prefLabel": "Health Care Economics and Organizations",
                        "categoryConceptResults": [
                            {
                                "score": 2,
                                "uri": "http://www.nlm.nih.gov/mesh/D010330",
                                "prefLabel": "Patents as Topic"
                            },
                            {
                                "score": 11,
                                "uri": "http://www.nlm.nih.gov/mesh/D004467",
                                "prefLabel": "Economics"
                            }
                        ]
                    },
                    {
                        "score": 0.06060606060606061,
                        "uri": "http://www.nlm.nih.gov/mesh/D005441",
                        "prefLabel": "Fluids and Secretions",
                        "categoryConceptResults": [
                            {
                                "score": 21,
                                "uri": "http://www.nlm.nih.gov/mesh/D001792",
                                "prefLabel": "Blood Platelets"
                            },
                            {
                                "score": 36,
                                "uri": "http://www.nlm.nih.gov/mesh/D001769",
                                "prefLabel": "Blood"
                            }
                        ]
                    },
                    {
                        "score": 0.06060606060606061,
                        "uri": "http://www.nlm.nih.gov/mesh/D006424",
                        "prefLabel": "Hemic and Immune Systems",
                        "categoryConceptResults": [
                            {
                                "score": 21,
                                "uri": "http://www.nlm.nih.gov/mesh/D001792",
                                "prefLabel": "Blood Platelets"
                            },
                            {
                                "score": 36,
                                "uri": "http://www.nlm.nih.gov/mesh/D001769",
                                "prefLabel": "Blood"
                            }
                        ]
                    },
                    {
                        "score": 0.030303030303030304,
                        "uri": "http://www.nlm.nih.gov/mesh/D011579",
                        "prefLabel": "Psychological Phenomena and Processes",
                        "categoryConceptResults": [
                            {
                                "score": 16,
                                "uri": "http://www.nlm.nih.gov/mesh/D010146",
                                "prefLabel": "Pain"
                            }
                        ]
                    },
                    {
                        "score": 0.030303030303030304,
                        "uri": "http://www.nlm.nih.gov/mesh/D004778",
                        "prefLabel": "Environment and Public Health",
                        "categoryConceptResults": [
                            {
                                "score": 20,
                                "uri": "http://www.nlm.nih.gov/mesh/D012306",
                                "prefLabel": "Risk"
                            }
                        ]
                    },
                    {
                        "score": 0.030303030303030304,
                        "uri": "http://www.nlm.nih.gov/mesh/D011154",
                        "prefLabel": "Population Characteristics",
                        "categoryConceptResults": [
                            {
                                "score": 20,
                                "uri": "http://www.nlm.nih.gov/mesh/D012306",
                                "prefLabel": "Risk"
                            }
                        ]
                    },
                    {
                        "score": 0.030303030303030304,
                        "uri": "http://www.nlm.nih.gov/mesh/D010829",
                        "prefLabel": "Physiological Phenomena",
                        "categoryConceptResults": [
                            {
                                "score": 12,
                                "uri": "http://www.nlm.nih.gov/mesh/D004032",
                                "prefLabel": "Diet"
                            }
                        ]
                    },
                    {
                        "score": 0.030303030303030304,
                        "uri": "http://www.nlm.nih.gov/mesh/D020164",
                        "prefLabel": "Chemical Actions and Uses",
                        "categoryConceptResults": [
                            {
                                "score": 11,
                                "uri": "http://www.nlm.nih.gov/mesh/D000894",
                                "prefLabel": "Anti-Inflammatory Agents, Non-Steroidal"
                            }
                        ]
                    },
                    {
                        "score": 0.030303030303030304,
                        "uri": "http://www.nlm.nih.gov/mesh/D045762",
                        "prefLabel": "Enzymes and Coenzymes",
                        "categoryConceptResults": [
                            {
                                "score": 3,
                                "uri": "http://www.nlm.nih.gov/mesh/D011451",
                                "prefLabel": "Prostaglandin-Endoperoxide Synthases"
                            }
                        ]
                    },
                    {
                        "score": 0.030303030303030304,
                        "uri": "http://www.nlm.nih.gov/mesh/D002477",
                        "prefLabel": "Cells",
                        "categoryConceptResults": [
                            {
                                "score": 21,
                                "uri": "http://www.nlm.nih.gov/mesh/D001792",
                                "prefLabel": "Blood Platelets"
                            }
                        ]
                    },
                    {
                        "score": 0.030303030303030304,
                        "uri": "http://www.nlm.nih.gov/mesh/D013812",
                        "prefLabel": "Therapeutics",
                        "categoryConceptResults": [
                            {
                                "score": 16,
                                "uri": "http://www.nlm.nih.gov/mesh/D010146",
                                "prefLabel": "Pain"
                            }
                        ]
                    },
                    {
                        "score": 0.030303030303030304,
                        "uri": "http://www.nlm.nih.gov/mesh/D001829",
                        "prefLabel": "Body Regions",
                        "categoryConceptResults": [
                            {
                                "score": 6,
                                "uri": "http://www.nlm.nih.gov/mesh/D009055",
                                "prefLabel": "Mouth"
                            }
                        ]
                    },
                    {
                        "score": 0.030303030303030304,
                        "uri": "http://www.nlm.nih.gov/mesh/D001520",
                        "prefLabel": "Behavior and Behavior Mechanisms",
                        "categoryConceptResults": [
                            {
                                "score": 3,
                                "uri": "http://www.nlm.nih.gov/mesh/D000339",
                                "prefLabel": "Affect"
                            }
                        ]
                    },
                    {
                        "score": 0.030303030303030304,
                        "uri": "http://www.nlm.nih.gov/mesh/D014777",
                        "prefLabel": "Virus Diseases",
                        "categoryConceptResults": [
                            {
                                "score": 5,
                                "uri": "http://www.nlm.nih.gov/mesh/D002644",
                                "prefLabel": "Chickenpox"
                            }
                        ]
                    },
                    {
                        "score": 0.030303030303030304,
                        "uri": "http://www.nlm.nih.gov/mesh/D002318",
                        "prefLabel": "Cardiovascular Diseases",
                        "categoryConceptResults": [
                            {
                                "score": 9,
                                "uri": "http://www.nlm.nih.gov/mesh/D020521",
                                "prefLabel": "Stroke"
                            }
                        ]
                    },
                    {
                        "score": 0.030303030303030304,
                        "uri": "http://www.nlm.nih.gov/mesh/D010038",
                        "prefLabel": "Otorhinolaryngologic Diseases",
                        "categoryConceptResults": [
                            {
                                "score": 6,
                                "uri": "http://www.nlm.nih.gov/mesh/D014012",
                                "prefLabel": "Tinnitus"
                            }
                        ]
                    },
                    {
                        "score": 0.030303030303030304,
                        "uri": "http://www.nlm.nih.gov/mesh/D006281",
                        "prefLabel": "Health Occupations",
                        "categoryConceptResults": [
                            {
                                "score": 20,
                                "uri": "http://www.nlm.nih.gov/mesh/D012306",
                                "prefLabel": "Risk"
                            }
                        ]
                    },
                    {
                        "score": 0.030303030303030304,
                        "uri": "http://www.nlm.nih.gov/mesh/D013284",
                        "prefLabel": "Stomatognathic System",
                        "categoryConceptResults": [
                            {
                                "score": 6,
                                "uri": "http://www.nlm.nih.gov/mesh/D009055",
                                "prefLabel": "Mouth"
                            }
                        ]
                    },
                    {
                        "score": 0.030303030303030304,
                        "uri": "http://www.nlm.nih.gov/mesh/D055687",
                        "prefLabel": "Musculoskeletal and Neural Physiological Phenomena",
                        "categoryConceptResults": [
                            {
                                "score": 16,
                                "uri": "http://www.nlm.nih.gov/mesh/D010146",
                                "prefLabel": "Pain"
                            }
                        ]
                    },
                    {
                        "score": 0.030303030303030304,
                        "uri": "http://www.nlm.nih.gov/mesh/D055754",
                        "prefLabel": "Metabolic Phenomena",
                        "categoryConceptResults": [
                            {
                                "score": 13,
                                "uri": "http://www.nlm.nih.gov/mesh/D008660",
                                "prefLabel": "Metabolism"
                            }
                        ]
                    },
                    {
                        "score": 0.030303030303030304,
                        "uri": "http://www.nlm.nih.gov/mesh/D046911",
                        "prefLabel": "Macromolecular Substances",
                        "categoryConceptResults": [
                            {
                                "score": 3,
                                "uri": "http://www.nlm.nih.gov/mesh/D011451",
                                "prefLabel": "Prostaglandin-Endoperoxide Synthases"
                            }
                        ]
                    },
                    {
                        "score": 0.030303030303030304,
                        "uri": "http://www.nlm.nih.gov/mesh/D055641",
                        "prefLabel": "Mathematical Concepts",
                        "categoryConceptResults": [
                            {
                                "score": 20,
                                "uri": "http://www.nlm.nih.gov/mesh/D012306",
                                "prefLabel": "Risk"
                            }
                        ]
                    },
                    {
                        "score": 0.030303030303030304,
                        "uri": "http://www.nlm.nih.gov/mesh/D017530",
                        "prefLabel": "Health Care Quality, Access, and Evaluation",
                        "categoryConceptResults": [
                            {
                                "score": 20,
                                "uri": "http://www.nlm.nih.gov/mesh/D012306",
                                "prefLabel": "Risk"
                            }
                        ]
                    },
                    {
                        "score": 0.030303030303030304,
                        "uri": "http://www.nlm.nih.gov/mesh/D008919",
                        "prefLabel": "Investigative Techniques",
                        "categoryConceptResults": [
                            {
                                "score": 20,
                                "uri": "http://www.nlm.nih.gov/mesh/D012306",
                                "prefLabel": "Risk"
                            }
                        ]
                    },
                ]
            });
        done();
    });

    it('should return all concepts and categories', function (done) {
        integration.doLookup([{
            type: 'custom',
            types: ['custom.all'],
            value: options.text
        }], options, function (err, result) {
            //console.info(JSON.stringify(result, null, 4));
            expect(err).to.be.null;
            expect(result).to.deep.equal(
                [
                    {
                        "entity": {
                            "type": "custom",
                            "types": [
                                "custom.all"
                            ],
                            "value": "Hemorrhage"
                        },
                        "displayValue": "Hemorrhage",
                        "data": {
                            "summary": [
                                "Pathological Conditions, Signs and Symptoms"
                            ],
                            "details": {
                                "concepts": [
                                    {
                                        "score": 6,
                                        "uri": "http://www.nlm.nih.gov/mesh/D006470",
                                        "prefLabel": "Hemorrhage",
                                        "definition": "Report the Expected Loss Given Default (ELGD) parameter for the account as defined in the most recent capital framework. More specifically, report the ELGD associated to the account’s corresponding segment.  Missing or unavailable values should be left blank.If the BHC generates this field, they are required to report it. ELGD is an input into the LGD calculation.",
                                        "category": "Pathological Conditions, Signs and Symptoms"
                                    }
                                ],
                                "ocrText": "helloworld"
                            }
                        }
                    },
                    {
                        "entity": {
                            "type": "custom",
                            "types": [
                                "custom.all"
                            ],
                            "value": "Tinnitus"
                        },
                        "displayValue": "Tinnitus",
                        "data": {
                            "summary": [
                                "Otorhinolaryngologic Diseases"
                            ],
                            "details": {
                                "concepts": [
                                    {
                                        "score": 6,
                                        "uri": "http://www.nlm.nih.gov/mesh/D014012",
                                        "prefLabel": "Tinnitus",
                                        "definition": "Report the Expected Loss Given Default (ELGD) parameter for the account as defined in the most recent capital framework. More specifically, report the ELGD associated to the account’s corresponding segment.  Missing or unavailable values should be left blank.If the BHC generates this field, they are required to report it. ELGD is an input into the LGD calculation.",
                                        "category": "Otorhinolaryngologic Diseases"
                                    }
                                ],
                                "ocrText": "helloworld"
                            }
                        }
                    },
                    {
                        "entity": {
                            "type": "custom",
                            "types": [
                                "custom.all"
                            ],
                            "value": "Fever"
                        },
                        "displayValue": "Fever",
                        "data": {
                            "summary": [
                                "Pathological Conditions, Signs and Symptoms"
                            ],
                            "details": {
                                "concepts": [
                                    {
                                        "score": 15,
                                        "uri": "http://www.nlm.nih.gov/mesh/D005334",
                                        "prefLabel": "Fever",
                                        "definition": "Report the Expected Loss Given Default (ELGD) parameter for the account as defined in the most recent capital framework. More specifically, report the ELGD associated to the account’s corresponding segment.  Missing or unavailable values should be left blank.If the BHC generates this field, they are required to report it. ELGD is an input into the LGD calculation.",
                                        "category": "Pathological Conditions, Signs and Symptoms"
                                    }
                                ],
                                "ocrText": "helloworld"
                            }
                        }
                    },
                    {
                        "entity": {
                            "type": "custom",
                            "types": [
                                "custom.all"
                            ],
                            "value": "Pain"
                        },
                        "displayValue": "Pain",
                        "data": {
                            "summary": [
                                "Pathological Conditions, Signs and Symptoms",
                                "Nervous System Diseases",
                                "Musculoskeletal and Neural Physiological Phenomena"
                            ],
                            "details": {
                                "concepts": [
                                    {
                                        "score": 16,
                                        "uri": "http://www.nlm.nih.gov/mesh/D010146_1",
                                        "prefLabel": "Pain",
                                        "definition": "Report the Expected Loss Given Default (ELGD) parameter for the account as defined in the most recent capital framework. More specifically, report the ELGD associated to the account’s corresponding segment.  Missing or unavailable values should be left blank.If the BHC generates this field, they are required to report it. ELGD is an input into the LGD calculation.",
                                        "category": "Pathological Conditions, Signs and Symptoms"
                                    },
                                    {
                                        "score": 16,
                                        "uri": "http://www.nlm.nih.gov/mesh/D010146_2",
                                        "prefLabel": "Pain",
                                        "definition": "Report the Expected Loss Given Default (ELGD) parameter for the account as defined in the most recent capital framework. More specifically, report the ELGD associated to the account’s corresponding segment.  Missing or unavailable values should be left blank.If the BHC generates this field, they are required to report it. ELGD is an input into the LGD calculation.",
                                        "category": "Nervous System Diseases"
                                    },
                                    {
                                        "score": 16,
                                        "uri": "http://www.nlm.nih.gov/mesh/D010146",
                                        "prefLabel": "Pain",
                                        "definition": "Report the Expected Loss Given Default (ELGD) parameter for the account as defined in the most recent capital framework. More specifically, report the ELGD associated to the account’s corresponding segment.  Missing or unavailable values should be left blank.If the BHC generates this field, they are required to report it. ELGD is an input into the LGD calculation.",
                                        "category": "Musculoskeletal and Neural Physiological Phenomena"
                                    }
                                ],
                                "ocrText": "helloworld"
                            }
                        }
                    },
                    {
                        "entity": {
                            "type": "custom",
                            "types": [
                                "custom.all"
                            ],
                            "value": "Ulcer"
                        },
                        "displayValue": "Ulcer",
                        "data": {
                            "summary": [
                                "Pathological Conditions, Signs and Symptoms"
                            ],
                            "details": {
                                "concepts": [
                                    {
                                        "score": 6,
                                        "uri": "http://www.nlm.nih.gov/mesh/D014456",
                                        "prefLabel": "Ulcer",
                                        "definition": "Report the Expected Loss Given Default (ELGD) parameter for the account as defined in the most recent capital framework. More specifically, report the ELGD associated to the account’s corresponding segment.  Missing or unavailable values should be left blank.If the BHC generates this field, they are required to report it. ELGD is an input into the LGD calculation.",
                                        "category": "Pathological Conditions, Signs and Symptoms"
                                    }
                                ],
                                "ocrText": "helloworld"
                            }
                        }
                    },
                    {
                        "entity": {
                            "type": "custom",
                            "types": [
                                "custom.all"
                            ],
                            "value": "Death"
                        },
                        "displayValue": "Death",
                        "data": {
                            "summary": [
                                "Pathological Conditions, Signs and Symptoms"
                            ],
                            "details": {
                                "concepts": [
                                    {
                                        "score": 7,
                                        "uri": "http://www.nlm.nih.gov/mesh/D003643",
                                        "prefLabel": "Death",
                                        "definition": "Report the Expected Loss Given Default (ELGD) parameter for the account as defined in the most recent capital framework. More specifically, report the ELGD associated to the account’s corresponding segment.  Missing or unavailable values should be left blank.If the BHC generates this field, they are required to report it. ELGD is an input into the LGD calculation.",
                                        "category": "Pathological Conditions, Signs and Symptoms"
                                    }
                                ],
                                "ocrText": "helloworld"
                            }
                        }
                    },
                    {
                        "entity": {
                            "type": "custom",
                            "types": [
                                "custom.all"
                            ],
                            "value": "Salicylates"
                        },
                        "displayValue": "Salicylates",
                        "data": {
                            "summary": [
                                "Organic Chemicals"
                            ],
                            "details": {
                                "concepts": [
                                    {
                                        "score": 6,
                                        "uri": "http://www.nlm.nih.gov/mesh/D012459",
                                        "prefLabel": "Salicylates",
                                        "definition": "Report the Expected Loss Given Default (ELGD) parameter for the account as defined in the most recent capital framework. More specifically, report the ELGD associated to the account’s corresponding segment.  Missing or unavailable values should be left blank.If the BHC generates this field, they are required to report it. ELGD is an input into the LGD calculation.",
                                        "category": "Organic Chemicals"
                                    }
                                ],
                                "ocrText": "helloworld"
                            }
                        }
                    },
                    {
                        "entity": {
                            "type": "custom",
                            "types": [
                                "custom.all"
                            ],
                            "value": "Salicylic Acid"
                        },
                        "displayValue": "Salicylic Acid",
                        "data": {
                            "summary": [
                                "Organic Chemicals"
                            ],
                            "details": {
                                "concepts": [
                                    {
                                        "score": 14,
                                        "uri": "http://www.nlm.nih.gov/mesh/D020156",
                                        "prefLabel": "Salicylic Acid",
                                        "definition": "Report the Expected Loss Given Default (ELGD) parameter for the account as defined in the most recent capital framework. More specifically, report the ELGD associated to the account’s corresponding segment.  Missing or unavailable values should be left blank.If the BHC generates this field, they are required to report it. ELGD is an input into the LGD calculation.",
                                        "category": "Organic Chemicals"
                                    }
                                ],
                                "ocrText": "helloworld"
                            }
                        }
                    },
                    {
                        "entity": {
                            "type": "custom",
                            "types": [
                                "custom.all"
                            ],
                            "value": "Aspirin"
                        },
                        "displayValue": "Aspirin",
                        "data": {
                            "summary": [
                                "Organic Chemicals"
                            ],
                            "details": {
                                "concepts": [
                                    {
                                        "score": 59,
                                        "uri": "http://www.nlm.nih.gov/mesh/D001241",
                                        "prefLabel": "Aspirin",
                                        "definition": "Report the Expected Loss Given Default (ELGD) parameter for the account as defined in the most recent capital framework. More specifically, report the ELGD associated to the account’s corresponding segment.  Missing or unavailable values should be left blank.If the BHC generates this field, they are required to report it. ELGD is an input into the LGD calculation.",
                                        "category": "Organic Chemicals"
                                    }
                                ],
                                "ocrText": "helloworld"
                            }
                        }
                    },
                    {
                        "entity": {
                            "type": "custom",
                            "types": [
                                "custom.all"
                            ],
                            "value": "Animals"
                        },
                        "displayValue": "Animals",
                        "data": {
                            "summary": [
                                "Eukaryota"
                            ],
                            "details": {
                                "concepts": [
                                    {
                                        "score": 13,
                                        "uri": "http://www.nlm.nih.gov/mesh/D000818",
                                        "prefLabel": "Animals",
                                        "definition": "Report the Expected Loss Given Default (ELGD) parameter for the account as defined in the most recent capital framework. More specifically, report the ELGD associated to the account’s corresponding segment.  Missing or unavailable values should be left blank.If the BHC generates this field, they are required to report it. ELGD is an input into the LGD calculation.",
                                        "category": "Eukaryota"
                                    }
                                ],
                                "ocrText": "helloworld"
                            }
                        }
                    },
                    {
                        "entity": {
                            "type": "custom",
                            "types": [
                                "custom.all"
                            ],
                            "value": "Humans"
                        },
                        "displayValue": "Humans",
                        "data": {
                            "summary": [
                                "Eukaryota"
                            ],
                            "details": {
                                "concepts": [
                                    {
                                        "score": 13,
                                        "uri": "http://www.nlm.nih.gov/mesh/D006801",
                                        "prefLabel": "Humans",
                                        "definition": "Report the Expected Loss Given Default (ELGD) parameter for the account as defined in the most recent capital framework. More specifically, report the ELGD associated to the account’s corresponding segment.  Missing or unavailable values should be left blank.If the BHC generates this field, they are required to report it. ELGD is an input into the LGD calculation.",
                                        "category": "Eukaryota"
                                    }
                                ],
                                "ocrText": "helloworld"
                            }
                        }
                    },
                    {
                        "entity": {
                            "type": "custom",
                            "types": [
                                "custom.all"
                            ],
                            "value": "Stroke"
                        },
                        "displayValue": "Stroke",
                        "data": {
                            "summary": [
                                "Cardiovascular Diseases"
                            ],
                            "details": {
                                "concepts": [
                                    {
                                        "score": 9,
                                        "uri": "http://www.nlm.nih.gov/mesh/D020521",
                                        "prefLabel": "Stroke",
                                        "definition": "Report the Expected Loss Given Default (ELGD) parameter for the account as defined in the most recent capital framework. More specifically, report the ELGD associated to the account’s corresponding segment.  Missing or unavailable values should be left blank.If the BHC generates this field, they are required to report it. ELGD is an input into the LGD calculation.",
                                        "category": "Cardiovascular Diseases"
                                    }
                                ],
                                "ocrText": "helloworld"
                            }
                        }
                    },
                    {
                        "entity": {
                            "type": "custom",
                            "types": [
                                "custom.all"
                            ],
                            "value": "Patents as Topic"
                        },
                        "displayValue": "Patents as Topic",
                        "data": {
                            "summary": [
                                "Health Care Economics and Organizations"
                            ],
                            "details": {
                                "concepts": [
                                    {
                                        "score": 2,
                                        "uri": "http://www.nlm.nih.gov/mesh/D010330",
                                        "prefLabel": "Patents as Topic",
                                        "definition": "Report the Expected Loss Given Default (ELGD) parameter for the account as defined in the most recent capital framework. More specifically, report the ELGD associated to the account’s corresponding segment.  Missing or unavailable values should be left blank.If the BHC generates this field, they are required to report it. ELGD is an input into the LGD calculation.",
                                        "category": "Health Care Economics and Organizations"
                                    }
                                ],
                                "ocrText": "helloworld"
                            }
                        }
                    },
                    {
                        "entity": {
                            "type": "custom",
                            "types": [
                                "custom.all"
                            ],
                            "value": "Economics"
                        },
                        "displayValue": "Economics",
                        "data": {
                            "summary": [
                                "Health Care Economics and Organizations"
                            ],
                            "details": {
                                "concepts": [
                                    {
                                        "score": 11,
                                        "uri": "http://www.nlm.nih.gov/mesh/D004467",
                                        "prefLabel": "Economics",
                                        "definition": "Report the Expected Loss Given Default (ELGD) parameter for the account as defined in the most recent capital framework. More specifically, report the ELGD associated to the account’s corresponding segment.  Missing or unavailable values should be left blank.If the BHC generates this field, they are required to report it. ELGD is an input into the LGD calculation.",
                                        "category": "Health Care Economics and Organizations"
                                    }
                                ],
                                "ocrText": "helloworld"
                            }
                        }
                    },
                    {
                        "entity": {
                            "type": "custom",
                            "types": [
                                "custom.all"
                            ],
                            "value": "Child"
                        },
                        "displayValue": "Child",
                        "data": {
                            "summary": [
                                "Persons"
                            ],
                            "details": {
                                "concepts": [
                                    {
                                        "score": 6,
                                        "uri": "http://www.nlm.nih.gov/mesh/D002648",
                                        "prefLabel": "Child",
                                        "definition": "Report the Expected Loss Given Default (ELGD) parameter for the account as defined in the most recent capital framework. More specifically, report the ELGD associated to the account’s corresponding segment.  Missing or unavailable values should be left blank.If the BHC generates this field, they are required to report it. ELGD is an input into the LGD calculation.",
                                        "category": "Persons"
                                    }
                                ],
                                "ocrText": "helloworld"
                            }
                        }
                    },
                    {
                        "entity": {
                            "type": "custom",
                            "types": [
                                "custom.all"
                            ],
                            "value": "Adolescent"
                        },
                        "displayValue": "Adolescent",
                        "data": {
                            "summary": [
                                "Persons"
                            ],
                            "details": {
                                "concepts": [
                                    {
                                        "score": 6,
                                        "uri": "http://www.nlm.nih.gov/mesh/D000293",
                                        "prefLabel": "Adolescent",
                                        "definition": "Report the Expected Loss Given Default (ELGD) parameter for the account as defined in the most recent capital framework. More specifically, report the ELGD associated to the account’s corresponding segment.  Missing or unavailable values should be left blank.If the BHC generates this field, they are required to report it. ELGD is an input into the LGD calculation.",
                                        "category": "Persons"
                                    }
                                ],
                                "ocrText": "helloworld"
                            }
                        }
                    },
                    {
                        "entity": {
                            "type": "custom",
                            "types": [
                                "custom.all"
                            ],
                            "value": "Minors"
                        },
                        "displayValue": "Minors",
                        "data": {
                            "summary": [
                                "Persons"
                            ],
                            "details": {
                                "concepts": [
                                    {
                                        "score": 16,
                                        "uri": "http://www.nlm.nih.gov/mesh/D033242",
                                        "prefLabel": "Minors",
                                        "definition": "Report the Expected Loss Given Default (ELGD) parameter for the account as defined in the most recent capital framework. More specifically, report the ELGD associated to the account’s corresponding segment.  Missing or unavailable values should be left blank.If the BHC generates this field, they are required to report it. ELGD is an input into the LGD calculation.",
                                        "category": "Persons"
                                    }
                                ],
                                "ocrText": "helloworld"
                            }
                        }
                    },
                    {
                        "entity": {
                            "type": "custom",
                            "types": [
                                "custom.all"
                            ],
                            "value": "Stomach"
                        },
                        "displayValue": "Stomach",
                        "data": {
                            "summary": [
                                "Digestive System"
                            ],
                            "details": {
                                "concepts": [
                                    {
                                        "score": 6,
                                        "uri": "http://www.nlm.nih.gov/mesh/D013270",
                                        "prefLabel": "Stomach",
                                        "definition": "Report the Expected Loss Given Default (ELGD) parameter for the account as defined in the most recent capital framework. More specifically, report the ELGD associated to the account’s corresponding segment.  Missing or unavailable values should be left blank.If the BHC generates this field, they are required to report it. ELGD is an input into the LGD calculation.",
                                        "category": "Digestive System"
                                    }
                                ],
                                "ocrText": "helloworld"
                            }
                        }
                    },
                    {
                        "entity": {
                            "type": "custom",
                            "types": [
                                "custom.all"
                            ],
                            "value": "Mouth"
                        },
                        "displayValue": "Mouth",
                        "data": {
                            "summary": [
                                "Stomatognathic System"
                            ],
                            "details": {
                                "concepts": [
                                    {
                                        "score": 6,
                                        "uri": "http://www.nlm.nih.gov/mesh/D009055",
                                        "prefLabel": "Mouth",
                                        "definition": "Report the Expected Loss Given Default (ELGD) parameter for the account as defined in the most recent capital framework. More specifically, report the ELGD associated to the account’s corresponding segment.  Missing or unavailable values should be left blank.If the BHC generates this field, they are required to report it. ELGD is an input into the LGD calculation.",
                                        "category": "Stomatognathic System"
                                    }
                                ],
                                "ocrText": "helloworld"
                            }
                        }
                    },
                    {
                        "entity": {
                            "type": "custom",
                            "types": [
                                "custom.all"
                            ],
                            "value": "Blood Vessels"
                        },
                        "displayValue": "Blood Vessels",
                        "data": {
                            "summary": [
                                "Cardiovascular System"
                            ],
                            "details": {
                                "concepts": [
                                    {
                                        "score": 11,
                                        "uri": "http://www.nlm.nih.gov/mesh/D001808",
                                        "prefLabel": "Blood Vessels",
                                        "definition": "Report the Expected Loss Given Default (ELGD) parameter for the account as defined in the most recent capital framework. More specifically, report the ELGD associated to the account’s corresponding segment.  Missing or unavailable values should be left blank.If the BHC generates this field, they are required to report it. ELGD is an input into the LGD calculation.",
                                        "category": "Cardiovascular System"
                                    }
                                ],
                                "ocrText": "helloworld"
                            }
                        }
                    },
                    {
                        "entity": {
                            "type": "custom",
                            "types": [
                                "custom.all"
                            ],
                            "value": "Heart"
                        },
                        "displayValue": "Heart",
                        "data": {
                            "summary": [
                                "Cardiovascular System"
                            ],
                            "details": {
                                "concepts": [
                                    {
                                        "score": 23,
                                        "uri": "http://www.nlm.nih.gov/mesh/D006321",
                                        "prefLabel": "Heart",
                                        "definition": "Report the Expected Loss Given Default (ELGD) parameter for the account as defined in the most recent capital framework. More specifically, report the ELGD associated to the account’s corresponding segment.  Missing or unavailable values should be left blank.If the BHC generates this field, they are required to report it. ELGD is an input into the LGD calculation.",
                                        "category": "Cardiovascular System"
                                    }
                                ],
                                "ocrText": "helloworld"
                            }
                        }
                    },
                    {
                        "entity": {
                            "type": "custom",
                            "types": [
                                "custom.all"
                            ],
                            "value": "Risk"
                        },
                        "displayValue": "Risk",
                        "data": {
                            "summary": [
                                "Investigative Techniques"
                            ],
                            "details": {
                                "concepts": [
                                    {
                                        "score": 20,
                                        "uri": "http://www.nlm.nih.gov/mesh/D012306",
                                        "prefLabel": "Risk",
                                        "definition": "Report the Expected Loss Given Default (ELGD) parameter for the account as defined in the most recent capital framework. More specifically, report the ELGD associated to the account’s corresponding segment.  Missing or unavailable values should be left blank.If the BHC generates this field, they are required to report it. ELGD is an input into the LGD calculation.",
                                        "category": "Investigative Techniques"
                                    }
                                ],
                                "ocrText": "helloworld"
                            }
                        }
                    },
                    {
                        "entity": {
                            "type": "custom",
                            "types": [
                                "custom.all"
                            ],
                            "value": "Blood Platelets"
                        },
                        "displayValue": "Blood Platelets",
                        "data": {
                            "summary": [
                                "Cells"
                            ],
                            "details": {
                                "concepts": [
                                    {
                                        "score": 21,
                                        "uri": "http://www.nlm.nih.gov/mesh/D001792",
                                        "prefLabel": "Blood Platelets",
                                        "definition": "Report the Expected Loss Given Default (ELGD) parameter for the account as defined in the most recent capital framework. More specifically, report the ELGD associated to the account’s corresponding segment.  Missing or unavailable values should be left blank.If the BHC generates this field, they are required to report it. ELGD is an input into the LGD calculation.",
                                        "category": "Cells"
                                    }
                                ],
                                "ocrText": "helloworld"
                            }
                        }
                    },
                    {
                        "entity": {
                            "type": "custom",
                            "types": [
                                "custom.all"
                            ],
                            "value": "Blood"
                        },
                        "displayValue": "Blood",
                        "data": {
                            "summary": [
                                "Hemic and Immune Systems"
                            ],
                            "details": {
                                "concepts": [
                                    {
                                        "score": 36,
                                        "uri": "http://www.nlm.nih.gov/mesh/D001769",
                                        "prefLabel": "Blood",
                                        "definition": "Report the Expected Loss Given Default (ELGD) parameter for the account as defined in the most recent capital framework. More specifically, report the ELGD associated to the account’s corresponding segment.  Missing or unavailable values should be left blank.If the BHC generates this field, they are required to report it. ELGD is an input into the LGD calculation.",
                                        "category": "Hemic and Immune Systems"
                                    }
                                ],
                                "ocrText": "helloworld"
                            }
                        }
                    },
                    {
                        "entity": {
                            "type": "custom",
                            "types": [
                                "custom.all"
                            ],
                            "value": "Diet"
                        },
                        "displayValue": "Diet",
                        "data": {
                            "summary": [
                                "Physiological Phenomena"
                            ],
                            "details": {
                                "concepts": [
                                    {
                                        "score": 12,
                                        "uri": "http://www.nlm.nih.gov/mesh/D004032",
                                        "prefLabel": "Diet",
                                        "definition": "Report the Expected Loss Given Default (ELGD) parameter for the account as defined in the most recent capital framework. More specifically, report the ELGD associated to the account’s corresponding segment.  Missing or unavailable values should be left blank.If the BHC generates this field, they are required to report it. ELGD is an input into the LGD calculation.",
                                        "category": "Physiological Phenomena"
                                    }
                                ],
                                "ocrText": "helloworld"
                            }
                        }
                    },
                    {
                        "entity": {
                            "type": "custom",
                            "types": [
                                "custom.all"
                            ],
                            "value": "Anti-Inflammatory Agents, Non-Steroidal"
                        },
                        "displayValue": "Anti-Inflammatory Agents, Non-Steroidal",
                        "data": {
                            "summary": [
                                "Chemical Actions and Uses"
                            ],
                            "details": {
                                "concepts": [
                                    {
                                        "score": 11,
                                        "uri": "http://www.nlm.nih.gov/mesh/D000894",
                                        "prefLabel": "Anti-Inflammatory Agents, Non-Steroidal",
                                        "definition": "Report the Expected Loss Given Default (ELGD) parameter for the account as defined in the most recent capital framework. More specifically, report the ELGD associated to the account’s corresponding segment.  Missing or unavailable values should be left blank.If the BHC generates this field, they are required to report it. ELGD is an input into the LGD calculation.",
                                        "category": "Chemical Actions and Uses"
                                    }
                                ],
                                "ocrText": "helloworld"
                            }
                        }
                    },
                    {
                        "entity": {
                            "type": "custom",
                            "types": [
                                "custom.all"
                            ],
                            "value": "Prostaglandin-Endoperoxide Synthases"
                        },
                        "displayValue": "Prostaglandin-Endoperoxide Synthases",
                        "data": {
                            "summary": [
                                "Macromolecular Substances"
                            ],
                            "details": {
                                "concepts": [
                                    {
                                        "score": 3,
                                        "uri": "http://www.nlm.nih.gov/mesh/D011451",
                                        "prefLabel": "Prostaglandin-Endoperoxide Synthases",
                                        "definition": "Report the Expected Loss Given Default (ELGD) parameter for the account as defined in the most recent capital framework. More specifically, report the ELGD associated to the account’s corresponding segment.  Missing or unavailable values should be left blank.If the BHC generates this field, they are required to report it. ELGD is an input into the LGD calculation.",
                                        "category": "Macromolecular Substances"
                                    }
                                ],
                                "ocrText": "helloworld"
                            }
                        }
                    },
                    {
                        "entity": {
                            "type": "custom",
                            "types": [
                                "custom.all"
                            ],
                            "value": "Affect"
                        },
                        "displayValue": "Affect",
                        "data": {
                            "summary": [
                                "Behavior and Behavior Mechanisms"
                            ],
                            "details": {
                                "concepts": [
                                    {
                                        "score": 3,
                                        "uri": "http://www.nlm.nih.gov/mesh/D000339",
                                        "prefLabel": "Affect",
                                        "definition": "Report the Expected Loss Given Default (ELGD) parameter for the account as defined in the most recent capital framework. More specifically, report the ELGD associated to the account’s corresponding segment.  Missing or unavailable values should be left blank.If the BHC generates this field, they are required to report it. ELGD is an input into the LGD calculation.",
                                        "category": "Behavior and Behavior Mechanisms"
                                    }
                                ],
                                "ocrText": "helloworld"
                            }
                        }
                    },
                    {
                        "entity": {
                            "type": "custom",
                            "types": [
                                "custom.all"
                            ],
                            "value": "Chickenpox"
                        },
                        "displayValue": "Chickenpox",
                        "data": {
                            "summary": [
                                "Virus Diseases"
                            ],
                            "details": {
                                "concepts": [
                                    {
                                        "score": 5,
                                        "uri": "http://www.nlm.nih.gov/mesh/D002644",
                                        "prefLabel": "Chickenpox",
                                        "definition": "Report the Expected Loss Given Default (ELGD) parameter for the account as defined in the most recent capital framework. More specifically, report the ELGD associated to the account’s corresponding segment.  Missing or unavailable values should be left blank.If the BHC generates this field, they are required to report it. ELGD is an input into the LGD calculation.",
                                        "category": "Virus Diseases"
                                    }
                                ],
                                "ocrText": "helloworld"
                            }
                        }
                    },
                    {
                        "entity": {
                            "type": "custom",
                            "types": [
                                "custom.all"
                            ],
                            "value": "Metabolism"
                        },
                        "displayValue": "Metabolism",
                        "data": {
                            "summary": [
                                "Metabolic Phenomena"
                            ],
                            "details": {
                                "concepts": [
                                    {
                                        "score": 13,
                                        "uri": "http://www.nlm.nih.gov/mesh/D008660",
                                        "prefLabel": "Metabolism",
                                        "definition": "Report the Expected Loss Given Default (ELGD) parameter for the account as defined in the most recent capital framework. More specifically, report the ELGD associated to the account’s corresponding segment.  Missing or unavailable values should be left blank.If the BHC generates this field, they are required to report it. ELGD is an input into the LGD calculation.",
                                        "category": "Metabolic Phenomena"
                                    }
                                ],
                                "ocrText": "helloworld"
                            }
                        }
                    }

                ]
            );
            done();
        });
    });


    it('should return categories over 0.18', function (done) {
        let newOptions = {};
        _.assign(newOptions, options);
        newOptions.minimumCategoryScore = 0.18;

        integration.doLookup([{
            type: 'custom',
            types: ['custom.all'],
            value: options.text
        }], newOptions, function (err, result) {
            //console.info(JSON.stringify(result, null, 4));
            expect(err).to.be.null;
            expect(result).to.deep.equal([
                    {
                        "entity": {
                            "type": "custom",
                            "types": [
                                "custom.all"
                            ],
                            "value": "Hemorrhage"
                        },
                        "displayValue": "Hemorrhage",
                        "data": {
                            "summary": [
                                "Pathological Conditions, Signs and Symptoms"
                            ],
                            "details": {
                                "concepts": [
                                    {
                                        "score": 6,
                                        "uri": "http://www.nlm.nih.gov/mesh/D006470",
                                        "prefLabel": "Hemorrhage",
                                        "definition": "Report the Expected Loss Given Default (ELGD) parameter for the account as defined in the most recent capital framework. More specifically, report the ELGD associated to the account’s corresponding segment.  Missing or unavailable values should be left blank.If the BHC generates this field, they are required to report it. ELGD is an input into the LGD calculation.",
                                        "category": "Pathological Conditions, Signs and Symptoms"
                                    }
                                ],
                                "ocrText": "helloworld"
                            }
                        }
                    },
                    {
                        "entity": {
                            "type": "custom",
                            "types": [
                                "custom.all"
                            ],
                            "value": "Tinnitus"
                        },
                        "displayValue": "Tinnitus",
                        "data": {
                            "summary": [
                                "Pathological Conditions, Signs and Symptoms"
                            ],
                            "details": {
                                "concepts": [
                                    {
                                        "score": 6,
                                        "uri": "http://www.nlm.nih.gov/mesh/D014012",
                                        "prefLabel": "Tinnitus",
                                        "definition": "Report the Expected Loss Given Default (ELGD) parameter for the account as defined in the most recent capital framework. More specifically, report the ELGD associated to the account’s corresponding segment.  Missing or unavailable values should be left blank.If the BHC generates this field, they are required to report it. ELGD is an input into the LGD calculation.",
                                        "category": "Pathological Conditions, Signs and Symptoms"
                                    }
                                ],
                                "ocrText": "helloworld"
                            }
                        }
                    },
                    {
                        "entity": {
                            "type": "custom",
                            "types": [
                                "custom.all"
                            ],
                            "value": "Fever"
                        },
                        "displayValue": "Fever",
                        "data": {
                            "summary": [
                                "Pathological Conditions, Signs and Symptoms"
                            ],
                            "details": {
                                "concepts": [
                                    {
                                        "score": 15,
                                        "uri": "http://www.nlm.nih.gov/mesh/D005334",
                                        "prefLabel": "Fever",
                                        "definition": "Report the Expected Loss Given Default (ELGD) parameter for the account as defined in the most recent capital framework. More specifically, report the ELGD associated to the account’s corresponding segment.  Missing or unavailable values should be left blank.If the BHC generates this field, they are required to report it. ELGD is an input into the LGD calculation.",
                                        "category": "Pathological Conditions, Signs and Symptoms"
                                    }
                                ],
                                "ocrText": "helloworld"
                            }
                        }
                    },
                    {
                        "entity": {
                            "type": "custom",
                            "types": [
                                "custom.all"
                            ],
                            "value": "Pain"
                        },
                        "displayValue": "Pain",
                        "data": {
                            "summary": [
                                "Pathological Conditions, Signs and Symptoms"
                            ],
                            "details": {
                                "concepts": [
                                    {
                                        "score": 16,
                                        "uri": "http://www.nlm.nih.gov/mesh/D010146_1",
                                        "prefLabel": "Pain",
                                        "definition": "Report the Expected Loss Given Default (ELGD) parameter for the account as defined in the most recent capital framework. More specifically, report the ELGD associated to the account’s corresponding segment.  Missing or unavailable values should be left blank.If the BHC generates this field, they are required to report it. ELGD is an input into the LGD calculation.",
                                        "category": "Pathological Conditions, Signs and Symptoms"
                                    }
                                ],
                                "ocrText": "helloworld"
                            }
                        }
                    },
                    {
                        "entity": {
                            "type": "custom",
                            "types": [
                                "custom.all"
                            ],
                            "value": "Ulcer"
                        },
                        "displayValue": "Ulcer",
                        "data": {
                            "summary": [
                                "Pathological Conditions, Signs and Symptoms"
                            ],
                            "details": {
                                "concepts": [
                                    {
                                        "score": 6,
                                        "uri": "http://www.nlm.nih.gov/mesh/D014456",
                                        "prefLabel": "Ulcer",
                                        "definition": "Report the Expected Loss Given Default (ELGD) parameter for the account as defined in the most recent capital framework. More specifically, report the ELGD associated to the account’s corresponding segment.  Missing or unavailable values should be left blank.If the BHC generates this field, they are required to report it. ELGD is an input into the LGD calculation.",
                                        "category": "Pathological Conditions, Signs and Symptoms"
                                    }
                                ],
                                "ocrText": "helloworld"
                            }
                        }
                    },
                    {
                        "entity": {
                            "type": "custom",
                            "types": [
                                "custom.all"
                            ],
                            "value": "Death"
                        },
                        "displayValue": "Death",
                        "data": {
                            "summary": [
                                "Pathological Conditions, Signs and Symptoms"
                            ],
                            "details": {
                                "concepts": [
                                    {
                                        "score": 7,
                                        "uri": "http://www.nlm.nih.gov/mesh/D003643",
                                        "prefLabel": "Death",
                                        "definition": "Report the Expected Loss Given Default (ELGD) parameter for the account as defined in the most recent capital framework. More specifically, report the ELGD associated to the account’s corresponding segment.  Missing or unavailable values should be left blank.If the BHC generates this field, they are required to report it. ELGD is an input into the LGD calculation.",
                                        "category": "Pathological Conditions, Signs and Symptoms"
                                    }
                                ],
                                "ocrText": "helloworld"
                            }
                        }
                    }
                ]
            );
            done();
        });
    });

    it('should return categories over 0.18 and concepts over 10', function (done) {
        let newOptions = {};
        _.assign(newOptions, options);
        newOptions.minimumCategoryScore = 0.18;
        newOptions.minimumConceptScore = 10;

        integration.doLookup([{
            type: 'custom',
            types: ['custom.all'],
            value: options.text
        }], newOptions, function (err, result) {
            //console.info(JSON.stringify(result, null, 4));
            expect(err).to.be.null;
            expect(result).to.deep.equal(
                [
                    {
                        "entity": {
                            "type": "custom",
                            "types": [
                                "custom.all"
                            ],
                            "value": "Fever"
                        },
                        "displayValue": "Fever",
                        "data": {
                            "summary": [
                                "Pathological Conditions, Signs and Symptoms"
                            ],
                            "details": {
                                "concepts": [
                                    {
                                        "score": 15,
                                        "uri": "http://www.nlm.nih.gov/mesh/D005334",
                                        "prefLabel": "Fever",
                                        "definition": "Report the Expected Loss Given Default (ELGD) parameter for the account as defined in the most recent capital framework. More specifically, report the ELGD associated to the account’s corresponding segment.  Missing or unavailable values should be left blank.If the BHC generates this field, they are required to report it. ELGD is an input into the LGD calculation.",
                                        "category": "Pathological Conditions, Signs and Symptoms"
                                    }
                                ],
                                "ocrText": "helloworld"
                            }
                        }
                    },
                    {
                        "entity": {
                            "type": "custom",
                            "types": [
                                "custom.all"
                            ],
                            "value": "Pain"
                        },
                        "displayValue": "Pain",
                        "data": {
                            "summary": [
                                "Pathological Conditions, Signs and Symptoms"
                            ],
                            "details": {
                                "concepts": [
                                    {
                                        "score": 16,
                                        "uri": "http://www.nlm.nih.gov/mesh/D010146_1",
                                        "prefLabel": "Pain",
                                        "definition": "Report the Expected Loss Given Default (ELGD) parameter for the account as defined in the most recent capital framework. More specifically, report the ELGD associated to the account’s corresponding segment.  Missing or unavailable values should be left blank.If the BHC generates this field, they are required to report it. ELGD is an input into the LGD calculation.",
                                        "category": "Pathological Conditions, Signs and Symptoms"
                                    }
                                ],
                                "ocrText": "helloworld"
                            }
                        }
                    }
                ]
            );
            done();
        });
    });
});

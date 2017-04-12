# Polarity PoolParty Integration

Polarity's PoolParty integration gives users access to entity definitions.  This is an experimental integration that makes use of PoolParty's categorization service to extract entities of interest.

For more information on the PoolParty categorization service please see [https://help.poolparty.biz/doc/developer-guide/enterprise-server-apis/entity-extractor-api-guide/categorization-service]().
  
> Note that the categorization capability is a PoolParty enterprise feature.

## PoolParty Settings

### Concept URL

The URL for your PoolParty instance.  If you are using a PoolParty demo account you would be using `https://enterprise.poolparty.biz/PoolParty/`. 
 
### Project Name

The name of the PoolParty project you want to search 

### Username

Your PoolParty Username

### Password

Your PoolParty Password

### Project Id

The Thesaurus Project Id that you want to use. The Project Id will look something like "1DAB0E22-3005-0001-6A68-3EB01EB220C0"

### Language

The language of the text being categorized (en|de|es|fr|...)

### Minimum Category Score

The minimum category score (between 0.0 and 1.0) required for a category's concepts to be included in the results.
  
### Minimum Concept Score

The minimum concept score (between 0 and 100) required for a concept to be included in the results.  Note that if a "Minimum Category Score" is also provided then the category minimum and the concept minimum scores must be met.

### Show Broader Concepts

If checked, the integration will show broader concepts
   
### Show Narrower Concepts

If checked, the integration will show narrower concepts

### Show Related Concepts

If checked, the integration will show related concepts

## Installation Instructions

Installation instructions for integrations are provided on the [PolarityIO GitHub Page](https://polarityio.github.io/).

## Polarity

Polarity is a memory-augmentation platform that improves and accelerates analyst decision making.  For more information about the Polarity platform please see: 

https://polarity.io/

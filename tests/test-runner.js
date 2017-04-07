'use strict';

let poolparty = require('./integration');

let options = {
    username: 'demoadmin',
    password: '',
    project: 'cocktails',
    url: 'https://enterprise.poolparty.biz'
};

poolparty.doLookup([{
    value: 'sour'
}], options, function(err, length, result){
   if(err){
       console.info(JSON.stringify(err, null, 4));
   }else{
       console.info(JSON.stringify(result, null, 4));
   }
});

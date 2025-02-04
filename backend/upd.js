var checkUpdate = require('check-update-github');
var pkg = require('../package.json');

checkUpdate({
    name: pkg.name, 
    currentVersion: pkg.version, 
    user: 'slingexe',
    branch: 'main'
    }, function(err, latestVersion, defaultMessage){
    if(!err){
        console.log(defaultMessage);
    }
});
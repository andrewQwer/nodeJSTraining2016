var fs = require('fs');

fs.writeFile('file.tmp', 'data', function (err) {
    if (err) throw err;

    fs.rename('file.tmp', 'newFile.tmp', function (err) {
        if (err) throw err;

        fs.unlink('newFile.tmp', function (err) {
            if (err) throw err;
        })
    })
});
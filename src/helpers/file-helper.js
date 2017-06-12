'use strict';
var File = require('../database/models').File;
var fs = require('fs');

class FileHelper {

    deleteById(id) {
        File.findById(id).then(function (_file) {
            if (_file) {
                var fileUrl = _file.url;
                File.destroy({ where: { id: id } }).then(function () {
                    var file_url = appRoot + fileUrl;
                    try {
                        fs.unlinkSync(file_url);
                    }
                    catch (ex) { }
                });
            }
        });
    }
}
module.exports = new FileHelper();
'use strict';
module.factory('FileService', ['$rootScope', '$http', '$q', 'URLS', function ($rootScope, $http, $q, URLS) {

    var service = 'files';

    return {
        upload: function (file) {
            return $q(function (resolve, reject) {
                var fd = new FormData();
                fd.append('file', file);
                $http.post(URLS.model(service).all, fd, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                })
                .success(function (res) {
                    resolve(res.data);
                })
                .error(function (err) {
                    reject(err);
                });
            });
        }
    };
}]);
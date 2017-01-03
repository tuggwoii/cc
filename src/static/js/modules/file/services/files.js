'use strict';
module.factory('FileService', ['$rootScope', '$http', '$q', 'URLS', function ($rootScope, $http, $q, URLS) {

    var service = 'files';

    return {
        upload: function (file, car) {

            return $q(function (resolve, reject) {
                var fd = new FormData();
                var url = URLS.model(service).all + (car ? ('?car=' + car) : '');
                console.log('Send upload reques to: ' + url);
                fd.append('file', file);
                $http.post(url, fd, {
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
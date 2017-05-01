'use strict';
module.factory('FileService', ['$rootScope', '$http', '$q', 'URLS', function ($rootScope, $http, $q, URLS) {

    var service = 'files';

    return {
        get: function (query) {
            var key = URLS.model(service).all + '?p=' + query.p + (query.q ? '&q=' + query.q : '');
            return $q(function (resolve, reject) {
                $http.get(key).then(function (res) {
                    resolve(res.data);
                })
                .catch(function (err) {
                    reject(err);
                });
            });
        },
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
                .then(function (res) {
                    resolve(res.data.data);
                })
                .catch(function (err) {
                    reject(err);
                });
            });
        },
        delete: function (id) {
            var key = URLS.model(service).one.replace('{id}', id);
            return $q(function (resolve, reject) {
                $http.delete(key).then(function (res) {
                    resolve(res.data);
                })
                .catch(function (err) {
                    reject(err);
                });
            });
        }
    };
}]);
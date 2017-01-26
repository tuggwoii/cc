'use strict';
module.factory('ShareService', ['$http', '$q', 'URLS', function ($http, $q, URLS) {

    var service = 'shares';
    var cache = {};

    return {
        get: function (p, q) {
            var key = URLS.model(service).all
                + ('?p=' + p)
                + ( q['q']? '&q=' + q['q'] : '')
                + ('&limits=' + q['limits'])
                + (q['work'] ? '&work=' + q['work'] : '')
                + (q['province'] ? '&province=' + q['province'] : '')
                + (q['months'] ? '&months=' + q['months'] : '')
                 + (q['year'] ? '&year=' + q['year'] : '')
                + (q['lp'] ? '&lp=' + q['lp'] : '')
                + (q['hp'] ? '&hp=' + q['hp'] : '')
                + (q['rating'] ? '&rating=' + q['rating'] : '')
                + (q['hasimage'] ? '&hasimage=' + q['hasimage'] : '')
                + (q['sort_column'] ? '&sort_column=' + q['sort_column'] : '')
                + (q['sort_order'] ? '&sort_order=' + q['sort_order'] : '')
            ;
            return $q(function (resolve, reject) {
                if (cache[key]) {
                    //resolve(cache[key]);
                }
                //else {
                    $http.get(key).success(function (res) {
                        cache[key] = res;
                        resolve(res);
                    }).error(function (res) {
                        reject(res);
                    });
                //}
            });
        },
        getById: function (id) {
            return $q(function (resolve, reject) {
                var key = URLS.model(service).one.replace('{id}', id);
                if (cache[key]) {
                    resolve(cache[key]);
                }
                else {
                    $http.get(key).success(function (res) {
                        cache[key] = res.data;
                        resolve(res.data);
                    }).error(function (res) {
                        reject(res);
                    });
                }
            });
        },
        countView: function (id) {
            var key = URLS.model('repairs').countView.replace('{id}', id);
            return $q(function (resolve, reject) {
                if (id) {
                    $http.patch(key).success(function (res) {
                        cache[key] = res;
                        resolve(res);
                    }).error(function (res) {
                        reject(res)
                    });
                }
                else {
                    reject('INVALID');
                }
            });
        },
        clearCache: function () {
            cache = {};
        }
    };
}]);
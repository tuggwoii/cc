'use strict';
module.factory('PageService', ['$q', function ($q) {

    return {
        onLoad: function (string, car, work, notification, share) {

            return $q(function (resolve, reject) {
                if (error_404 || error_500) {
                    resolve();
                }
                else if (window.location.href.indexOf('share/') > -1) {
                    resolve();
                }
                else if (window.location.hash.split('?')[0] == '#/car') {
                    if (string && car && work) {
                        resolve();
                    }
                    else {
                        reject();
                    }
                }
                else {
                    if (string && car && work && notification && share) {
                        resolve();
                    }
                    else {
                        reject();
                    }
                }
            })
        }
    };
}]);

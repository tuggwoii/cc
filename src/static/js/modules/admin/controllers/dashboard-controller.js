'use strict';
module.controller('DashboardController', ['$scope', '$timeout', '$q',
function ($scope, $timeout, $q) {

    function loadResources() {
        $q.all([

        ]).then(function () {

        });
        $scope.displayView();
    }

    function isValid() {
        return $scope.user && $scope.user.id && $scope.user.role.id == 1;
    }

    $scope.dashboardPage = function () {
        if ($scope.user_ready) {
            if (isValid()) {
                loadResources();
            }
            else {
                window.location.hash = '#!/';
            }
        }
        else {
            $timeout(function () {
                $scope.dashboardPage();
            }, 1000);
        }
    };

    $scope.dashboardPage();
}]);

'use strict';
module.factory('Event', [function () {

    return {
        Page: {
            Ready: 'READY'
        },
        Load: {
            Display: 'DISPLAY_LOAD',
            Dismiss: 'DISMISS_LOAD'
        }
    };
}]);

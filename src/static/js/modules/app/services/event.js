'use strict';
module.factory('Event', [function () {

    return {
        User: {
            Update: 'UPDATE_USER',
            Loaded: 'USER_LOADED'
        },
        Page: {
            Ready: 'READY'
        },
        Load: {
            Display: 'DISPLAY_LOAD',
            Dismiss: 'DISMISS_LOAD'
        }
    };
}]);

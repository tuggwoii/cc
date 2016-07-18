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
        },
        Confirm: {
            Display: 'DISPLAY_CONFIRM',
            Dismiss: 'DISMISS_CONFIRM'
        },
        Car: {
            PickCar: 'SELECT_CAR',
            Clear: 'CLEAR_ACTIVE',
            SetActive: 'SET_ACTIVE',
            Update: 'UPDATE_CAR'
        },
        File: {
            Success: 'UPLOAD_SUCCESS'
        }
    };
}]);

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
        },
        Share: {
            Ready: 'SHARE_READY'
        },
        Shop: {
            DispayPopup:'DISPLAY_SHOP_POPUP'
        },
        Notification: {
            Ready: 'NOTIFICATION_READY',
            DisplayPopup: 'DISPLAY_NOTIFICATION_POPUP'
        },
        Work: {
            DisplayPopup: 'DISPLAY_WORK_POPUP'
        },
        Repair: {
            DisplayCaptionPopup: 'DISPLAY_IMAGE_CAPTION_POPUP'
        },
        Workgroup: {
            DisplayWorkgroupPopup: 'DISPLAY_WORKGROUP_POPUP'
        },
        Message: {
            Display: 'DISPLAY_MESSAGE',
            Dismiss: 'DISMISS_MESSAGE'
        },
    };
}]);

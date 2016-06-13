function API(fb_creds, callback) {
    FB.api('/me?fields=name,email', function (response) {
        var creds = response;
        creds.fb_token = fb_creds.authResponse.accessToken;
        callback(creds);
    });
}

function statusChangeCallback(response, resolve, reject) {
    if (response.status === 'connected') {
        API(response, resolve);
    } else {
        reject();
    }
}
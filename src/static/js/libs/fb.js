function API(fb_creds, callback) {
    FB.api('/me?fields=name,email', function (response) {
        console.log('FB_CRED', fb_creds);
        var creds = response;
        creds.fb_token = fb_creds.authResponse.accessToken;
        callback(creds);
    });
}

function statusChangeCallback(response, resolve, reject) {
    console.log('statusChangeCallback', response)
    if (response.status === 'connected') {
        API(response, resolve);
    } else {
        reject();
    }
}
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

var qrcode;
chrome.tabs.executeScript({
    code: '(' + function () {
        return {
            _url: window.location.href,
            _time: document.querySelector('.ytp-time-current').innerText,
        };
    } + ')()'
}, function (r) {
    var err;
    if (r !== undefined) {
        var result = r[0];
        if (result) {
            var url = new URL(result._url);
            var videoId = getParameterByName("v", url);
            var time = result._time.split(":")[0] * 60 + result._time.split(":")[1] * 1;
            console.log(time);
            if (url.hostname === "www.youtube.com" && videoId !== null) {
                qrcode.clear();
                qrcode.makeCode("https://" + url.hostname.toString() + "/watch?v=" + videoId + "?t=" + time);
            } else {
                err = "Only working on youtube";
            }
        } else {
            err = "Only working on youtube"
        }
    } else {
        err = "Only working on youtube";
    }
    
    if (err) document.querySelector('#warning').innerHTML = err;
});

window.onload = () => {
    qrcode = new QRCode("qrcode");
};
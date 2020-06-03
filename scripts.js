function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function notYoutubeError() {
    document.querySelector('#warning').innerHTML = "Only working on youtube";
}

var qrcode;
chrome.tabs.executeScript({
    code: '(' + function () {
        return {
            _url: window.location.href,
            _time: document.querySelector('.ytp-time-current').innerText,
        };
    } + ')()'
}, function (results) {
    if (results !== undefined) {
        var result = results[0];
        if (result) {
            var url = new URL(result._url);
            var videoId = getParameterByName("v", url);
            var time = result._time.split(":")[0] * 60 + result._time.split(":")[1] * 1;
            if (url.hostname === "www.youtube.com" && videoId !== null) {
                qrcode.clear();
                qrcode.makeCode("https://" + url.hostname.toString() + "/watch?v=" + videoId + "?t=" + time);
                return;
            }
        }
    }
    notYoutubeError();
});

window.onload = () => {
    qrcode = new QRCode("qrcode");
};
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

var url;
var qrcode;
var time;
var videoId;
chrome.tabs.executeScript({
    code: '(' + function () {
        return {
            _url: window.location.href,
            _time: document.querySelector('.ytp-time-current').innerText,
        };
    } + ')()'
}, function (r) {
    var result = r[0];
    if (result) {
        url = new URL(result._url);
        videoId = getParameterByName("v", url);
        time = result._time.split(":")[0] * 60 + result._time.split(":")[1] * 1;
        console.log(time);
        if (url.hostname === "www.youtube.com" && videoId !== null) {
            qrcode.clear();
            qrcode.makeCode("https://" + url.hostname.toString() + "/watch?v=" + videoId + "?t=" + time);
        } else {
            document.querySelector('#warning').innerHTML = "Only working on youtube";
        }
    } else {
        document.querySelector('#warning').innerHTML = "Only working on youtube";
    }
});

window.onload = () => {
    qrcode = new QRCode("qrcode");
};
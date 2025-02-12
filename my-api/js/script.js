
$(document).ready(function () {
    console.log("Script loaded!");

    (function () {
        console.log("Intercepting POST requests...");
        const originalSend = XMLHttpRequest.prototype.send;
        
        XMLHttpRequest.prototype.send = function (body) {
            console.log("Intercepted POST request body:", body);
            return originalSend.apply(this, arguments);
        };
    })();
});
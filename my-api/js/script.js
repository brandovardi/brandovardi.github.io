(function() {
    const originalFetch = window.fetch;
    window.fetch = async function(resource, options) {
        if (options && options.method === "POST") {
            // console.log("Intercepted fetch POST request to:", resource);
            // console.log("Request body:", options.body);

            // take the url parameter
            let url = new URL(resource);
            // run the python script passing the url parameter
            let git_link = "http://brandovardi.github.io/my-api/py/x.py ";
            let response = await fetch(git_link + url.searchParams.get("url"));
            let data = await response.json();
            console.log(data);
        }
        return originalFetch.apply(this, arguments);
    };
})();
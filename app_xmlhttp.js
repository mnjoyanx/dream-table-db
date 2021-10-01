let production = false;

let production_host = "http://localhost:3000/";
let development_host = "http://localhost:5000/";

let host = production ? production_host : development_host;

let url = {
    table_1: host + 'table_1',
}

let Request = {
    table_1: {
        get: (body, cb, err) => {
            request('get', url.table_1, body, cb, err);
        },
        post: (body, cb, err) => {
            request('post', url.table_1, body, cb, err);
        },
        put: (body, cb, err) => {
            request('put', url.table_1, body, cb, err);
        },
        delete: (body, cb, err) => {
            request('delete', url.table_1, body, cb, err);
        }
    }
};

function request(method, url, body, callback, error_collback) {

    var req = new XMLHttpRequest();

    req.timeout = 100000;

    req.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) {

            var data = JSON.parse(this.responseText)

            let {
                error,
                message
            } = data;

            if (error) {

                if (!error_collback) return console.log(message);

                error_collback(message);

            } else {

                if (!callback) return console.log(message);

                callback(message);

            }

        }

    }

    req.onerror = function(err) {
        if (error_collback) error_collback(err.message);
    }

    req.ontimeout = function(err) {
        if (error_collback) error_collback(err.message);
    }

    if (method == "get" && body) {
        url += build_query(body);
        body = {};
    }

    req.open(method, url, true);

    req.setRequestHeader("Authorization", localStorage.getItem("token"));
    req.setRequestHeader("Content-Type", "application/json");

    req.send(JSON.stringify(body));

}

function build_query(object) {

    let params = [];

    for (var key in object) {

        var value = object[key];

        if (typeof value == "object") {
            value = JSON.stringify(value);
        }

        params.push(key + "=" + value);

    }

    params = params.join("&");

    return "?" + params;

};
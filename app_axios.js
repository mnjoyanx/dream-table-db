import axios from "dbs/js/exporter/templates/axios";

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

const request = (method, url, body, callback, error_collback) => {

    let options = {
        url,
        method,
        timeout: 10000,
        headers: {
            "Authorization": localStorage.getItem("token"),
            "content-type": "application/json"
        },
    }

    if (method == "get") {
        options.params = body;
    } else {
        options.data = body;
    }

    axios(options)
        .then((response) => {

            let {
                error,
                message
            } = response.data;

            if (error) {

                if (!error_collback) return console.log(message);

                error_collback(message);

            } else {

                if (!callback) return console.log(message);

                callback(message);

            }

        })
        .catch((error) => {
            console.log(error);
        });
};

export default Request;
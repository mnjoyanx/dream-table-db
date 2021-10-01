const Op = require("sequelize").Op;

function SUCCESS(res, message, status) {
    return res.json({ error: false, message, status });
}

function ERROR(res, message, status) {
    return res.json({ error: true, message, status });
}

function GETTER(model, req, res, optionCb, cb, err) {

    if (!err) {
        err = (err) => {
            return ERROR(res, err.message);
        }
    }

    let options = { where: {} };

    let page = 0;
    let limit = 10;
    let offset = 0;

    let pagination = req.query.pagination || req.body.pagination || false;

    let reqLimit = req.query.limit || req.body.limit;

    if (reqLimit) {
        limit = parseInt(reqLimit);
    }

    let reqPage = req.query.page || req.body.page;

    if (reqPage) {
        page = parseInt(reqPage) - 1;
        offset = page * limit;
    }

    let reqFilter = req.query.filter || req.body.filter;

    if (reqFilter) {

        let filter = {};

        try {

            if (typeof reqFilter == "object") {
                filter = reqFilter;
            } else {
                filter = JSON.parse(reqFilter);
            }

            options.where = filter;

        } catch (e) {
            err(e);
            return;
        }
    }

    let reqSearch = req.query.search || req.body.search;

    if (reqSearch) {

        let search = {};

        try {

            if (typeof reqSearch == "object") {
                search = reqSearch;
            } else {
                search = JSON.parse(reqSearch);
            }

            try {

                let search_obj = [];

                for (let key in search) {

                    search_obj.push({
                        [key]: {
                            [Op.like]: "%" + search[key] + "%"
                        }
                    });

                }

                options.where = { ...options.where, [Op.or]: search_obj };

            } catch (e) {
                console.log(e);
            }

        } catch (e) {
            err(e);
            return;
        }
    }

    let sort = req.query.sort || req.body.sort;

    if (sort) {

        if (typeof sort == "string") {
            sort = sort.split(",")
        }

        if (Array.isArray(sort)) {
            options.order = [sort];
        }

    }

    let between = req.query.between || req.body.between;

    if (between) {

        try {

            if (typeof between != "object") {
                between = JSON.parse(between);
            }

            for (let key in between) {

                let from = null,
                    to = null;

                if (typeof between[key] != "object") {
                    from = between[key];
                } else {
                    from = between[key].from;
                    to = between[key].to;
                }

                if (from && to) {

                    options.where[key] = {
                        [Op.between]: [from, to]
                    }

                } else if (from && !to) {

                    options.where[key] = {
                        [Op.gte]: from
                    }

                } else if (!from && to) {

                    options.where[key] = {
                        [Op.lte]: to
                    }

                }
            }

        } catch (e) {
            err(e);
            return;
        }

    }

    var find_type = "findAll";

    if (pagination) {
        options.limit = limit;
        options.offset = offset;
        find_type = "findAndCountAll";
        options.distinct = true;
    }

    options = optionCb(options);

    model[find_type](options)
        .then((data) => {

            if (pagination) {

                page += 1;

                data.pageCount = Math.ceil(data.count / limit);
                data.currentPage = page;

                let pages = [];

                for (let i = 0; i < data.pageCount; i++) {
                    pages.push(i + 1);
                }

                data.limit = limit;

                data.isLastPage = parseInt(page) == data.pageCount;

                data.pages = pages;

            }

            cb(data);

        }).catch(err);

}

module.exports = {
    SUCCESS, ERROR, GETTER
}
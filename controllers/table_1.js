const {
    Op,
    Sequelize,
    Table_1
} = require('../models');

const {
    SUCCESS,
    GETTER,
    ERROR
} = require('../utils');

function get(req, res) {

    GETTER(Table_1, req, res, (options) => {
        return options;
    }, (data) => {
        SUCCESS(res, data, 200);
    });

}

function add(req, res) {

    let {
        name,
        username,
        email
    } = req.body

    if (!name) return ERROR(res, 'name is required');
    if (!username) return ERROR(res, 'username is required');
    if (!email) return ERROR(res, 'email is required');

    Table_1.create(req.body)
        .then((data) => {
            SUCCESS(res, data, 200);
        })
        .catch(err => {
            ERROR(res, err.message);
        });

}

function update(req, res) {

    if (!req.body.id) return ERROR(res, 'id is required');

    Table_1.update(req.body, {
            where: {
                id: req.body.id
            }
        })
        .then(() => {
            SUCCESS(res, 'Updated', 200);
        })
        .catch(err => {
            ERROR(res, err.message);
        });

}

function remove(req, res) {

    if (!req.body.id) return ERROR(res, 'id is required');

    let id = req.body.id.toString().split(',');

    Table_1.destroy({
            where: {
                id: {
                    [Op.in]: id
                }
            }
        })
        .then(() => {
            SUCCESS(res, 'Deleted', 200);
        }).catch(err => {
            ERROR(res, err.message);
        });

}

module.exports = {
    get,
    add,
    update,
    remove
}
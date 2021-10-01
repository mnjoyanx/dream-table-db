module.exports = (sequelize, dataType) => {

    return sequelize.define("table_1", {
        name: {
            type: dataType.STRING(250),
            allowNull: false,
        },
        username: {
            type: dataType.STRING(250),
            allowNull: false,
        },
        email: {
            type: dataType.STRING(250),
            allowNull: false,
        },
    });
}
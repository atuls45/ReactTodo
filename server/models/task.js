module.exports = (sequelize, DataTypes) => {
    let Task = sequelize.define("task", {
        title: {
            type: DataTypes.TEXT,
            allowNull: false
          },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
          },
        userId: DataTypes.INTEGER,
        isDone: {type: DataTypes.BOOLEAN, defaultValue: false},
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        }
    });

    Task.associate = models => {
        Task.belongsTo(models.user, {
            foreignKey: 'userId',
            foreignKeyConstraint: true
        });
    };
    return Task;
};

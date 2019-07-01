module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define("user", {
    firstName: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    lastName: DataTypes.TEXT,
    username: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    }
  });
  return User;
};

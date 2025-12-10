import { DataTypes } from "sequelize";

export const User = (sequelize) => {
  const UserModel = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      userTag: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
      },

      accountNumber: {
        type: DataTypes.STRING,
        unique: true,
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      avgSpending: {
        type: DataTypes.DECIMAL(20, 2),
        defaultValue: 0,
      },

      accountBalance: {
        type: DataTypes.DECIMAL(20, 2),
        defaultValue: 0,
      },

      centroidLat: {
        type: DataTypes.DOUBLE,
        defaultValue: 0,
      },

      centroidLng: {
        type: DataTypes.DOUBLE,
        defaultValue: 0,
      },

      sumDeviation: {
        type: DataTypes.DOUBLE,
        defaultValue: 0,
      },

      pin: {
        type: DataTypes.STRING,
        defaultValue: 0,
      },


      meanDeviation: {
        type: DataTypes.DOUBLE,
        defaultValue: 0,
      },

      txnCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },

      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      }
    
    },

    { tableName: "User", timestamps: false,validate: {} }
  );

  // 🔥 Auto-generate userTag when user is created
  UserModel.beforeCreate((user) => {
    if (user.email) {
      const emailPrefix = user.email.split("@")[0];
      user.userTag = `${emailPrefix}@stripe`;
    }
  });

  return UserModel;
};

export default User;

import { DataTypes } from "sequelize";

export const Transaction = (sequelize) => {
  return sequelize.define(
    "Transaction",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "User",   // table name, NOT the variable
          key: "id",       // column in user table
        },
      },

      amount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
      },

      timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },

      //  location
      latitude: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      longitude: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
    
      receiverTag: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },

    { tableName: "Transaction", timestamps: false }
  );
};

export default Transaction;

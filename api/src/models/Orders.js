const { DataTypes, UUIDV4, DATE, DATEONLY } = require("sequelize");

module.exports = (Sequelize) => {
    return Sequelize.define(
        "Orders", {
            id: {
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
              },
            shipping_Address: {
                type: DataTypes.STRING,
            },
            shippingState: {
                type: DataTypes.ENUM(
                  "not initialized",
                  "initial", //appears as soon as payment is verified
                 "despachado",
                 "entregado"
                  // "created",
                  // "processing",
                  // "canceled",
                  // "completed"
                ),
                defaultValue: "not initialized"
              },
            payment_id:{
                type: DataTypes.STRING,
            },
            status: {
                type: DataTypes.ENUM(
                  "inCart",
                  "created",
                  "pending",
                  "cancelled",
                  "completed"
                ),
                defaultValue: "inCart",
        allowNull: false,
            },
         
            merchant_order_id: {
                type: DataTypes.BIGINT,
                defaultValue: 0
            }
            
        }, { timestamps: false }
    );
};
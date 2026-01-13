import sequelize from "@/configs/sqlConfig";
import { DataTypes } from "sequelize";

export const Item = sequelize.define(
    "Item",
    {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true
        },
        sku: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM("standard", "negative"),
            allowNull: false
        },
        available: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        manufacturerId: {
            type: DataTypes.UUID,
            allowNull: true
        },
        brandId: {
            type: DataTypes.UUID,
            allowNull: true
        },
        categoryId: {
            type: DataTypes.UUID,
            allowNull: true
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false
        }, 
    },
    {
        freezeTableName: true
    }
)
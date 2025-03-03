require("dotenv").config();
const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");
const app = express();
app.use(express.json());

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./Database/app.sqlite",
});

// Define Models
const Customer = sequelize.define("Customer", {
  Customer_ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Customer_Name: DataTypes.STRING,
  Customer_address: DataTypes.STRING,
  Customer_Phonenumber: DataTypes.STRING,
});

const Product = sequelize.define("Product", {
  Product_ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Product_Name: DataTypes.STRING,
  Product_Price: DataTypes.INTEGER,
  Product_Description: DataTypes.STRING,
  Product_image: DataTypes.STRING,
});

const Employees = sequelize.define("Employees", {
  Employees_ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Employees_Name: DataTypes.STRING,
  Employees_Position: DataTypes.STRING,
  Employees_Phonenumber: DataTypes.STRING,
});

const Order = sequelize.define("Order", {
  Order_ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Order_Datetime: DataTypes.DATE,
  Order_Total_Price: DataTypes.INTEGER,
});

const OrderDetail = sequelize.define("OrderDetail", {
  OrderDetail_ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  OrderDetail_Quantity: DataTypes.INTEGER,
  OrderDetail_Price_Unit: DataTypes.INTEGER,
  OrderDetail_Total_Price: DataTypes.INTEGER,
});

const Promotion = sequelize.define("Promotion", {
  Promotion_ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Promotion_Name: DataTypes.STRING,
  Promotion_Discount: DataTypes.INTEGER,
  Promotion_Start_Date: DataTypes.DATE,
  Promotion_end_Date: DataTypes.DATE,
  Promotion_Description: DataTypes.STRING,
});

const Payment = sequelize.define("Payment", {
  Payment_ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Payment_Type: DataTypes.STRING,
  Payment_Amount: DataTypes.INTEGER,
  Payment_Date: DataTypes.DATE,
  Payment_Status: DataTypes.STRING,
});

const Delivery = sequelize.define("Delivery", {
  Delivery_ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Delivery_Status: DataTypes.STRING,
  Delivery_date: DataTypes.DATE,
});

Order.belongsTo(Customer, { foreignKey: "Order_Customer_ID" });
OrderDetail.belongsTo(Order, { foreignKey: "OrderDetail_Order_ID" });
OrderDetail.belongsTo(Product, { foreignKey: "OrderDetail_Product_ID" });
Payment.belongsTo(Order, { foreignKey: "Payment_Order_ID" });
Payment.belongsTo(Promotion, { foreignKey: "Payment_Promotion_ID" });
Delivery.belongsTo(Order, { foreignKey: "Delivery_Order_ID" });
Delivery.belongsTo(Employees, { foreignKey: "Delivery_Employees_ID" });

sequelize.sync();

const models = { Customer, Product, Employees, Order, OrderDetail, Promotion, Payment, Delivery };
Object.keys(models).forEach(modelName => {
  app.get(`/${modelName.toLowerCase()}`, async (req, res) => {
    const records = await models[modelName].findAll();
    res.json(records);
  });

  app.get(`/${modelName.toLowerCase()}/:id`, async (req, res) => {
    const record = await models[modelName].findByPk(req.params.id);
    record ? res.json(record) : res.status(404).send("Not found");
  });

  app.post(`/${modelName.toLowerCase()}`, async (req, res) => {
    const record = await models[modelName].create(req.body);
    res.json(record);
  });

  app.put(`/${modelName.toLowerCase()}/:id`, async (req, res) => {
    const record = await models[modelName].findByPk(req.params.id);
    if (!record) return res.status(404).send("Not found");
    await record.update(req.body);
    res.json(record);
  });

  app.delete(`/${modelName.toLowerCase()}/:id`, async (req, res) => {
    const record = await models[modelName].findByPk(req.params.id);
    if (!record) return res.status(404).send("Not found");
    await record.destroy();
    res.send({ message: "Deleted" });
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port http://localhost:${port}`));


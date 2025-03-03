require("dotenv").config();

const express = require("express");
const app = express();
const Sequelize = require("sequelize");

app.use(express.json());

const sequelize = new Sequelize("database", "username", "password", {
    host: "localhost",
    dialect: "sqlite",
    storage: "./Database/cafecool.sqlite",
  });


// ================= Customers Table =================
const Customers = sequelize.define("Customers", {
    customer_ID: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
    },
    customer_Name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    customer_address: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    customer_Phonenumber: {
        type: Sequelize.STRING,
        allowNull: false,
    },
});

// ================= Delivery Table =================
const Delivery = sequelize.define("Delivery", {
    delivery_ID: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
    },
    delivery_Status: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    delivery_date: {
        type: Sequelize.DATE,
        allowNull: true,
    },
    delivery_Order_ID: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    delivery_Employees_ID: {
        type: Sequelize.STRING,
        allowNull: true,
    },
});

// ================= Employees Table =================
const Employees = sequelize.define("Employees", {
    employees_ID: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
    },
    employees_Name: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    employees_Position: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    employees_Phonenumber: {
        type: Sequelize.STRING,
        allowNull: true,
    },
});

// ================= Order Table =================
const Order = sequelize.define("Order", {
    order_ID: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
    },
    order_Total_Price: {
        type: Sequelize.FLOAT,
        allowNull: true,
    },
    order_Datetime: {
        type: Sequelize.DATE,
        allowNull: true,
    },
    order_Customer_ID: {
        type: Sequelize.STRING,
        allowNull: true,
    },
});

// ================= OrderDetail Table =================
const OrderDetail = sequelize.define("OrderDetail", {
    orderDetail_ID: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
    },
    orderDetail_Quantity: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    orderDetail_Price_Unit: {
        type: Sequelize.FLOAT,
        allowNull: true,
    },
    orderDetail_Total_Price: {
        type: Sequelize.FLOAT,
        allowNull: true,
    },
    orderDetail_Order_ID: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    orderDetail_Product_ID: {
        type: Sequelize.STRING,
        allowNull: true,
    },
});

// ================= Payment Table =================
const Payment = sequelize.define("Payment", {
    payment_ID: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
    },
    payment_Type: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    payment_Amount: {
        type: Sequelize.FLOAT,
        allowNull: true,
    },
    payment_Date: {
        type: Sequelize.DATE,
        allowNull: true,
    },
    payment_Status: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    payment_Promotion_ID: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    payment_Order_ID: {
        type: Sequelize.STRING,
        allowNull: true,
    },
});

// ================= Product Table =================
const Product = sequelize.define("Product", {
    product_ID: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
    },
    product_Name: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    product_Price: {
        type: Sequelize.FLOAT,
        allowNull: true,
    },
    product_Description: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    product_image: {
        type: Sequelize.STRING,
        allowNull: true,
    },
});

// ================= Promotion Table =================
const Promotion = sequelize.define("Promotion", {
    promotion_ID: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
    },
    promotion_Name: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    promotion_Discount: {
        type: Sequelize.FLOAT,
        allowNull: true,
    },
    promotion_Start_Date: {
        type: Sequelize.DATE,
        allowNull: true,
    },
    promotion_End_Date: {
        type: Sequelize.DATE,
        allowNull: true,
    },
    promotion_Description: {
        type: Sequelize.STRING,
        allowNull: true,
    },
});

// ================== Relationships ==================

// Customers -> Orders (One-to-Many)
Customers.hasMany(Order, { foreignKey: 'order_Customer_ID' });
Order.belongsTo(Customers, { foreignKey: 'order_Customer_ID' });

// Orders -> OrderDetails (One-to-Many)
Order.hasMany(OrderDetail, { foreignKey: 'orderDetail_Order_ID' });
OrderDetail.belongsTo(Order, { foreignKey: 'orderDetail_Order_ID' });

// Products -> OrderDetails (Many-to-Many)
Product.belongsToMany(OrderDetail, { through: 'OrderDetailProduct', foreignKey: 'orderDetail_Product_ID' });
OrderDetail.belongsToMany(Product, { through: 'OrderDetailProduct', foreignKey: 'orderDetail_Product_ID' });

// Employees -> Deliveries (One-to-Many)
Employees.hasMany(Delivery, { foreignKey: 'delivery_Employees_ID' });
Delivery.belongsTo(Employees, { foreignKey: 'delivery_Employees_ID' });

// Promotions -> Payments (One-to-Many)
Promotion.hasMany(Payment, { foreignKey: 'payment_Promotion_ID' });
Payment.belongsTo(Promotion, { foreignKey: 'payment_Promotion_ID' });

// Products -> Promotions (Many-to-Many)
Product.belongsToMany(Promotion, { through: 'ProductPromotion', foreignKey: 'product_ID' });
Promotion.belongsToMany(Product, { through: 'ProductPromotion', foreignKey: 'promotion_ID' });

  // ================= CRUD APIs for all tables =================

// CRUD for Customers
app.get("/customers", (req, res) => 
    {
      Customers.findAll().then(customers => {
          res.json(customers);
      })
      .catch((err) => {
          res.status(500).send(err);
      });
    });
     
    app.get("/customers/:id", (req, res) => 
    {
      Customers.findByPk(req.params.id).then(customerId => {
        if (!customerId)
            res.status(404).send('Not found!');
        else 
            res.json(customerId);
      });
    });
    
    app.post("/customers", (req, res) => 
    {
      Customers.create(req.body).then(customer => {
          res.json(customer);
      })
      .catch((err) => {
          res.status(500).send(err);
      });
    });
      
    app.put("/customers/:id", (req, res) => 
    {
      Customers.findByPk(req.params.id).then(customerId => {
        if (!customerId)
          res.status(404).send('Not found!');
        else
          customerId.update(req.body).then(customerId => {
            res.json(customerId);
          })
          .catch((err) => {
            res.status(500).send(err);
          });
      })
      .catch((err) => {
        res.status(500).send(err);
      });
    });
      
    app.delete("/customers/:id", (req, res) => 
    {
      Customers.findByPk(req.params.id).then(customerId => {
        if (!customerId) 
          res.status(404).send('Not found!');
        else
          customerId.destroy().then(() => {
              res.json(customerId);
          })
          .catch((err) => {
              res.status(500).send(err);
          });
      })
      .catch((err) => {
          res.status(500).send(err);
      });
    });
    
    
  
  const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
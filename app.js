const express = require("express");
const { connectDB } = require("./config/db");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io"); // Import Socket.io
const { Order } = require("./models/order");
const crypto = require("crypto");

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
  },
});

app.use(express.json());

require("dotenv").config();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
  })
);

connectDB();

io.on("connection", (socket) => {
  socket.on("joinRestaurantRoom", async (data) => {
    socket.join(data.restaurantId);
  });
  socket.on("createOrder", async (order) => {
    const newOrder = new Order(order);
    newOrder.orderNumber = crypto.randomBytes(5).toString("hex");

    if (order.productIds && order.quantatys && order.sizes && order.prices) {
      const { productIds, quantatys, sizes, prices } = order;

      for (
        let i = 0;
        i < productIds.length &&
        i < quantatys.length &&
        i < sizes.length &&
        i < prices.length;
        i++
      ) {
        newOrder.products.push({
          productId: productIds[i],
          quantaty: quantatys[i],
          size: sizes[i],
          price: prices[i],
        });
      }
    } else {
      return;
    }

    try {
      const saveOrder = await newOrder.save();
      socket.emit("orderCreated", {
        message: "Orders has beed created",
        saveOrder: saveOrder,
      });
      const getOrderFromDatabase = await Order.findById(saveOrder._id).populate(
        {
          path: "products",
          populate: "productId",
        }
      );
      io.to(order.restaurantId).emit(
        "newOrderCreatedToRestaurantId",
        getOrderFromDatabase
      );
    } catch (error) {
      console.error("Error saving order:", error);
    }
  });
  socket.on("updateOrderThatPaid", async (order) => {
    const updateOrderThatPaid = await Order.findByIdAndUpdate(
      order.orderId,
      {
        $set: {
          isPaid: true,
        },
      },
      {
        new: true,
      }
    );
    try {
      if (updateOrderThatPaid) {
        const getOrderFromDatabase = await Order.findById(
          updateOrderThatPaid._id
        ).populate({
          path: "products",
          populate: "productId",
        });
        io.to(order.restaurantId.id).emit(
          "updateOrderThatPaidToRestaurantId",
          getOrderFromDatabase
        );
      }
    } catch (error) {
      console.error("Error saving order:", error);
    }
  });
  socket.on("joinOrderNumberRoom", async (data) => {
    socket.join(data.orderNumber);
  });
  socket.on("orderHasBeenDone", (data) => {
    io.to(data.orderNumber).emit("sendTheOrderHasBeenDone", { isDone: "done" });
  });
});

app.use("/api/restaurant", require("./routes/restaurantRoutes"));

app.use("/api/products", require("./routes/productRoutes"));

app.use("/api/categories", require("./routes/categoryRoutes"));

app.use("/api/orders", require("./routes/orderRoutes"));

server.listen(8080, () => {
  console.log(`Server is running`);
});

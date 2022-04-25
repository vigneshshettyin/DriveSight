const mongoose = require("mongoose");

const connection = {};
class DatabaseConnection {
  async connect() {
    try {
      if (!!connection.isConnected) return;

      const db = await mongoose.connect(process.env.MONGO_CONN, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log(`Connected to ${db.connection.name}`);
      connection.isConnected = db.connections[0].readyState;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new DatabaseConnection();

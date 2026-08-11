const mongoose = require('mongoose');

const conectarDB = async () => {
  try {
    const uri = process.env.MONGO_URI;

    console.log("URI detectada:", uri); 

    await mongoose.connect(uri);

    console.log("MongoDB conectado");
  } catch (error) {
    console.log("Error de conexión:", error);
  }
};

module.exports = conectarDB;
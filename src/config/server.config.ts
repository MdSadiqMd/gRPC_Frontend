const dotenv = require("dotenv");
dotenv.config();

export const serverConfig = {
    SERVER_PORT: process.env.SERVER_PORT || 50051,
    PORT: process.env.PORT || 3000,
};
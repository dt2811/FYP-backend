const express = require('express');
const connectToDb = require('./Database');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const moment = require("moment");
const UserRoutes = require('./Routes/UserRoutes');
const CompanyRoutes=require('./Routes/CompanyRoutes');
const FarmerRoutes=require('./Routes/FarmerRoutes');
const CropsRoutes=require('./Routes/CropsRoutes');
const ContractRoutes = require('./Routes/BlockchainRoutes');
const app = express();
const PORT = process.env.PORT;
const limiter = rateLimit({
    windowMs: 1000,
    max: 10,
});
// connectToDb();
app.use(limiter);
app.use(express.json());
app.use(cors());

// app.use(cookieParser());
// app.use(
//     morgan(function (tokens, req, res) {
//         return [
//             moment().format("LLL"),
//             tokens.method(req, res),
//             tokens.url(req, res),
//             tokens.status(req, res),
//             tokens.res(req, res, "content-length"),
//             "-",
//             tokens["response-time"](req, res),
//             "ms",
//         ].join(" ");
//     })
// );

// app.use(UserRoutes);
// app.use(CropsRoutes);
// app.use(CompanyRoutes);
// app.use(FarmerRoutes);

app.use(ContractRoutes);
app.get('/', (req, res) => {
    res.send('Welcome to FYP backend !!!!');
});



app.listen(PORT, () => {
    console.log("Running on PORT" + PORT);
});
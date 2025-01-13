import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import connectDb from "./config/db.js";
import renterRoutes from "./routes/renterRoutes.js";
import CarRoutes from "../backend/routes/CarRoutes.js"
import ownerAuthRoutes from "./routes/ownerAuthRoutes.js";
import bookingRoutes from "./models/booking.js"




const app = express();
const PORT = 5001;
dotenv.config();

app.use(
  cors({
    origin: [
      "http://localhost:3001",
      "https://car-rental-dusky-eight.vercel.app/"

    ],
    credentials: true, 
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

connectDb();

app.use("/renter", renterRoutes); // Add the team routes
app.use("/owner", ownerAuthRoutes); // Add the team routes
app.use("/car", CarRoutes);
app.use("/booking", bookingRoutes);

app.listen(PORT, (req, res) => {
  console.log("Serve is runnng ");
});

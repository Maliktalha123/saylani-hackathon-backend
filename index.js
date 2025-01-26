import cors from "cors";
import express from "express";
import user_router from "./routes/user_routes.js";
import stalkholder_router from "./routes/stalkholders_routes.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.log("Error in connecting database => ", error);
  });
const app = express();
app.use(express.json());
app.use(cors());

app.use("/stalkholders", stalkholder_router);
app.use("/auth", user_router);
// app.use(
//   cors({
//     origin: "http://127.0.0.1:5500", // Frontend origin
//     methods: "GET,POST", // Allowed methods
//     credentials: true, // Allow cookies if needed
//   })
// );

app.get("/", (req, res) => {
  console.log("I am Home page...");
  res.send("Hello World, This is my home page....");
});

// app.post("/uploadimage", upload.single("image"), (req, res) => {
//   console.log(req.file); // The uploaded file info
//   if (!req.file) {
//     return res.status(400).json({ message: "No file uploaded!" });
//   }

//   res.json({ message: "Image uploaded successfully!", file: req.file });
// });

app.listen(process.env.PORT, () =>
  console.log(`Server is listening at PORT : ${process.env.PORT}`)
);

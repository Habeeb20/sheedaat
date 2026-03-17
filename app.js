import express from "express"
import Admin from "./models/Admin.js";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import { connectDb } from "./db.js";
import adminRoute from "./routes/adminRoute.js"
import appointmentRoute from "./routes/appointmentRoute.js"
dotenv.config();
const app = express();
connectDb()
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.set('Surrogate-Control', 'no-store');
  next();
});


app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
app.use(morgan("dev"));



// Routes
app.get("/", (req, res) => {
  res.send("sheedaat backend is listening on port....");
});

app.use("/api/admin", adminRoute)
app.use('/api/appointment', appointmentRoute)


// await Admin.create({

//   email: 'sheedatsbraiding@gmail.com',
//   password: 'sheed@ts01',
 
// });

// console.log('Superadmin created!');












const port = process.env.PORT || 1080;

app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);

})





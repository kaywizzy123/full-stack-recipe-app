import express from "express";
import { ENV } from "./config/env.js";
import favoritesRoutes from "./routes/favoritesRoutes.js";

const app = express();
const PORT = ENV.PORT || 3000;

app.use(express.json());

app.get("/api/v1/health", (req, res) => {
  res.status(200).json({ success: true });
});

app.use("/api/v1/favorites", favoritesRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

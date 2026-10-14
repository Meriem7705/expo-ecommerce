import express from "express";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import { functions, inngest } from "./config/inngest.js";

const app = express();

app.use(express.json());
app.use(clerkMiddleware());

app.use("/api/inngest", serve({ client: inngest, functions }));

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Success" });
});

export default app;

// Run a local HTTP server outside Vercel.
if (process.env.VERCEL !== "1") {
  const startServer = async () => {
    await connectDB();

    app.listen(ENV.PORT || 3000, () => {
      console.log(`Server running on port ${ENV.PORT || 3000}`);
    });
  };

  startServer().catch((error) => {
    console.error("Failed to start server:", error);
    process.exitCode = 1;
  });
}

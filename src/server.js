import "dotenv/config";
import app from "./app.js";

const PORT = Number(process.env.PORT) || 3000;

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log("=================================");
  console.log("       TIVA API SERVER");
  console.log("=================================");
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log("Health check: /health");
  console.log("API information: /api/v1");
});

function shutdown(signal) {
  console.log(`${signal} received. Shutting down TIVA API...`);

  server.close((error) => {
    if (error) {
      console.error("Error while shutting down:", error.message);
      process.exit(1);
    }

    console.log("TIVA API stopped.");
    process.exit(0);
  });

  setTimeout(() => {
    console.error("Shutdown timed out.");
    process.exit(1);
  }, 10000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
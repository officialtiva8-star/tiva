const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 3000,
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173"
};

if (!Number.isInteger(config.port) || config.port < 1 || config.port > 65535) {
  throw new Error("TIVA configuration error: PORT must be a valid port number.");
}

export default config;
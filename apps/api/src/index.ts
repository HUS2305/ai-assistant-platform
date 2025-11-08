import { buildApp } from "./app";
import { env } from "./env";

const app = buildApp();

const port = env.PORT;

app
  .listen({ port, host: "0.0.0.0" })
  .then(() => {
    console.log(`🚀 API ready on http://localhost:${port}`);
  })
  .catch((error) => {
    console.error("Failed to start API", error);
    process.exit(1);
  });


/* eslint-disable n/no-process-env */

import path from "path";
import dotenv from "dotenv";

console.log("NODE_ENV : ", process.env.NODE_ENV);
// Check the env
const NODE_ENV = process.env.NODE_ENV || "development";

// Configure "dotenv"
const result = dotenv.config({
  path: path.join(__dirname, `./config/env/.env.${NODE_ENV}`),
});
if (result.error) {
  throw result.error;
}

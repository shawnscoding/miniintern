import express from "express";
import userRoutes from "./routes/user.routes";
import mclassRoutes from "./routes/mclass.routes";
import { errorHandler } from "./middlewares/error.middleware";
import swaggerUi from "swagger-ui-express";
import { swaggerDocument } from "./config/swagger";

const app = express();

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/users", userRoutes);
app.use("/api/mclasses", mclassRoutes);
app.use(errorHandler);

export default app;

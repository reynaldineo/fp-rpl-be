import { App } from "./app.js";
import { AuthRoute } from "./routes/auth.route.js";
import { CourseRoute } from "./routes/course.route.js";
import { StoreRoute } from "./routes/store.route.js";
import { UserRoute } from "./routes/users.route.js";
import { ValidateEnv } from "./utils/validateEnv.js";

ValidateEnv();

const app = new App([new UserRoute(), new AuthRoute(), new CourseRoute(), new StoreRoute()]);

app.listen();

import { Hono } from "hono";
import { robotRoutes } from "./robotRoutes";
import userRoutes from "./userRoutes";

const routes = new Hono();

// Mount robot routes
routes.route("/robots", robotRoutes);

// Mount user routes
routes.route("/users", userRoutes);

export { routes };

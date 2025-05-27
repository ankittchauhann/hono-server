import { Hono } from "hono";
import { robotRoutes } from "./robotRoutes";

const routes = new Hono();

// Mount robot routes
routes.route("/robots", robotRoutes);

export { routes };

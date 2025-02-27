import { expressjwt as jwt } from "express-jwt";
import config from "../config";
import { path } from "../lib/path";

const jwtAuthentication = jwt({
  secret: config.jwtSecret,
  algorithms: ["HS256"],
}).unless({
  path: [
    path.build.api("auth/login"),
    path.build.api("auth/register"),
    // Public routes
  ],
});

export { jwtAuthentication };

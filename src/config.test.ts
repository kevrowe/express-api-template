import "dotenv/config";
import { buildConfig } from "./config";

describe("buildConfig", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = "a";
    process.env.PORT = "a";
    process.env.DATABASE_URL = "a";
  });

  it("should build the config", () => {
    expect(buildConfig()).toBeDefined();
  });

  it("should throw an error if JWT_SECRET is not set", () => {
    process.env.JWT_SECRET = "";
    expect(() => buildConfig()).toThrow("JWT_SECRET is not set");
  });

  it("should throw an error if PORT is not set", () => {
    process.env.PORT = "";
    expect(() => buildConfig()).toThrow("PORT is not set");
  });

  it("should throw an error if DATABASE_URL is not set", () => {
    process.env.DATABASE_URL = "";
    expect(() => buildConfig()).toThrow("DATABASE_URL is not set");
  });
});

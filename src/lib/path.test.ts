import { path } from "./path";

describe("path", () => {
  it("should return the correct path", () => {
    expect(path.build.api("auth")).toBe("/api/auth");
  });
  it("should remove leading slashes", () => {
    expect(path.build.api("/auth")).toBe("/api/auth");
  });
});

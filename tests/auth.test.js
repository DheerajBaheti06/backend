import { describe, it, before, after, mock } from "node:test";
import assert from "node:assert";
import request from "supertest";
import mongoose from "mongoose";
import { app } from "../src/app.js";
import { User } from "../src/models/user.model.js";
import { conf } from "../src/conf/index.js";

// Mock Cloudinary not needed for login tests as we seed DB directly.

// Mock Multer if needed, but let's see if FS check in app.js handles it.
// The app.js check handles creating the temp dir, so it should be fine.

describe("Auth Endpoints", async () => {
  const testUser = {
    fullName: "Test User",
    email: `test_${Date.now()}@example.com`,
    username: `testuser_${Date.now()}`,
    password: "password123",
  };

  before(async () => {
    await mongoose.connect(conf.mongodbUri);
    // Create user logic
    try {
      await User.create({
        ...testUser,
        avatar: "http://example.com/avatar.jpg",
        coverImage: "http://example.com/cover.jpg",
      });
    } catch (e) {
      console.error("Setup User Creation Failed:", e);
    }
  });

  after(async () => {
    try {
      await User.deleteMany({ email: { $regex: "test_" } });
      await mongoose.disconnect();
    } catch (e) {
      console.error("Teardown Failed:", e);
    }
  });

  it("POST /users/login - should login successfully with valid credentials", async () => {
    const res = await request(app).post("/api/v1/users/login").send({
      email: testUser.email,
      password: testUser.password,
    });

    assert.strictEqual(res.statusCode, 200);
    assert.ok(res.body.data.accessToken);

    const cookies = res.headers["set-cookie"];
    assert.ok(cookies);
    assert.ok(cookies.some((c) => c.includes("accessToken")));
    assert.ok(cookies.some((c) => c.includes("HttpOnly")));
  });

  it("POST /users/login - should fail with wrong password", async () => {
    const res = await request(app).post("/api/v1/users/login").send({
      email: testUser.email,
      password: "wrongpassword",
    });

    assert.strictEqual(res.statusCode, 401);
  });

  it("GET /health - should fail without token", async () => {
    const res = await request(app).get("/api/v1/health");
    assert.strictEqual(res.statusCode, 401);
  });

  it("GET /health - should succeed with token", async () => {
    // Login to get token first
    const loginRes = await request(app).post("/api/v1/users/login").send({
      email: testUser.email,
      password: testUser.password,
    });

    const token = loginRes.body.data.accessToken;

    const res = await request(app)
      .get("/api/v1/health")
      .set("Authorization", `Bearer ${token}`);

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
  });
});

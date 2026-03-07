const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

// create a minimal frontend build folder before the server is required
const fs = require('fs');
const path = require('path');
const buildDir = path.join(__dirname, '..', 'frontend', 'build');
fs.mkdirSync(buildDir, { recursive: true });
fs.writeFileSync(path.join(buildDir, 'index.html'), '<html><body>hello</body></html>');

let app;
let server;
let mongod;

beforeAll(async () => {
  // start in-memory mongo server
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  process.env.MONGO_URI = uri;

  // connect mongoose manually
  const connectDB = require("../config/db");
  await connectDB();

  // require after setting env so server uses the connected mongoose
  app = require("../server");
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongod) await mongod.stop();
  if (server && server.close) server.close();
});


afterAll(() => {
  const fs = require('fs');
  const path = require('path');
  const buildDir = path.join(__dirname, '..', 'frontend', 'build');
  fs.rmSync(buildDir, { recursive: true, force: true });
});

describe("Auth API", () => {
  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send({ name: "Test", email: "test@example.com", password: "password" });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toMatch(/registered successfully/i);
    expect(res.body.user).toHaveProperty("email", "test@example.com");
  });

  it("should not allow duplicate registration", async () => {
    await request(app)
      .post("/api/auth/signup")
      .send({ name: "Test", email: "dup@example.com", password: "password" });

    const res = await request(app)
      .post("/api/auth/signup")
      .send({ name: "Test2", email: "dup@example.com", password: "password" });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/already exists/);
  });

  it("should return 400 if required signup fields are missing", async () => {
    const res = await request(app).post("/api/auth/signup").send({ email: "x@x.com" });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/name|password/i);
  });

  it("should login with correct credentials and record timestamp", async () => {
    await request(app)
      .post("/api/auth/signup")
      .send({ name: "Login", email: "login@example.com", password: "secret" });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "login@example.com", password: "secret" });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/login successful/i);
    expect(res.body.user).toHaveProperty("email", "login@example.com");
    expect(res.body.user).toHaveProperty("lastLogin");
    // ensure lastLogin is a valid date string
    expect(new Date(res.body.user.lastLogin).toString()).not.toMatch(/Invalid/);
  });

  it("should reject incorrect password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "login@example.com", password: "wrong" });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/invalid password/i);
  });

  it("should return 400 if login fields are missing", async () => {
    const res = await request(app).post("/api/auth/login").send({ email: "login@example.com" });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/password/i);
  });

  it("should return 404 for non-existent user", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "noone@example.com", password: "foo" });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/user not found/i);
  });

  it("should expose service info", async () => {
    const res = await request(app).get("/info");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("port");
    expect(res.body).toHaveProperty("baseUrl");
  });

  it("should serve React build at root when available", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toMatch(/hello/); // our dummy index.html contains 'hello'
  });

  it("admin endpoint should list users", async () => {
    // create two users and trigger logins
    await request(app)
      .post("/api/auth/signup")
      .send({ name: "A", email: "a@example.com", password: "1" });
    await request(app)
      .post("/api/auth/signup")
      .send({ name: "B", email: "b@example.com", password: "1" });

    await request(app)
      .post("/api/auth/login")
      .send({ email: "a@example.com", password: "1" });

    const res = await request(app).get("/api/auth/admin/users");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("users");
    expect(Array.isArray(res.body.users)).toBe(true);
    expect(res.body.users.length).toBeGreaterThanOrEqual(2);
    // users should contain createdAt and lastLogin fields
    const sample = res.body.users[0];
    expect(sample).toHaveProperty("createdAt");
    // lastLogin may be absent when undefined; accept either case or a valid string
    if (sample.lastLogin !== undefined) {
      expect(typeof sample.lastLogin).toBe('string');
    }

  });
});

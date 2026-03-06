const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

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

  it("should login with correct credentials", async () => {
    await request(app)
      .post("/api/auth/signup")
      .send({ name: "Login", email: "login@example.com", password: "secret" });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "login@example.com", password: "secret" });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/login successful/i);
    expect(res.body.user).toHaveProperty("email", "login@example.com");
  });

  it("should reject incorrect password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "login@example.com", password: "wrong" });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/invalid password/i);
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
});

const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

test("registration and login API", async (t) => {
  const users = [];
  let mail;
  let databaseFails = false;
  let customerExists = true;
  const query = async (sql, values) => {
    if (databaseFails) throw new Error("Database unavailable");
    if (sql.includes("INSERT INTO users")) {
      if (!customerExists) return { rows: [] };
      const [username, email, password, full_name, phone, address] = values;
      if (users.some(u => u.username === username || u.email === email)) {
        throw Object.assign(new Error("Duplicate"), { code: "23505" });
      }
      const user = { id: users.length + 1, username, email, password, full_name, phone, address,
        role_id: 3, role_name: "Customer", status: "active", rule_id: null, permission: {} };
      users.push(user);
      const { password: hidden, ...safe } = user;
      return { rows: [safe] };
    }
    if (sql.includes("LEFT JOIN role")) {
      return { rows: users.filter(u => sql.includes("lower(u.email)") ? u.email === values[0] : u.username === values[0]) };
    }
    return { rows: users.filter(u => values.length === 2
      ? u.username === values[0] || u.email === values[1] : u.email === values[0]) };
  };
  const moduleStub = { exports: {} };
  const timers = [];
  const testSecret = "test-only-secret-for-auth-flow";
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, "../route/data.js"), "utf8"), {
    require: name => name === "../pgsql.js" ? { query }
      : name === "nodemailer" ? { createTransport: () => ({ sendMail: async message => { mail = message; } }) }
      : require(name),
    module: moduleStub, Buffer, console: { error() {} },
    process: { env: { JWT_SECRET: testSecret } },
    setInterval: (...args) => { const timer = setInterval(...args); timers.push(timer); return timer; },
  });
  const app = express();
  app.use(express.json());
  app.use("/api", moduleStub.exports);
  const server = await new Promise(resolve => { const s = app.listen(0, "127.0.0.1", () => resolve(s)); });
  t.after(async () => { timers.forEach(clearInterval); await new Promise(resolve => server.close(resolve)); });
  const post = async (route, body) => {
    const response = await fetch(`http://127.0.0.1:${server.address().port}/api/${route}`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
    });
    return { code: response.status, body: await response.json() };
  };
  const email = "customer@example.com";
  const registration = { username: "customer_test", email, password: "StrongPass123", role_id: 1, status: "master" };
  assert.equal((await post("register", registration)).code, 400);
  assert.equal((await post("send-code", { email: {} })).code, 400);
  assert.equal((await post("login", { account: {}, password: [] })).code, 400);
  assert.equal((await post("send-code", { email })).code, 200);
  assert.equal((await post("send-code", { email })).code, 429);
  const code = mail.html.match(/<h1>(\d{6})<\/h1>/)[1];
  const verification = await post("verify-code", { email, code });
  assert.equal(verification.code, 200);
  assert.equal((await post("verify-code", { email, code })).code, 400);
  registration.verificationToken = verification.body.verificationToken;
  assert.equal((await post("register", { ...registration, email: "other@example.com" })).code, 400);
  customerExists = false;
  assert.equal((await post("register", registration)).code, 500);
  customerExists = true;
  const created = await post("register", registration);
  assert.equal(created.code, 201);
  assert.equal(created.body.user.role_id, 3);
  assert.equal(created.body.user.status, "active");
  assert.equal(created.body.user.password, undefined);
  assert.notEqual(users[0].password, registration.password);
  assert.equal(await bcrypt.compare(registration.password, users[0].password), true);
  assert.equal((await post("register", registration)).code, 400);
  assert.equal((await post("send-code", { email })).code, 409);
  for (const account of [registration.username, email.toUpperCase()]) {
    const login = await post("login", { account, password: registration.password });
    assert.equal(login.code, 200);
    assert.equal(login.body.user.password, undefined);
    assert.equal(jwt.verify(login.body.token, testSecret).role, "Customer");
  }
  assert.equal((await post("login", { account: email, password: "wrong" })).code, 401);
  users[0].status = "inactive";
  assert.equal((await post("login", { account: email, password: registration.password })).code, 403);
  databaseFails = true;
  assert.equal((await post("login", { account: email, password: registration.password })).code, 500);
  databaseFails = false;
  const secondEmail = "second@example.com";
  assert.equal((await post("send-code", { email: secondEmail })).code, 200);
  const secondCode = mail.html.match(/<h1>(\d{6})<\/h1>/)[1];
  const wrongCode = secondCode === "100000" ? "100001" : "100000";
  for (let i = 0; i < 5; i++) {
    assert.equal((await post("verify-code", { email: secondEmail, code: wrongCode })).code, i === 4 ? 429 : 400);
  }
  assert.equal((await post("verify-code", { email: secondEmail, code: secondCode })).code, 429);
});

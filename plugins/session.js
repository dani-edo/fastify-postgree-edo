"use strict";

const session = require("fastify-session");
const cookie = require("fastify-cookie");
const PgSessionStore = require("connect-pg-simple");
const fp = require("fastify-plugin");
const appConfig = require("../config/appConfig");

// the use of fastify-plugin is required to be able
// to export the decorators to the outer scope

module.exports = fp(async function (fastify, opts) {
  const SessionStore = new PgSessionStore(session);
  fastify.register(cookie);
  fastify.register(session, {
    store: new SessionStore({
      tableName: "user_sessions",
      pool: fastify.db.$pool,
    }),
    secret: appConfig.sessionSecret,
    saveUnitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
    },
  });
}, { name: 'session', dependencies: ['db']});

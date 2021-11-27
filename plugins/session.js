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
      tableName: "user_sessions", // table column for save user session
      pool: fastify.db.$pool,
    }),
    secret: appConfig.sessionSecret, // session secret env
    saveUnitialized: false, // mean: don't mark session cookie just because somebody requested to our server, instead wait for us to actually declare a session
    cookie: {
      httpOnly: true, // cookie http only
      secure: process.env.NODE_ENV !== "development", // just send if connection is TLS
    },
  });
}, { name: 'session', dependencies: ['db']}); // dependencies make js load dependencies first before this

"use strict";

const fp = require("fastify-plugin");
const pgp = require("pg-promise")();

const appConfig = require("../config/appConfig");

module.exports = fp(async function (fastify, opts, next) {
  const db = pgp(appConfig.postgres);

  fastify.decorate("db", db);

  next();
});

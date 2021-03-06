function loadEnv(keyname) {
  const envar = process.env[keyname];

  if (!envar) {
    throw new Error(`must includes ${keyname}`);
  }

  return envar;
}

function loadArrayEnv(keyname) {
  return loadEnv(keyname).split(',');
}

module.exports = {
  postgres: loadEnv('POSTGRES_URI'),
  sessionSecret: loadArrayEnv('SESSION_SECRET'),
};

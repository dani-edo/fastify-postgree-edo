function loadEnv(keyname) {
  const envar = process.env[keyname];

  if (!envar) {
    throw new Error(`must includes ${keyname}`);
  }

  return envar;
}

module.exports = {
  postgres: loadEnv('POSTGRES_URI'),
};

const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const config = {
  port: 9000,
  host: 'localhost',
};

/**
 * Initiate Hapi Server
 * @param {Object} c
 * @param {number} c.port
 * @param {string} c.host
 * @returns {Promise<Hapi.Server>}
 */
const init = async ({ port, host }) => {
  const server = Hapi.server({
    port: process.env.PORT || port,
    host,
  });

  server.route(routes);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);

  return server;
};

init(config);

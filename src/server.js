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
const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 9000, // Gunakan PORT dari environment variable
    host: 'localhost',
  });

  server.route(routes);

  await server.start();
  // Mengaktifkan console.log untuk melihat apakah server sudah berjalan
  console.log(`Server berjalan pada ${server.info.uri}`);

  return server;
};

init(config);

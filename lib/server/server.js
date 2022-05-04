const fastify = require('fastify')({ logger: true })

fastify.register(require('./routes/static-server'))

const start = async () => {
  try {
    await fastify.listen(3000, '0.0.0.0')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()

module.exports = fastify
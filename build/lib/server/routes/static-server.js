module.exports = function (fastify, opts, done) {
  const fastifyStatic = require('fastify-static')
  const path = require('path')

  fastify.register(fastifyStatic, {
    root: path.join(__dirname, 'public')
  })

  done()
}
const fastify = require('fastify')()
const Matrix = require("./Matrix")
const path = require('path')
var serveStatic = require('serve-static')

fastify.register(require('point-of-view'), {
    engine: {
      handlebars: require('handlebars')
    }
})

fastify.use(serveStatic(`${__dirname}/public`))

fastify.get('/', async (request, reply) => {
  matrix = new Matrix();
  //console.log(matrix.palette_color)
  reply.view('/app/views/index.handlebars', { compare_color: matrix.palette_color['gray'][0], palette: matrix.palette_color })
})

fastify.get('/login', async (request, reply) => {
  reply.view('/app/views/login.handlebars', {})
})

fastify.post('/login', async (request, reply) => {
  reply.view('/app/views/login.handlebars', {})
})

const start = async () => {
  try {
    await fastify.listen(3014)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
module.exports = (fastify, opts, next) => {

    const httpErrors = require('http-errors')

    const Okulys = require("../../services/Okulys").getInstance()

    fastify.get('/color/palette', async (request, reply) => {
        const formated = request.query.formated;
        var result;
        if (formated == "false" || formated == "true") {
            result = await Okulys.getAllColors(formated)
        } else if (formated == undefined) {
            result = await Okulys.getAllColors()
        } else {
            reply.send(httpErrors(400, 'formated: query parameter value is not valid. It must be boolean.'))
        }
        return result;
    })

    fastify.get('/color/random', async (request, reply) => {
        return await Okulys.getRandomColor()
    })

    fastify.get('/color', async (request, reply) => {
        const id = request.query.id;
        if (id >= 0 && id <= 199) {
            return await Okulys.getColorById(id);
        } else {
            reply.send(httpErrors(400, 'id: query parameter value is not valid. It must be between 0 and 199'))
        }
    })

    next()

}
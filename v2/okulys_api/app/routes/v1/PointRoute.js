module.exports = (fastify, opts, next) => {

    const httpErrors = require('http-errors')

    const Okulys = require("../../services/Okulys").getInstance();

    fastify.get('/point/:color_blindness', async (request, reply) => {
        const color_blindness = request.params.color_blindness;
        if(color_blindness == "protanopia" || color_blindness == "deuteranopia")
            return await Okulys.getAllPoints(color_blindness);
        else
            reply.send(httpErrors(400, 'color_blindness: url parameter value is not valid. It must be protanopia or deuteranopia.'))
    })
    
    fastify.get('/point/isVisible', async (request, reply) => {
        return [];
    })

    next();

}
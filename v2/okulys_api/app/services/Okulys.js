// Model
var Color = require("../models/Color")
var Tupla = require("../models/Tupla")
var Point = require("../models/Point")

// Dependencies
var level = require('level')
var fs = require("fs-jetpack")
var vibrant = require('node-vibrant')

class Okulys {
    constructor(populate) {
        this.db_palette = level("./app/data/db_palette", { valueEconding: 'json' })
        this.db_protanopia = level("./app/data/db_protanopia", { valueEconding: 'json' })
        if (populate) this.populate();
        this.instance = null;
    }

    static getInstance() {
        if (this.instance == null) {
            this.instance = new Okulys();
        }
        return this.instance;
    }

    populate() {
        var i = 0;
        var palette = fs.read("./app/data/palette.json", "json")
        for (var color_name in palette) {
            palette[color_name].forEach(item => {
                var color = new Color('' + i + '' + item.id, color_name.charAt(0).toUpperCase() + color_name.slice(1) + " " + item.id, item.hex)
                this.db_palette.put('' + i + '' + item.id, JSON.stringify(color), () => { });
            })
            i++;
        }
    }

    get(color_blindness, key) {
        return new Promise((resolve, reject) => {
            var keys = key.split(".")
            var tupla, combination; // = 0 --> keys[0] keys[1] // = 1 --> keys[1] keys[0]
            this['db_' + color_blindness].get(keys[0] + "." + keys[1], (err, value) => {
                if (value == undefined) {
                    this['db_' + color_blindness].get(keys[1] + "." + keys[0], (err, value) => {
                        if (value != undefined) {
                            tupla = value;
                            combination = 1;
                            resolve({ tupla, combination })
                        }
                    })
                } else {
                    tupla = value;
                    combination = 0;
                    resolve({ tupla, combination })
                }
            })
        })
    }

    put(color_blindness, key, visibility) {
        return new Promise((resolve, reject) => {
            this.get(color_blindness, key).then(res => {
                var keys = key.split(".");
                var tupla;
                if (res.tupla == undefined) {
                    tupla = new Tupla(keys[0], keys[1])
                    tupla.add(visibility);
                    this.db_protanopia.put(keys[0] + "." + keys[1], JSON.stringify(tupla), (err) => { if (err) reject(err); else resolve(); })
                } else {
                    tupla = Tupla.fromJson(JSON.parse(res.tupla))
                    tupla.add(visibility);
                    if (res.combination) { // 1
                        this.db_protanopia.put(keys[1] + "." + keys[0], JSON.stringify(tupla), (err) => { if (err) reject(err); else resolve(); })
                    } else { // 0
                        this.db_protanopia.put(keys[0] + "." + keys[1], JSON.stringify(tupla), (err) => { if (err) reject(err); else resolve(); })
                    }
                }
            })
        });
    }

    getAllColors(formatedByColor) {
        return new Promise((resolve, reject) => {
            var stream = this.db_palette.createReadStream()
            if (formatedByColor) {
                var result = {};
                stream.on('data', (e) => {
                    var color = Color.fromJson(JSON.parse(e.value));
                    var name = color.name.split(" ")[0].toLowerCase().trim();
                    if (result[name] == undefined) {
                        result[name] = [];
                    }
                    result[name].push(color)
                })
            } else {
                var result = []
                stream.on('data', (e) => { result.push(Color.fromJson(JSON.parse(e.value))) })
            }
            stream.on('close', () => { resolve(result) })
        })
    }

    // test_getAllPoints() {
    //     return new Promise((resolve, reject) => {
    //         var result = []
    //         this.getAllColors().then(data1 => {
    //             data.forEach(item => {
    //                 this.getAllColors().then(data2 => {
    //                     data.forEach(item2 => {
    //                         result.push({ x: JSON.parse(item1), y: JSON.parse(item2) })
    //                     })
    //                 })
    //             })
    //             resolve(result)
    //         })
    //     })
    // }

    getRandomColor(color) {
        return new Promise((resolve, reject) => {
            var random_key = Math.floor(Math.random() * (200 - 0)) + 0;
            this.db_palette.get(random_key, (err, color) => {
                if (err) reject(err);
                resolve(Color.fromJson(JSON.parse(color)))
            })
        })
    }

    getColorById(id) {
        return new Promise((resolve, reject) => {
            this.db_palette.get(id, (err, color) => {
                if (err) reject(err);
                resolve(Color.fromJson(JSON.parse(color)))
            })
        })
    }

    getAllPoints(color_blindness) {
        return new Promise((resolve, reject) => {
            var result = [];
            var stream = this['db_' + color_blindness].createKeyStream();
            stream.on('data', (e) => {
                var keys = e.split(".");
                var color1 = this.getColorById(keys[0])
                var color2 = this.getColorById(keys[1])
                var tupla = this.get(color_blindness, key).tupla;
                result.push(new Point(color1, color2, tupla.probability_not_visible))
            })
            stream.on('close', () => resolve(result))
        })
    }

    // getDistancia(origen, destino) {
    //     // var colorOrigenLab = this.Vibrant.rgbToCIELab(origen.rgb);
    //     // var colorDestinoLab = this.Vibrant.rgbToCIELab(destino.rgb);
    //     // console.log(origen.rgb, destino.rgb)
    //     return vibrant.Util.rgbDiff(origen.rgb, destino.rgb)
    // }

    /*
    * origen <Punto>: {x: {r,g,b}, y: {r,g,b}}
    */
    getDistanciaHeuclidea(origen, destino) {

        // La distancia se va a calcular con el Teorema de pitágoras, siendo la delta
        // de los colores del eje x el primer cateto y siendo el segundo cateto la delta
        // de los colores del eje y. d = Math.sqrt(deltax^2 + deltay^2)

        var xDiff = vibrant.Util.rgbDiff(origen["x"].rgb, destino["x"].rgb)
        var yDiff = vibrant.Util.rgbDiff(origen["y"].rgb, destino["y"].rgb)

        return Math.sqrt(xDiff ** 2 + yDiff ** 2);

    }

    /*
    * point: {x: <Color>, y: <Color>, probability: <Number>}
    */
    isVisible(point) {
        var res = [];
        this.getAllPoints("protanopia").then(data => {
            data.forEach(item => {
                res.push(this.getDistanciaHeuclidea(point, item));
            })
        })
        return Math.min(...res);
    }

}

module.exports = Okulys;
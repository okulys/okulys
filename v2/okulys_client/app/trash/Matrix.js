// 1 --> No se distinguen
// 0 --> Se distinguen

const Color = require("./app/models/Color")

let f = (a, b) => [].concat(...a.map(a => b.map(b => [].concat(a, b))));
let cartesian = (a, b, ...c) => b ? cartesian(f(a, b), ...c) : a;

class Matrix {
   
    constructor() {
        this.fs = require("fs-jetpack")
        this.palette = this.fs.read("./app/data/palette.json", "json")
        this.palette_color = {};

        var i = 0;
        for(var name in this.palette) {
            this.palette_color[name] = [];
            this.palette[name].forEach((item) => {
                this.palette_color[name].push(new Color('' + i + '' + item.id, name.charAt(0).toUpperCase() + name.slice(1) + " " + item.id, item.hex));
            })
            i++;
        }

        this.value = {};
        this.Vibrant = require('node-vibrant')
        this.data_protanopia = this.fs.read("./app/data/data_protanopia.json", "json")
    }

    async add(columna, fila) {
        this.data_protanopia[columna].push(fila);
        await this.fs.writeAsync("./app/data/data_protanopia.json", this.data_protanopia, {jsonIndent: 4});
    }

    getAllPoints(daltonismo) {
        var result = [];
        var data = this["data_"+daltonismo];
        for(var item in data) {
            data[item].forEach(item2 => {
                result.push({x: this.findByColorName(item), y: this.findByColorName(item2)})
            })
        }
        return result;
    }

    findByColorName(colorName) {
        // colorName --> blueLight_1
        var aux = colorName.split("_");
        var color = aux[0]; // blueLight
        var id = aux[1]; // 1
        var result = this.palette[color].filter(item => item.id == id)

        return new Color(id, color, result[0].hex);
    }

    getDistancia(origen, destino) {

        // var colorOrigenLab = this.Vibrant.rgbToCIELab(origen.rgb);
        // var colorDestinoLab = this.Vibrant.rgbToCIELab(destino.rgb);
        console.log(origen.rgb, destino.rgb)
        return this.Vibrant.Util.rgbDiff(origen.rgb, destino.rgb)
    }

    /*
    * origen <Punto>: {x: {r,g,b}, y: {r,g,b}}
    */
    getDistanciaHeuclidea(origen, destino){

        // La distancia se va a calcular con el Teorema de pitágoras, siendo la delta
        // de los colores del eje x el primer cateto y siendo el segundo cateto la delta
        // de los colores del eje y. d = Math.sqrt(deltax^2 + deltay^2)

        var xDiff = this.Vibrant.Util.rgbDiff(origen["x"].rgb, destino["x"].rgb)
        var yDiff = this.Vibrant.Util.rgbDiff(origen["y"].rgb, destino["y"].rgb)

        return Math.sqrt(xDiff**2 + yDiff**2);

    }

    /*
    * point: {x: <Color>, y: <Color>}
    */
    isVisible(point) {
        var res = [];
        this.getAllPoints("protanopia").forEach(item => {
            res.push(this.getDistanciaHeuclidea(point, item));
        })
        return Math.min( ...res );
    }
 
}

module.exports = Matrix;

// var i = 1;

// var test = new Matrix();

// var pointX = new Color(0, "test", "#24E5F9");
// var pointY = new Color(0, "test", "#DEF1F9");
// var point = {x: pointX, y: pointY}

// const measureTime = require('measure-time');

// const getElapsed = measureTime();

// console.log(test.isVisible(point))

// const elapsed = getElapsed();

// console.log(elapsed);

// app.listen(3000);
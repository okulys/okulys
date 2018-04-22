/* 
 * Estructura de datos para a partir de los datos proporcionados
 * poder estimar si la combinación de dos colores es visible o no.
 * Sergio Clebal
 */

// 1 --> No se distinguen
// 0 --> Se distinguen

const Color = require("./Color")

class Matrix {
   
    constructor() {
        this.fs = require("fs-jetpack")
        this.palette = this.fs.read("./paleta.json", "json")
        this.Vibrant = require('node-vibrant')
        this.data_protanopia = this.fs.read("./data_protanopia.json", "json")
        this.value = {};
    }

    async add(columna, fila) {
        this.data_protanopia[columna].push(fila);
        await this.fs.writeAsync("./data_protanopia.json", this.data_protanopia, {jsonIndent: 4});
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
    * origen : {x: <Color>, y: <Color>}
    * destino : {x: <Color>, y: <Color>}
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
        return Math.min(...res);
    }
 
}

var i = 1;

var test = new Matrix();

var pointX = new Color(0, "test", "#24E5F9");
var pointY = new Color(0, "test", "#DEF1F9");
var point = {x: pointX, y: pointY}

/* ************ */
const measureTime = require('measure-time');

const getElapsed = measureTime();

console.log(test.isVisible(point))

const elapsed = getElapsed();

console.log(elapsed);
/* ************ */

// const express = require("express")
// const app = express();
// const exphbs = require("express-handlebars");

// app.set('view engine', 'handlebars');
// app.engine('handlebars', exphbs());

// app.get("/", (req, res)=>{
//   res.render("index", {i: 0, points: test.getAllPoints("protanopia")})
// })

// app.listen(3000);
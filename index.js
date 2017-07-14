//const express = require("express");
//const exphbs = require("express-handlebars");
//const app = express();

// En models/color definimos el tipo colors, el cual contiene
// las siguientes propiedades:
// id (Array de Integer) -- Utilizado para pruebas, ignorar
// name (String)
// hex (String)
// rgb (String)
// escala (Array)
// La propiedad escala contiene un array de objetos Tonalidad
// cada uno de los objetos corresponde con cada una de las tonalidades
// que hemos obtenido a partir del color base. En cada objeto Tonalidad
// podemos sacar como se ve ese color para una persona con protanopia y deuteranopia.
const Color = require("./models/color");

const PNGImage = require('pngjs-image');
const fs = require('fs');

const path = require('path');
const getColors = require('get-image-colors');

const convert = require('color-convert');

const DeltaE = require('delta-e');

const colors = [
  {id: 0, name: "gray", hex: "#8d8d8d"},
  {id: 1, name: "purple", hex: "#9d67a9"},
  {id: 2, name: "violet", hex: "#655da6"},
  {id: 3, name: "indigo", hex: "#5a73b7"},
  {id: 4, name: "ocean", hex: "#4970a6"},
  {id: 5, name: "blue", hex: "#4893d0"},
  {id: 6, name: "blue light", hex: "#4389ff"},
  {id: 7, name: "sky blue", hex: "#00a8e3"},
  {id: 8, name: "cyan", hex: "#57e4ff"},
  {id: 9, name: "turquoise", hex: "#1bcad4"},
  {id: 10, name: "mint", hex: "#5fbb9e"},
  {id: 11, name: "forest (melon)", hex: "#659359"},
  {id: 12, name: "lime", hex: "#a9ca4d"},
  {id: 13, name: "yellow", hex: "#fae821"},
  {id: 14, name: "honey", hex: "#ffd43d"},
  {id: 15, name: "orange", hex: "#f28f34"},
  {id: 16, name: "red", hex: "#f12727"},
  {id: 17, name: "crimson", hex: "#ef004e"},
  {id: 18, name: "pink", hex: "#ee709f"},
  {id: 19, name: "brown", hex: "#a05a2b"}
]

// Array_color será un array que contenga todos los tipos Color
var array_color = [];

// Con estas lineas rellenaremos la variable array_color
// con todos los objetos del tipo Color generados a partir
// de la información estática de la variable colors definida arriba.
colors.forEach(function(item){
  var id = [];
  for(let i = item.id*10; i <= item.id * 10 + 9; i++){
    id.push(i);
  }
  array_color.push(new Color(id, item.name, item.hex));
})

///// VARIABLES BÁSICAS -- MODIFICAR ESTO //////

var id_color_derecha = 1; // Purple
var id_color_izq = 6; // Blue light
var id_tonalidad_color_izq = 9; // [0,9] --> Blue Light 9
var daltonismo = "protanopia"; // "protanopia" or "deuteranopia"

///// //////////////// //////

// Recorremos cada una de las tonalidades del color que estará a la derecha
array_color[id_color_derecha].escala.forEach(function(item, index){
  create_dual(index, item, id_color_izq, id_tonalidad_color_izq, id_color_derecha, daltonismo);
})


function create_dual(index, item, id_color_izq, id_tonalidad_color_izq, id_color_derecha, daltonismo){

  // Definimos la información que necesitamos sobre el color izq
  var color_izq = array_color[id_color_izq];
  var tonalidad_color_izq = array_color[id_color_izq].escala[id_tonalidad_color_izq];
  // Lo mismo con el derecho
  var color_derecho = item[daltonismo]
  // Definimos cual será la ruta para acceder a la imagen que vamos a crear
  var imgPath = './img/protanopia_'+color_izq.name+'_'+id_tonalidad_color_izq+'('+tonalidad_color_izq[daltonismo]+')_'+array_color[id_color_derecha].name+'_'+index+'('+color_derecho+').png';

  // Con esta linea creamos la imagen
  var image = PNGImage.createImage(500, 500);

  // Creamos dos recuadros en la imagen, cada uno con un color
  image.fillRect(0, 0, image.getWidth()/2, image.getHeight(), hexToRgb(tonalidad_color_izq[daltonismo]));
  image.fillRect(image.getWidth()/2, 0, image.getWidth()/2, image.getHeight(), hexToRgb(color_derecho));

  // Escribimos la imagen en la ruta especificada anteriormente para así
  image.writeImage(imgPath, function (err) {
      // Si hay algún error, lo mostramos
      if (err) throw err;

      // con estas lineas vamos a obtener los colores de la imagen y posteriormente vamos
      // a calcular el valor del Delta E
      getColors(imgPath).then(colors => {

        // Descomentar esta linea si quieres ver todos los colores que se generan
        // console.log(index + " " +  colors);

        var color_1 = colors[0];
        var color_2 = colors[1];

        var color_1_lab_aux = convert.hex.lab(color_1);
        var color_2_lab_aux = convert.hex.lab(color_2);

        var color_1_lab = {L: color_1_lab_aux[0], A: color_1_lab_aux[1], B: color_1_lab_aux[2]};
        var color_2_lab = {L: color_2_lab_aux[0], A: color_2_lab_aux[1], B: color_2_lab_aux[2]};

        // Transformamos los colores al formato LAB, necesario para aplicar la formula de delta
        // Una vez obtenidos dichos colores en LAB calculamos delta y lo guardamos en una variable
        var delta = DeltaE.getDeltaE00(color_1_lab, color_2_lab);

        // Mostramos el resultado en consola.
        console.log(index + " - " + color_1 + " y " + color_2 + ": " + delta);

        // El resultado con las variables que he definido sería:
        /*
            0 - #ececf4 y #24345c: 66.58979253018417
            1 - #d4d4e4 y #24345c: 61.95596087067836
            4 - #7c8cbc y #24345c: 32.802265388555156
            6 - #5c6ca4 y #24345c: 20.587456550573645
            3 - #9ca4cc y #24345c: 43.64399228454931
            8 - #3c4464 y #24345c: 6.099812082621549 (MENOR QUE 10)
            5 - #647cb4 y #24345c: 25.660103555484763
            9 - #24345c y #2c2c44: 7.542373955675033 (MENOR QUE 10)
            2 - #bcbcdc y #24345c: 55.2806078520487
            7 - #4c5c84 y #24345c: 13.284255778513279
        */
        // Como se ven, el Purple 8 y el 9 tienen un delta menor que 10 por ende no se verán bien,
        // coincide con lo que el datónico dijo en las pruebas.

      })

  });

}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        red: parseInt(result[1], 16),
        green: parseInt(result[2], 16),
        blue: parseInt(result[3], 16),
        alpha: parseInt(255)
    } : null;
}

//app.set('view engine', 'handlebars');
//app.engine('handlebars', exphbs());

/*app.get("/", (req, res)=>{

  res.render("index", {i: 0, colors: array_color})

})

app.listen(3000);*/

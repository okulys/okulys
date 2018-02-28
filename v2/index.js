/* 
 * Entrenar una red neural para 
 * simular la visión de un daltónico.
 * Sergio Clebal
 */

const Color = require("./color");

var rojo_original = "FA341A";
var rojo_protanopia = "70671B";

var rosa_original = "FF6DB6";
var rosa_protanopia = "8990BB";

var color = ["#000000", "#05454F", "#009291", "#FE6DB5", "#FDB4D9", "#480091", "#006DDB", "#B56CFE", "#6CB5FE", "#B5DBFE", "#910000", "#904800", "#DB6D00", "#24FC23"]
var pcolor = ["#000000", "#3F4047", "#3F4047", "#8990BB", "#C0C3DD", "#000198", "#0565DF", "#4372FE", "#99AAFE", "#CDD4FE", "#423D00", "#605A00", "#928900", "#F9EA4B"]

color.forEach((item, index) => {
    color[index] = new Color(1, "example", item);
})

pcolor.forEach((item, index) => {
    pcolor[index] = new Color(1, "example", item);
})


var brain = require('brain')

var net = new brain.NeuralNetwork();

var train = [];
for(let i = 0; i <= color.length - 1; i++) {
    train.push({input: color[i].rgb, output: pcolor[i].rgb })
}
console.log(train);

net.train(train)

var output = net.run({ r: 255 / 255, g: 254 / 255, b: 108 / 255} )

console.log(output.r * 255)
console.log(output.g * 255)
console.log(output.b * 255)
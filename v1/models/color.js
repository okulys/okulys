const blinder = require('color-blind');

module.exports = function(id, name, hex) {
  this.id = id || null;
  this.name = name || null;
  this.hex = hex || null;
  this.rgb = hexToRgb(this.hex) || null;
  this.escala = getEscala(this.rgb);
}

function Tonalidad(id, red, green, blue, alpha) {
  this.id = id || null;
  this.rgb = "rgba("+red+","+green+","+blue+","+alpha+")" || null;
  this.hex = rgbToHex(red, green, blue, alpha).split(".")[0] || null;
  this.protanopia = blinder.protanopia(this.hex) || null;
  this.deuteranopia = blinder.deuteranopia(this.hex) || null;
  this.tritanopia = blinder.tritanopia(this.hex) || null;
}

function getEscala(rgb) {

  var escala = [];
  const tonalidades = [-0.85, -0.7, -0.55, -0.35, -0.15, 0, 0.1, 0.25, 0.45, 0.65];

  tonalidades.forEach(function(item){

    if(item >= 0){

      var red = Math.floor(rgb.r - (rgb.r * item));
      var green = Math.floor(rgb.g - (rgb.g * item));
      var blue = Math.floor(rgb.b - (rgb.b * item));
      var alpha = 1;

      escala.push(new Tonalidad(0, red, green, blue, alpha));

    }else{

      var red = rgb.r;
      var green = rgb.g;
      var blue = rgb.b;
      var alpha = 1+item;

      escala.push(new Tonalidad(0, red, green, blue, alpha.toPrecision(2)));

    }

  })

  return escala;

}

function rgbToHex(red, green, blue, alpha) {
    var RGB_background = {r:255,g:255,b:255};

    var color = { r: (1 - alpha) * RGB_background.r + alpha * red,
                  g: (1 - alpha) * RGB_background.g + alpha * green,
                  b: (1 - alpha) * RGB_background.b + alpha * blue };

    return "#" + ((1 << 24) + (color.r << 16) + (color.g << 8) + color.b).toString(16).slice(1);
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

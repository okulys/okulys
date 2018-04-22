//var blinder = require('color-blind');

class Color {
    constructor(id, name, hex) {
        this.id = id;
        this.name = name || null;
        this.hex = hex || null;
        this.rgb = Color.hexToRgb(this.hex) || null;
        this.hls = Color.rgbToHsl(this.rgb[0], this.rgb[1], this.rgb[2])
        // this.toString = this.rgb[0] + this.rgb[1] + this.rgb[2];
        // var protanopia = blinder.protanopia(this.hex, true);
        // this.protanopia = {r: Math.round(protanopia.R), g: Math.round(protanopia.G), b: Math.round(protanopia.B)} || null;
        // this.deuteranopia = blinder.deuteranopia(this.hex) || null;
        // this.tritanopia = blinder.tritanopia(this.hex) || null;
    }

    static fromJson(json) {
        return new Color(json.id, json.name, json.hex);
    }

    static rgbToHex(red, green, blue, alpha) {
        var RGB_background = { r: 255, g: 255, b: 255 };

        var color = {
            r: (1 - alpha) * RGB_background.r + alpha * red,
            g: (1 - alpha) * RGB_background.g + alpha * green,
            b: (1 - alpha) * RGB_background.b + alpha * blue
        };

        return "#" + ((1 << 24) + (color.r << 16) + (color.g << 8) + color.b).toString(16).slice(1);
    }


    static hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ] : null;
    }

    static rgbToHsl(r, g, b) {
        r /= 255, g /= 255, b /= 255;

        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;

        if (max == min) {
            h = s = 0; // achromatic
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }

            h /= 6;
        }

        return [h, s, l];
    }


}

module.exports = Color;
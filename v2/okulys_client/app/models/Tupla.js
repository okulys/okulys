class Tupla {
    constructor(color1, color2, visible, not_visible, probability_visible, probability_not_visible) {
        this.color1 = color1;
        this.color2 = color2;

        this.visible = visible ||  0;
        this.not_visible = not_visible || 0;

        this.probability_visible = probability_visible  || 0;
        this.probability_not_visible = probability_not_visible || 0;
    }

    add(visibility) {

        if (visibility)
            this.not_visible++;
        else
            this.visible++;

        this.recalcule();
    }

    remove(visibility) {
        if (visibility)
            this.not_visible--;
        else
            this.visible--;

        this.recalcule();
    }

    recalcule() {
        var total = this.visible + this.not_visible
        this.probability_not_visible = this.not_visible / total;
        this.probability_visible = this.visible / total;
    }

    static fromJson(json) {
        return new Tupla(json.color1, json.color2, json.visible, json.not_visible, json.probability_visible, json.probability_not_visible);
    }
}

module.exports = Tupla;
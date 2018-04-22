class Point {
    constructor(x, y, probability) {
        this.x = x || null;
        this.y = y || null;
        this.probability = probability;
    }

    static fromJson(json) {
        return new Point(json.x, json.y, json.probability)
    }
}
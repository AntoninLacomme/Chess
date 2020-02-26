
class Player {

    constructor (color, side) {
        this.color = color;
        this.side = side;
        this.listPieceLose = [];
    }

    getKing (datagrille) {
        let king;
        datagrille.forEach ((line) => {
            line.forEach((value) => {
                if (value.constructor == King && value.color == this.color) {
                    king = value;
                }
            });
        });
        return king;
    }
}

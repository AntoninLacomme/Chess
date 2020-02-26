
class Pion extends Piece {

    constructor (x, y, player) {
        super (x, y, player);

        this.direction = -1;
        if (player.side == "top") {
            this.direction = 1;
        }
        if (player.side == "bottom") {
            this.direction = -1;
        }
    }

    getMovements (datagrille) {
        let arrayMovements = [];
        let letContinue, cellule;

        let max = 1;
        if (!this.isMove) {
            max = 2;
        }

        for (let i=1; i<=max; i++) {
            letContinue = Piece.canPlaceOnCoords(this, this.coordX, this.coordY + (i * this.direction), datagrille);
            if (letContinue[1]) {
                arrayMovements.push ({X: this.coordX, Y: this.coordY + (i * this.direction)});
            }
            else {
                break;
            }
        }
        // peut-on manger sur les côtés ?
        for (let i=-1; i<2; i = i + 2) {
            letContinue = Piece.canPlaceOnCoords(this, this.coordX + i, this.coordY + (1 * this.direction), datagrille);
            try {
                cellule = datagrille[this.coordY + (1 * this.direction)][this.coordX + i];
                if (letContinue[0] && cellule != 0 && cellule.color != this.color) {
                    arrayMovements.push ({X: this.coordX + i, Y: this.coordY + (1 * this.direction)});
                }
            }
            catch (error) { }
        }

        return arrayMovements;
    }

    static getNewPiece (x, y, color) {
        return new Pion (x, y, color);
    }

    static getSprite (color) {
        let img = new Image();
        if (color == "white") {
            img.src = "src/pictures/wp.webp";
        }
        else {
            img.src = "src/pictures/bp.webp";
        }
        return img;
    }
}

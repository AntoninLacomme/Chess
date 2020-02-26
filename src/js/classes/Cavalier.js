
class Cavalier extends Piece {

    constructor (x, y, player) {
        super (x, y, player);
    }

    getMovements (datagrille) {
        let arrayMovements = [];
        let letContinue;

        // recherche à gauche
        [[-2, -1], [-2, 1], [2, -1], [2, 1], [-1, -2], [1, -2], [-1, 2], [1, 2]].forEach((emplacement) => {
            letContinue = Piece.canPlaceOnCoords(this, this.coordX + emplacement[0], this.coordY + emplacement[1], datagrille);
            if (letContinue[0]) {
                arrayMovements.push ({X: this.coordX + emplacement[0], Y: this.coordY + emplacement[1]});
            }
        });

        return arrayMovements;
    }

    static getNewPiece (x, y, color) {
        return new Cavalier (x, y, color);
    }

    static getSprite (color) {
        let img = new Image();
        if (color == "white") {
            img.src = "src/pictures/wc.webp";
        }
        else {
            img.src = "src/pictures/bc.webp";
        }
        return img;
    }
}

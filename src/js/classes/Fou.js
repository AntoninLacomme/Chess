
class Fou extends Piece {

    constructor (x, y, player) {
        super (x, y, player);
    }

    static getNewPiece (x, y, color) {
        return new Fou (x, y, color);
    }

    getMovements (datagrille) {
        let arrayMovements = [];
        let letContinue;

        // recherche à gauche
        for (let i=1; i<7; i++) {
            letContinue = Piece.canPlaceOnCoords(this, this.coordX - i, this.coordY - i, datagrille);
            if (letContinue[0]) {
                arrayMovements.push ({X: this.coordX - i, Y: this.coordY - i});
            }
            if (!letContinue[1]) {
                break;
            }
        }

        // recherche à droit
        for (let i=1; i<7; i++) {
            letContinue = Piece.canPlaceOnCoords(this, this.coordX + i, this.coordY + i, datagrille);
            if (letContinue[0]) {
                arrayMovements.push ({X: this.coordX + i, Y: this.coordY + i});
            }
            if (!letContinue[1]) {
                break;
            }
        }

        // recherche en haut
        for (let i=1; i<7; i++) {
            letContinue = Piece.canPlaceOnCoords(this, this.coordX + i, this.coordY - i, datagrille);
            if (letContinue[0]) {
                arrayMovements.push ({X: this.coordX + i, Y: this.coordY - i});
            }
            if (!letContinue[1]) {
                break;
            }
        }

        // recherche en bas
        for (let i=1; i<7; i++) {
            letContinue = Piece.canPlaceOnCoords(this, this.coordX - i, this.coordY + i, datagrille);
            if (letContinue[0]) {
                arrayMovements.push ({X: this.coordX - i, Y: this.coordY + i});
            }
            if (!letContinue[1]) {
                break;
            }
        }

        return arrayMovements;
    }

    static getSprite (color) {
        let img = new Image();
        if (color == "white") {
            img.src = "src/pictures/wf.webp";
        }
        else {
            img.src = "src/pictures/bf.webp";
        }
        return img;
    }
}


class Queen extends Piece {

    constructor (x, y, player) {
        super (x, y, player);

        this.pseudoPlayer = {color: player.color };
    }

    getMovements (datagrille) {
        let listMovements = Fou.getNewPiece (this.coordX, this.coordY, this.pseudoPlayer).getMovements(datagrille);
        listMovements = listMovements.concat(Tower.getNewPiece (this.coordX, this.coordY, this.pseudoPlayer).getMovements(datagrille));1
        return listMovements;
    }

    static getSprite (color) {
        let img = new Image();
        if (color == "white") {
            img.src = "src/pictures/wq.webp";
        }
        else {
            img.src = "src/pictures/bq.webp";
        }
        return img;
    }

    static getNewPiece (x, y, color) {
        return new Queen (x, y, color);
    }
}

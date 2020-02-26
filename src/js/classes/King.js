
class King extends Piece {

    constructor (x, y, player) {
        super (x, y, player);

        this.isInEchec = false;
    }

    movePiece (x, y, rock=null) {
        super.movePiece (x, y);

        if (rock != null) {
            plateau.movePiece(rock.tower, rock.X, rock.Y);
        }
    }

    drawMyself (ctx) {
        King.drawPiece(ctx, this);
    }

    getMovements (datagrille) {
        let arrayMovements = [];
        let letContinue;

        // mouvements classiques
        for (let i=-1; i<=1; i++) {
            for (let j=-1; j<=1; j++) {
                letContinue = Piece.canPlaceOnCoords(this, this.coordX + i, this.coordY + j, datagrille);
                if (letContinue[0]) {
                    arrayMovements.push ({X: this.coordX + i, Y: this.coordY + j});
                }
            }
        }

        // le rock
        if (!this.isMove) {
            try {
                for (let i=1; i<4; i++) {
                    letContinue = Piece.canPlaceOnCoords(this, this.coordX + i, this.coordY, datagrille);
                    if (!letContinue[0] || !letContinue[1]) {
                        break;
                    }
                    if (datagrille[this.coordY][this.coordX + i+1].constructor === Tower && !datagrille[this.coordY][this.coordX + i+1].isMove) {
                        arrayMovements.push ({X: this.coordX + 2, Y: this.coordY, rock: {X: this.coordX+1, Y: this.coordY, tower: datagrille[this.coordY][this.coordX + i+1]}});
                    }
                }
            }
            catch (error) { }
            try {
                for (let i=1; i<4; i++) {
                    letContinue = Piece.canPlaceOnCoords(this, this.coordX - i, this.coordY, datagrille);
                    if (!letContinue[0] || !letContinue[1]) {
                        break;
                    }
                    if (datagrille[this.coordY][this.coordX - i-1].constructor === Tower && !datagrille[this.coordY][this.coordX - i-1].isMove) {
                        arrayMovements.push ({X: this.coordX - 2, Y: this.coordY, rock: {X: this.coordX-1, Y: this.coordY, tower: datagrille[this.coordY][this.coordX - i-1]}});
                    }
                }
            }
            catch (error) { }
        }

        if (this.isInEchec) {
            let emplacement;
            let tempDataGrille;
            for (let i = arrayMovements.length -1; i>=0; i--) {
                emplacement = arrayMovements[i];

                tempDataGrille = cloneMatrice (datagrille);
                tempDataGrille[emplacement.Y][emplacement.X] = new King(emplacement.X, emplacement.Y, {color: this.color});
                tempDataGrille[this.coordY][this.coordX] = 0;

                if (tempDataGrille[emplacement.Y][emplacement.X].getPieceCanEatMe(tempDataGrille).length > 0) {
                    arrayMovements.splice(i, 1);
                }
            }
        }

        return arrayMovements;
    }

    isEchecEtMat (datagrille) {
        let echecEtMat = true;
        if (this.getMovements(datagrille).length == 0) {
            datagrille.forEach((line) => {
                line.forEach((value) => {
                    if (echecEtMat && (value.color == this.color) && (value.needProtectMyKing(datagrille, value.getMovements(datagrille)).length > 0)) {
                        echecEtMat = false;
                    }
                });
            });
            if (echecEtMat) {
                return true;
            }
        }
        return false;
    }

    static getSprite (color) {
        let img = new Image();
        if (color == "white") {
            img.src = "src/pictures/wk.webp";
        }
        else {
            img.src = "src/pictures/bk.webp";
        }
        return img;
    }

    static getNewPiece (x, y, color) {
        return new King (x, y, color);
    }
}

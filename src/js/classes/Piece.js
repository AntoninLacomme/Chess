

class Piece {

    constructor (x, y, player) {
        // condition indiquant que la classe Piece est une classe abstraite
        if (this.constructor === Piece) {
          throw new TypeError ('Abstract class "AbstractConfig" cannot be instantiated directly');
        }

        this.coordX = x;
        this.coordY = y;

        this.vx = 0;
        this.vy = 0;

        this.color = player.color;
        this.isFocus = false;
        this.isMove = false;
    }

    movePiece (x, y) {
        this.coordX = x;
        this.coordY = y;
        this.isMove = true;
    }

    setVecteursAnimation (x, y) {
        this.vx = (this.coordX - x) / 60;
        this.vy = (this.coordY - y) / 60;
    }

    drawMyself (ctx) {
        this.constructor.drawPiece (ctx, this);
    }

    getCoords () {
        return {X: this.coordX, Y: this.coordY};
    }

    getPieceCanEatMe (datagrille) {
        let emplacementCanEat = [];

        // check up des déplacements de cavalier
        let cavEmplacements = new Cavalier (this.coordX, this.coordY, {color: this.color}).getMovements(datagrille);
        let towerEmplacements = new Tower (this.coordX, this.coordY, {color: this.color}).getMovements(datagrille);
        let fouEmplacements = new Fou (this.coordX, this.coordY, {color: this.color}).getMovements(datagrille);
        let kingEmplacements = new King (this.coordX, this.coordY, {color: this.color}).getMovements(datagrille);
        let pionEmplacements = new Pion (this.coordX, this.coordY, {color: this.color}).getMovements(datagrille);

        cavEmplacements.forEach((emplacement) => {
            if (datagrille[emplacement.Y][emplacement.X].constructor == Cavalier && datagrille[emplacement.Y][emplacement.X].color != this.color) {
                emplacementCanEat.push(emplacement);
            }
        });
        kingEmplacements.forEach((emplacement) => {
            if ((datagrille[emplacement.Y][emplacement.X].constructor == King) &&
                datagrille[emplacement.Y][emplacement.X].color != this.color) {
                emplacementCanEat.push(emplacement);
            }
        });
        fouEmplacements.forEach((emplacement) => {
            if ((datagrille[emplacement.Y][emplacement.X].constructor == Fou) ||
                (datagrille[emplacement.Y][emplacement.X].constructor == Queen) &&
                datagrille[emplacement.Y][emplacement.X].color != this.color) {
                emplacementCanEat.push(emplacement);
            }
        });
        towerEmplacements.forEach((emplacement) => {
            if ((datagrille[emplacement.Y][emplacement.X].constructor == Tower) ||
                (datagrille[emplacement.Y][emplacement.X].constructor == Queen) &&
                datagrille[emplacement.Y][emplacement.X].color != this.color) {
                emplacementCanEat.push(emplacement);
            }
        });
        pionEmplacements.forEach((emplacement) => {
            if (datagrille[emplacement.Y][emplacement.X].constructor == Pion && datagrille[emplacement.Y][emplacement.X].color != this.color) {
                emplacementCanEat.push(emplacement);
            }
        });
        return emplacementCanEat;
    }

    needProtectMyKing (datagrille, listEmplacements) {
        let resListEmpl = listEmplacements.slice();
        let tempDatagrille = [];
        let king = null;
        let tempPiece = null;
        listEmplacements.forEach((emplacement) => {
            tempDatagrille = cloneMatrice(datagrille);
            tempPiece = this.constructor.getNewPiece(emplacement.X, emplacement.Y, {color: this.color});
            tempDatagrille[emplacement.Y][emplacement.X] = tempPiece;
            tempDatagrille[this.coordY][this.coordX] = 0;
            king = this.getMyKing(tempDatagrille);

            if (king.getPieceCanEatMe(tempDatagrille).length > 0) {
                resListEmpl.splice(resListEmpl.indexOf(emplacement), 1);
            }
        });

        return resListEmpl;
    }

    getMyKing (datagrille) {
        let king = null;
        datagrille.forEach ((line) => {
            line.forEach((value) => {
                if (value.constructor == King && value.color == this.color) {
                    king = value;
                }
            });
        });
        return king;
    }

    static getNewPiece (x, y, color) {
        throw new Error ("Function getNewPiece is not implemented !");
    }

    static getMovements (datagrille) {
        throw new Error ("Function getMovements is not implemented !");
    }

    static getSprite (color) {
        throw new Error ("Function getSprite is not implemented !");
    }

    static drawPiece (ctx, tower) {
        ctx.save ();
        ctx.translate (Plateau.widthDiv * tower.coordX, Plateau.widthDiv * tower.coordY);

        if (tower.isFocus) {
            ctx.save ();
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = "gold";
            ctx.fillRect (0, 0, Plateau.widthDiv, Plateau.widthDiv);
            ctx.restore ();
        }

        ctx.drawImage (tower.constructor.getSprite(tower.color), 0, 0, Plateau.widthDiv, Plateau.widthDiv);
        ctx.restore ();
    }

    static canPlaceOnCoords (piece, x, y, datagrille) {
        if (x < 0 || y < 0) { return [false, false]; }
        if (x >= 8 || y >= 8) { return [false, false]; }
        if (datagrille[y][x] == 0) { return [true, true] }
        if (datagrille[y][x].color == piece.color) { return [false, false]; }
        return [true, false];
    }
}

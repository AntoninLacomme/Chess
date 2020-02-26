

class Plateau {

    static widthDiv = 80;
    static marge = 50;

    constructor (p1, p2) {
        this.player1 = p1;
        this.player2 = p2;
        this.playerPlay;

        if (p1.color == "white") {
            this.playerPlay = p1;
        }
        if (p2.color == "white") {
            this.playerPlay = p2;
        }

        this.onAnimation = false;

        this.dataMatrice = this.setEmptyDataMatrice ();
        this.listPiece = [];
        this.arrayCellulesActives = [];
        this.listPieceEchec = [];
        this.actualCellFocus = null;
        this.lastCellFocus = null;

        this.setOriginalPiece (this.player1, this.player2);
    }

    switchPlayer () {
        if (this.player1 == this.playerPlay) {
            this.playerPlay = this.player2;
        }
        else {
            this.playerPlay = this.player1;
        }
    }

    setEmptyDataMatrice () {
        let matrice = [];
        let line;
        for (let i=0; i<8; i++) {
            line = [];
            for (let j=0; j<8; j++) {
                line.push(0);
            }
            matrice.push(line);
        }
        return matrice;
    }

    setPiece (x, y, classPiece, player) {
        this.dataMatrice[y][x] = classPiece.getNewPiece (x, y, player);
        return this.dataMatrice[y][x];
    }

    setOriginalPiece (player1, player2) {
        let player;
        let y;
        for (let i=0; i<2; i++) {
            if (i == 0) { player = player1; }
            if (i == 1) { player = player2; }

            if (player.side == "bottom") {
                y = [7, 6];
            }
            if (player.side == "top") {
                y = [0, 1];
            }

            for (let k=0; k<8; k++) {
                this.setPiece (k, y[1], Pion, player);

                if (k == 0 || k == 7) {
                    this.setPiece (k, y[0], Tower, player);
                }
                if (k == 1 || k == 6) {
                    this.setPiece (k, y[0], Cavalier, player);
                }
                if (k == 2 || k == 5) {
                    this.setPiece (k, y[0], Fou, player);
                }

                if (k == 3 && this.getColorCellule(k, y[0]) == player.color) {
                    this.setPiece (k, y[0], Queen, player);
                }
                else if (k == 3){
                    this.setPiece (k, y[0], King, player);
                }

                if (k == 4 && this.getColorCellule(k, y[0]) == player.color) {
                    this.setPiece (k, y[0], Queen, player);
                }
                else if (k == 4){
                    this.setPiece (k, y[0], King, player);
                }
            }
        }
    }

    setCellulesActives (piece, arrayCellules) {
        try {
          this.arrayCellulesActives = piece.needProtectMyKing (this.dataMatrice, arrayCellules);
        }
        catch (error) { this.arrayCellulesActives = []; }
    }

    movePiece (piece, cx, cy, rock=null) {
        if (piece.color == this.playerPlay.color) {
            this.dataMatrice[cy][cx] = piece;
            this.dataMatrice[piece.coordY][piece.coordX] = 0;
            piece.movePiece (cx, cy, rock);

            // le déplacement a été effectué
            // on check les mouvements possibles pour toutes les pièces
            // en essayant de trouver une mise en echec

            this.kingIsEchec();

            this.switchPlayer ();
        }
    }

    getColorCellule (x, y) {
        if ((x%2 == 0 && y%2 == 0) || (x%2 == 1 && y%2 == 1)) {
            return "white";
        }
        return "black";
    }

    drawPlateau (ctx) {
        let colDiv;
        ctx.save ();
        ctx.translate (Plateau.marge, Plateau.marge);

        for (let i =0; i<8; i++) {
            for (let j=0; j<8; j++) {
                colDiv = this.getColorCellule (i, j);
                if (colDiv == "black") {
                    colDiv = "rgb(120, 120, 120)";
                }

                ctx.fillStyle = colDiv;
                ctx.fillRect (i * Plateau.widthDiv, j * Plateau.widthDiv, Plateau.widthDiv, Plateau.widthDiv);


            }
        }

        // Affichage des cases sur lesquelles la pièce peu se déplacer

        this.arrayCellulesActives.forEach((coord) => {
            ctx.save ();
            ctx.fillStyle = "blue";
            ctx.globalAlpha = 0.5;
            ctx.fillRect (coord.X * Plateau.widthDiv, coord.Y * Plateau.widthDiv, Plateau.widthDiv, Plateau.widthDiv);
            ctx.restore ();
        });

        // Affichage des pièces mettant en danger direct la pièce sur laquelle on a cliqué
        /*if (this.actualCellFocus != null && this.actualCellFocus != 0 && this.actualCellFocus.isFocus) {
            console.log(this.actualCellFocus);
            this.actualCellFocus.getPieceCanEatMe (this.dataMatrice).forEach ((element) => {
                ctx.save ();
                ctx.fillStyle = "red";
                ctx.globalAlpha = 0.5;
                ctx.fillRect (element.X * Plateau.widthDiv, element.Y * Plateau.widthDiv, Plateau.widthDiv, Plateau.widthDiv);
                ctx.restore ();
            });
        }*/

        this.listPieceEchec.forEach ((element) => {
            ctx.save ();
            ctx.fillStyle = "red";
            ctx.globalAlpha = 0.5;
            ctx.fillRect (element.X * Plateau.widthDiv, element.Y * Plateau.widthDiv, Plateau.widthDiv, Plateau.widthDiv);
            ctx.restore ();
        });

        for (let i =0; i<8; i++) {
            for (let j=0; j<8; j++) {
                if (this.dataMatrice[j][i] != 0) {
                    try {
                        this.dataMatrice[j][i].drawMyself (ctx);
                    }
                    catch (error) { /*console.log(error);*/ }
                }
            }
        }

        ctx.restore ();
    }

    kingIsEchec () {
        //let kingj1 = this.player1.getKing (this.dataMatrice);
        //let kingj2 = this.player2.getKing (this.dataMatrice);
        let king;
        if (this.playerPlay.color == this.player1.color) {
            king = this.player2.getKing (this.dataMatrice);
        }
        else {
            king = this.player1.getKing (this.dataMatrice);
        }

        this.listPieceEchec = king.getPieceCanEatMe (this.dataMatrice);
        if (this.listPieceEchec.length > 0) {
            this.dataMatrice[king.coordY][king.coordX].isInEchec = true;
            if (this.dataMatrice[king.coordY][king.coordX].isEchecEtMat (this.dataMatrice)) {
                console.log(king);
                alert("Roi " + king.color + " mis en échec et mat !");
            }
        }
        else { this.dataMatrice[king.coordY][king.coordX].isInEchec = false; }
    }

    activeFocus () {
        if (this.actualCellFocus != 0 && !this.actualCellFocus.isFocus) {
            this.setCellulesActives(this.actualCellFocus, this.actualCellFocus.getMovements (this.dataMatrice));
            this.actualCellFocus.isFocus = true;
        }
        else {
            this.setCellulesActives(this.actualCellFocus, []);
            try {
                this.actualCellFocus.isFocus = false;
            }
            catch (error) { }
        }
    }

    clickOnPoint (event) {
        if (!this.onAnimation) {
            let cx = ((event.offsetX - Plateau.marge) / Plateau.widthDiv) | 0;
            let cy = ((event.offsetY - Plateau.marge) / Plateau.widthDiv) | 0;

            this.lastCellFocus = this.actualCellFocus;
            try {
                if (cx != this.actualCellFocus.coordX || cy != this.actualCellFocus.coordY) {
                    this.actualCellFocus.isFocus = false;
                }
            }
            catch (error) { }

            if (event.offsetX > Plateau.marge && event.offsetY > Plateau.marge && cx >= 0 && cx < 8 && cy >= 0 && cy < 8) {
                this.actualCellFocus = this.dataMatrice[cy][cx];
            }
            else {
                this.actualCellFocus = null;
            }

            let hasMove = false;
            if (this.arrayCellulesActives.length > 0) {
                this.arrayCellulesActives.forEach ((element) => {
                    if (element.X == cx && element.Y == cy) {
                        this.movePiece (this.lastCellFocus, cx, cy, element.rock);
                        hasMove = true;
                    }
                });
            }

            if (!hasMove) { this.activeFocus (); }
            else { this.setCellulesActives(this.actualCellFocus, []); }
        }
    }
}

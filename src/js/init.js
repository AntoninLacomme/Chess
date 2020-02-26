
window.onload = init;
window.onresize = resize;


var canvas, ctx;

function init () {
    canvas = document.querySelector("#canvas-chess");
    ctx = canvas.getContext("2d");

    // set up du css
    canvas.style.backgroundColor = "rgb(50, 50, 50)";
    canvas.style.position = "absolute";
    canvas.style.top = "0px";
    canvas.style.left = "0px";

    resize ();

    plateau = new Plateau (new Player ("white", "bottom"), new Player ("black", "top"));
    canvas.onclick = plateauClicked;

    run ();
}

function plateauClicked (event) {
    plateau.clickOnPoint(event);
}

function run () {
    plateau.drawPlateau(ctx);
    requestAnimationFrame (run);
}

function resize () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function cloneMatrice (matrice) {
    return matrice.map((line) => {
        return line.slice();
    });
}

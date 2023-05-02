
$(document).ready(function () {

    let campo = new Campo(10, 10);
    let gioco = true;

    $('#select-diff').change(function () {
        let x = $('#select-diff');
        x = x[0].value;
        if (x[0] == "P") {
            $('#nBombe').text("Numero Bombe: 10");
            campo = new Campo(10, 10);
        }
        else if (x[0] == "I") {
            $('#nBombe').text("Numero Bombe: 12");
            campo = new Campo(12, 12);
        }
        else if (x[0] == "A") {
            $('#nBombe').text("Numero Bombe: 15");
            campo = new Campo(15, 15);
        }

        campo.generaCampo(x[0]);
        $('.cella').css("line-height", $('.cella').width() + "px");
        $('.cella').css("font-size", (32 / 50) * $('.cella').width() + "px");
        campo.piazzaBombe();
    });

    campo.generaCampo("P");
    $('.cella').css("line-height", $('.cella').width() + "px");
    $('.cella').css("font-size", (32 / 50) * $('.cella').width() + "px");
    campo.piazzaBombe();

    $('.cella').click(function () {

        if (gioco) {
            let x = $(this).attr("data-row");
            let y = $(this).attr("data-col");
            if (!campo.check(parseInt(x), parseInt(y))) {
                gioco = false;
                $('#fine').html("You Lose!");
            } else if (campo.dim * campo.dim - campo.open <= campo.bombe) {
                gioco = false;
                $('#fine').html("You Win!");
            }
            if (!gioco)
                campo.scopriMine();
        } else {
            alert("End Game!");
        }
    });

    $('#r').click(function () {
        location.reload();
    });
});
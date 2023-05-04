$(document).ready(function () {


    $('#select').change(function () {
        let x = $('#select');
        x = x[0].value;
        let campo;
        if (x == "1") {
            campo = new Campo(10, 15);
        }
        else if (x == "2") {
            campo = new Campo(20, 60);
        }
        else if (x == "3") {
            campo = new Campo(30, 130);
        }
        else if (x == "4") {
            campo = new Campo(25, 150);
        }

        campo.clear();
        campo.generaCampo();
        
        $('#first').hide();
        $('#end').hide();
    });


    $('#restart').click(function () {
        location.reload();
        $('#end').hide();
    });
});

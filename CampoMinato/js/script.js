$(document).ready(function () {


    $('#select').change(function () {
        let x = $('#select');
        
        const campo = new Campo(x[0].value, x[0].value);

        campo.generaCampo();
        
        $('#first').hide();
    });


    $('#restart').click(function () {
        location.reload();
        $('#end').hide();
    });
});

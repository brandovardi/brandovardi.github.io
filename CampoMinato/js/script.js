$(document).ready(function () {
    const campo = new Campo(10, 10);

    campo.generaCampo();

    $('#restart').click(function () {
        location.reload();
        $('#end').hide();
    });
});

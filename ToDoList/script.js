let l1 = new Lista();

$(document).ready(function () {

    $(window).on('beforeunload', function () {
        // Salva i dati qui
        localStorage.setItem('dati', JSON.stringify(l1));
    });

    $('input[type="checkbox"]').change(function () {
        let id = $(this).attr('id');
        if ($(this).is(':checked')) {
            $('tr[id="' + id + '"]').css('background', 'lightred');
        } else {
            $('tr[id="' + id + '"]').css('background', 'white');
        }
    });

    let listaSalvata = localStorage.getItem('dati');

    if (listaSalvata !== null) {
        let l1Tmp = JSON.parse(listaSalvata);
        l1.eventi = l1Tmp.eventi;
        l1.table = l1Tmp.table;
        l1.drawTable();
    }

});

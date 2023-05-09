const classi = ['1', '2', '3', 'P'];

$(document).ready(function () {

    // funzione per cambiare lo sfondo al testo in base se la checkbox è attiva o meno 
    function change (td) {
        if (td.css('background-color') === 'rgb(255, 160, 0)') {
            td.css('background-color', '');
        }
        else {
            td.css('background-color', 'rgb(255, 160, 0)');
        }
    }

    //////////////////////////////////////////
    // partenza sicura
    $('#partS').click(function () {
        change($(this));
    });

    //////////////////////////////////////////
    // vicinato sicuro
    $('#vicS').click(function () {
        change($(this));
    });
    //////////////////////////////////////////

    // if per quando si carica la pagina per la prima volta
    if ($('#select').val() == "1") {
        $('#campo_minato').toggleClass($('#select').val(), true);
        let campo = new Campo(8, 8, 10);
        campo.clear();
        campo.generaCampo();
    }
    
    // metodo per cambiare classe al campo in base alla difficoltà scelta
    function changeClass($val) {
        // se i valori passati sono maggiori delle classe presenti nel gioco allora non faccio nulla
        if ($val.length > classi.length) return;
        // ciclo per cambiare la classe del campo
        for (let i = 0; i < classi.length; i++) {
            $('#campo_minato').toggleClass(classi[i], $val[i]);
        }
    }

    // quando cambio l'opzione della select
    $('#select').change(function () {
        // mi salvo il valore appena selezionato
        let difficulty = $(this).val();
        // inizializzo un campo undefined
        let campo;
        // controllo i vari casi possibili e creo il campo in base alla scelta
        if (difficulty == "1") {
            campo = new Campo(8, 8, 10);
            $('#personalizza').css({display:'none'});
            changeClass([true, false, false, false]);
        }
        else if (difficulty == "2") {
            campo = new Campo(16, 16, 40);
            $('#personalizza').css({display:'none'});
            changeClass([false, true, false, false]);
        }
        else if (difficulty == "3") {
            campo = new Campo(16, 31, 99);
            $('#personalizza').css({display:'none'});
            changeClass([false, false, true, false]);
        }
        else if (difficulty == "P") {
            // se l'utente vuole personalizzare il campo allora rendo visibile il div per personalizzare
            $('#personalizza').css({display:'block'});
            // prendo l'elemento campo_minato
            let boardClass = $('#campo_minato');
            // imposto già dei dati predefiniti nei campi personalizzabili in base alla difficoltà scelta...
            // ...(quindi controllo la classe del campo)
            if (boardClass.hasClass('1')) {
                impostaValoriDefaultPersonal('8', '8', '10');
            }
            else if (boardClass.hasClass('2')) {
                impostaValoriDefaultPersonal('16', '16', '40');
            }
            else if (boardClass.hasClass('3')) {
                impostaValoriDefaultPersonal('16', '31', '99');
            }
            return;
        }
        // pulisco il campo prima di ridisegnarlo 
        campo.clear();
        // e lo genero
        campo.generaCampo();
        // nascondo il div utile per sapere se si ha vinto o perso alla fine del gioco
        $('#end').hide();
    });

    // funzione per impostare dei valori predefiniti quando si vuole personalizzare il campo
    // (usciranno i valori della difficoltà attuale)
    function impostaValoriDefaultPersonal(x1, x2, x3) {
        // cambio direttamente i valori
        $('#Maxh').val(x1);
        $('#Maxw').val(x2);
        $('#numBomb').val(x3);
    }

    // quando viene premuto il pulsante ok del div per personalizzare
    $('#OKButton').click(function () {
        // mi salvo i dati inseriti
        let alt = $('#Maxh').val();
        let larg = $('#Maxw').val();
        let mine = $('#numBomb').val();

        // controllo che siano stati inseriti correttamente
        if ((alt < 8 || alt > 24) || (larg < 8 || larg > 32) || (mine < 1 || mine > ((alt * larg) / 3))) {
            alert("Le dimensioni del tuo Campo non sono valide:"
                    + "\n->Altezza: da 8 a 24" 
                    + "\n->Larghezza: da 8 a 32"
                    + "\n->Bombe: da 1 a 1/3 delle caselle");
            return;
        }
        // creo il campo con gli attributi inseriti dall'utente
        let campo = new Campo(alt, larg, mine);
        // nascondo il campo div per personalizzare
        $('#personalizza').css({display:'none'});
        // modifico la classe del campo
        changeClass([false, false, false, true]);
        // poi pulisco e rigenero il campo
        campo.clear();
        campo.generaCampo();
    });

    // se preme il pulsante annulla
    $('#CancelButton').click(function () {
        // allora nascondo il div per personalizzare
        $('#personalizza').css({display:'none'});
        // mi salvo il campo minato perché mi servirà controllare la classe
        let x = $('div#campo_minato');
        // in base alla classe modifico il valore nella select
        if (x.hasClass('1')) {
            $('#select').val('1');
            changeClass([true, false, false, false]);
        }
        else if (x.hasClass('2')) {
            $('#select').val('2');
            changeClass([false, true, false, false]);
        }
        else if (x.hasClass('3')) {
            $('#select').val('3');
            changeClass([false, false, true, false]);
        }
        else if (x.hasClass('P')) {
            $('#select').val('P');
            changeClass([false, false, false, true]);
        }
    });

    // quando viene premuto il pulsante "restart"
    $('#restart').click(function () {
        // mi salvo il campo minato perché mi servirà controllare la classe
        let x = $('div#campo_minato');
        // nascondo la scritta visibile alla fine del gioco
        $('#end').hide();
        // inizializzo un campo undefined
        let campo;
        // e in base alla scelta "resetto" il campo
        if (x.hasClass('1')) {
            campo = new Campo(8, 8, 10);
            $('#select').val('1');
            changeClass([true, false, false, false]);
        }
        else if (x.hasClass('2')) {
            campo = new Campo(16, 16, 40);
            $('#select').val('2');
            changeClass([false, true, false, false]);
        }
        else if (x.hasClass('3')) {
            campo = new Campo(16, 31, 99);
            $('#select').val('3');
            changeClass([false, false, true, false]);
        }
        else if (x.hasClass('P')) {
            // se l'utente resetta il campo è c'è l'opzione personalizzata selezionata
            // mi salvo i valori precedentemente inseriti
            let alt = $('#Maxh').val();
            let larg = $('#Maxw').val();
            let mine = $('#numBomb').val();
            // controllo che i valori esistano
            if (alt != '' && larg != '' && mine != '') {
                // e controllo che siano stati inseriti correttamente
                if ((alt < 8 || alt > 24) || (larg < 8 || larg > 32) || (mine < 1 || mine > ((alt * larg) / 3))) {
                    alert("Le dimensioni del tuo Campo non sono valide:"
                            + "\n->Altezza: da 8 a 24" 
                            + "\n->Larghezza: da 8 a 32"
                            + "\n->Bombe: da 1 a 1/3 delle caselle");
                    return;
                }
                else {
                    // se sono stati inseriti correttamente allora creo i campi con i dati precedenti
                    campo = new Campo(alt, larg, mine);
                    $('#select').val('P');
                    changeClass([false, false, false, true]);
                }
            }
        }
        // nascondo il div per personalizzare
        $('#personalizza').css({display:'none'});
        // poi pulisco e rigenero il campo
        campo.clear();
        campo.generaCampo();
    });
});

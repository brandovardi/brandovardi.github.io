$(document).ready(function () {

    // if per quando si carica la pagina per la prima volta
    if ($('#select').val() == "1") {
        let campo = new Campo(8, 8, 10);
        campo.clear();
        campo.generaCampo();
    }

    // quando cambio l'opzione della select
    $('#select').change(function () {
        // mi salvo il valore appena selezionato
        let x = $(this).val();
        // inizializzo un campo undefined
        let campo;
        // controllo i vari casi possibili e creo il campo in base alla scelta
        if (x == "1") {
            campo = new Campo(8, 8, 10);
            $('#personalizza').css({display:'none'});
        }
        else if (x == "2") {
            campo = new Campo(16, 16, 40);
            $('#personalizza').css({display:'none'});
        }
        else if (x == "3") {
            campo = new Campo(16, 31, 99);
            $('#personalizza').css({display:'none'});
        }
        else if (x == "P") {
            // se l'utente vuole personalizzare il campo allora rendo visibile il div per personalizzare
            $('#personalizza').css({display:'block'});
            return;
        }

        // pulisco il campo prima di ridisegnarlo 
        campo.clear();
        // e lo genero
        campo.generaCampo();
        // nascondo il div utile per sapere se si ha vinto o perso alla fine del gioco
        $('#end').hide();
    });

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
        // poi pulisco e rigenero il campo
        campo.clear();
        campo.generaCampo();
    });

    // se preme il pulsante annulla
    $('#CancelButton').click(function () {
        // allora nascondo il div per personalizzare
        $('#personalizza').css({display:'none'});
        // resetto l'opzione su "Principiante"
        $('#select').val('1');
        // e ricreo il campo
        let campo = new Campo(8, 8, 10);
        campo.clear();
        campo.generaCampo();
    });

    // quando viene premuto il pulsante "restart"
    $('#restart').click(function () {
        // mi salvo il valore nella select in modo tale che resetto la pagina mantenendo lo stesso "livello" scelto precedentemente
        let k = $('#select').val();
        // nascondo la scritta visibile alla fine del gioco
        $('#end').hide();
        // inizializzo un campo undefined
        let campo;
        // e in base alla scelta "resetto" il campo
        if (k == "1") {
            campo = new Campo(8, 8, 10);
        }
        else if (k == "2") {
            campo = new Campo(16, 16, 40);
        }
        else if (k == "3") {
            campo = new Campo(16, 31, 99);
        }
        else if (k == "P") {
            // se l'utente resetta il campo è c'è l'opzione personalizzata selezionata
            // mi salvo i valori precedentemente inseriti
            let alt = $('#Maxh').val();
            let larg = $('#Maxw').val();
            let mine = $('#numBomb').val();
            // controllo che i valori esistano
            if (alt != "" && larg != "" && mine != "") {
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
                }
            }
            else{
                // altrimenti creo un campo di default "Principiante"
                campo = new Campo(8, 8, 10);
            }
            // alla fine nascondo il div per personalizzare
            $('#personalizza').css({display:'none'});
            $('#select').val('P');
        }
        // poi pulisco e rigenero il campo
        campo.clear();
        campo.generaCampo();
    });
});

let body = $("#body"); // div principale
// variabile booleana per evitare di poter aprire più di una volta il "popup" per scrivere una nuova nota
let createNewNote = false;

const note = $("#write-note"); // div dove andrà scritto il titolo e il testo della nuova nota
const deleteNote = $("#delete-note"); // div dove è contenuto il puslante per eliminare una nota
// pulsante salva per salvare la nota appena creata o per confermare le modifiche apportate ad una nota già esistente
const salvaButton = $("#saveBtn");
const eliminaButton = $("#deleteBtn"); // pulsante per eliminare la nota selezionata
const NoteTable = $("#note-table"); // tabella dove andranno inserite tutte le note
// variabile booleana per tenere sotto controllo quale nota si vuole eliminare quando viene premuto il pulsante
let notaDaEliminare = null;
// lista di oggetti per memorizzare tutte le note inserite dall'utente
let lista = new Lista();
let actualRowNumber = -1; // contatore per avere una tabella più ordinata e più facile da gestire

// funzione jquery che controlla tutto il programma all'avvio del documento (una volta che è stato caricato tutto)
$(document).ready(function () {

    // funzione controllata dalla finestra, che verrà eseguita appena prima di chiudere definitivamente la scheda nel browser
    $(window).on('beforeunload', function () {
        // salvo il vettore delle note
        localStorage.setItem('note', JSON.stringify(lista.note));
    });
    // vado a prendere dal precedente salvataggio le note salvate
    let savedNotes = localStorage.getItem('note');
    // se le note salvate esistono
    if (savedNotes) {
        // allora le riassegno correttamente alla lista
        ParsingList(savedNotes)
        // e disegno la tabella con le note recuperate dal salvataggio
        reDrawNotes();
    }

    function ParsingList(savedNotes) {
        // splitto inizialmente guardando la parentesi graffa chiusa così che ho già suddiviso nota per nota
        let splitted = savedNotes.split("}")
        splitted.splice(splitted.length - 1, 1); // rimuovo l'ultimo elemento perché è sicuramente una parentesi quadra
        // questo ciclo serve per poter assegnare all'interno della lista tutti gli attributi delle note
        for (let i = 0; i < splitted.length; i++) {
            // splitto per il carattere " così da avere tutti i campi separati
            let secondSplit = splitted[i].split("\"");
            // così posso andare a prelevare il titolo e il testo
            lista.addNota(secondSplit[3], secondSplit[7]);
            // e infine modifico la data di creazione con quella già salvata
            lista.getNota(i).setData(secondSplit[11]);
        }

        /*
            [{"title":"1234","text":"rt","creationData":"2023-9-13-22-22-24"},
                {"title":"6","text":"ty","creationData":"2023-9-13-22-22-31"}]

            [{"title":"1234","text":"rt","creationData":"2023-9-13-22-22-24",
                {"title":"6","text":"ty","creationData":"2023-9-13-22-22-31"]
            
            [{"title":"1234","text":"rt","creationData":"2023-9-13-22-22-24",
                {"title":"6","text":"ty","creationData":"2023-9-13-22-22-31"

            [{ - title - : - 1234 - , - text - : - rt - , - creationData - : - 2023-9-13-22-22-24
        */

    }

    // funzione per controllare se l'utente preme un qualsiasi tasto
    $(document).on("keydown", function (event) {
        // controllo se preme "Esc"
        if ((event.key === "Escape" || event.key === "Esc" || event.keyCode === 27)) {
            // se il div per scrivere una nota è visibile allora lo nascondo 
            if ($("#write-note").css("display") === "block") {
                note.css("display", "none");
                $("#div-add-note").css("cursor", "pointer");
                $("#div-add-note").attr('title', "Aggiungi una nota");
                createNewNote = false;
    
                let titolo = $("#title").val();
                let nota = lista.getNotaFromTitle(titolo);
                if (nota !== null && nota.getData() !== null) {
                    $("#title").prop("disabled", false); // disabilito la possibilità di poter interagire con l'input per l'utente
                    $("#title").val("");
                    $("#text").val("");
                    $("#title").css("cursor", "text");
                    $("#title").attr("title", "");
                }
            }
            // se invece è visibile il div per eliminare la nota nascondo quest'ultimo
            else if ($("#delete-note").css("display") === "block") {
                deleteNote.css("display", "none");
                createNewNote = false;
            }
        }
    });

    let defaultDiv = $("<div><br><br>+</div>"); // creo un div di default per pter aggiungere delle nuove note
    defaultDiv.attr('id', "div-add-note"); // gli assegno l'id corrispondente per poterlo gestire con il css
    defaultDiv.attr('title', "Aggiungi una nota"); // metto un "title" in modo tale che quando passi con il mouse sopra dice cosa fa
    defaultDiv.click(clickHandler.bind(this)); // gli assegno un evento quando viene cliccato l'oggetto, chiama la funzione "clickHandler"
    $("#addNote").append(defaultDiv); // aggiungo il div di default appena creato nel div principale della pagina

    salvaButton.click(SalvaNota.bind(this)); // assegno un evento al click sul pulsante salva
    eliminaButton.click(EliminaNota.bind(this)); // assegno un evento al click sul pulsante elimina

    function SalvaNota(event) {
        // evito il refresh della pagina
        event.preventDefault();
        // controllo se c'è già una schermata aperta, se sì non ne apro un'altra e ritorno
        if (!createNewNote) return;
        createNewNote = false; // modifico allora la variabile booleana per la prossima volta

        let titolo = $("#title").val(); // memorizzo il titolo (se presente)
        let testo = $("#text").val(); // memorizzo il testo della nota (se presente)
        if (lista.titleAlreadyExist(titolo)) {
            alert("Impossibile creare una nota con un titolo già esistente.")
            // allora nascondo il tutto
            note.css("display", "none");
            $("#div-add-note").css("cursor", "pointer");
            $("#div-add-note").attr('title', "Aggiungi una nota");
            $("#title").val("");
            $("#text").val("");
            return;
        }
        let nota = lista.getNotaFromTitle(titolo); // infine vado a prelevare la nota dalla lista filtrando per il titolo ottenuto
        // se la nota esiste
        if (nota !== null) {
            // la nota è già stata creata
            lista.modifyNota(nota.getData(), testo);
            // allora nascondo il tutto
            note.css("display", "none");
            $("#div-add-note").css("cursor", "pointer");
            $("#div-add-note").attr('title', "Aggiungi una nota");
            $("#title").val("");
            $("#text").val("");
            $("#title").prop("disabled", false); // disabilito la possibilità di poter interagire con l'input per l'utente
            $("#title").css("cursor", "text");
            $("#title").attr("title", "");
            return;
        }
        // se non è stato inserito nessun titolo non salvo nessuna nota
        if (titolo == "") {
            note.css("display", "none");
            $("#div-add-note").css("cursor", "pointer");
            $("#div-add-note").attr('title', "Aggiungi una nota");
            return;
        }
        // inizio a creare una nuova riga 
        let newRow
        // poi istanzio una nuova cella contenente il titolo della nota appena creata
        let newCol = $("<td>" + titolo + "</td>")
        // controllo se sto uscendo fuori dai margini predefiniti della tabella
        if (lista.note.length == 0 || lista.note.length % 4 == 0) {
            // se sto uscendo allora creo una nuova riga con l'id apposito
            newRow = $("<tr id=note-number-" + lista.note.length / 4 + ">")
            newRow.append(newCol) // poi inserisco la cella nuova nella riga appena creata
            actualRowNumber++; // incremento il contatore della riga attuale creata
            NoteTable.append(newRow); // infine aggiungo la nuova riga alla tabella delle note
        }
        // se c'è ancora spazio nella riga
        else {
            // allora vado a prendere la riga attuale
            let actualRow = $("#note-number-" + actualRowNumber)
            actualRow.append(newCol); // e ci aggiungo la cella nuova
        }
        // successivamente assegno un evento al tasto destro del mouse per poter eliminare una nota
        newCol.contextmenu(rightClick.bind(this));
        newCol.click(clickedNote.bind(this)); // aggiungo anche un evento al tasto sinistro per poter modificare la note
        lista.addNota(titolo, testo); // infine aggiungo la nota appena creata alla lista generale

        $("#div-add-note").css("cursor", "pointer"); // poi faccio ritornare il cursore come prima per poter aggiungere una nota
        $("#div-add-note").attr('title', "Aggiungi una nota"); // e rimodifico anche il "title"

        $("#title").val(""); // svuoto i campi title e text per un'eventuale prossima nuova nota
        $("#text").val("");
        note.css("display", "none"); // infine nascondo il blocco per scrivere la nota
    }
    // funziona per controllare la pressione del tasto destro del mouse
    function rightClick (event) {
        // evito il refresh della pagina
        event.preventDefault();
        notaDaEliminare = $(event.target) // salvo la nota selezionata con il tasto destro
        deleteNote.show(); // e mostro il pulsante per eliminare la nota
    }
    // funzione per eliminare la nota definitivamente
    function EliminaNota(event) {
        event.preventDefault(); // evito il refresh della pagina
        // se la nota da eliminare esiste, quindi significa che è stata selezionata precedentemente
        if (notaDaEliminare !== null) {
            // allora mi salvo la nota
            let notaTmp = lista.getNotaFromTitle(notaDaEliminare.text());
            lista.deleteNote(notaTmp); // la elimino dalla lista
            reDrawNotes(); // e ridisegno la tabella senza la nota eliminata e modifico gli id
        }
        deleteNote.css("display", "none"); // infine nascondo il pulsante per eliminare la nota
    }

    // funzione per controllare la nota cliccata e poterla modificare eventualmente
    function clickedNote(event) {
        event.preventDefault() // evito il refresh della pagina
        createNewNote = true; // modifico la variabile per indicare che il blocco è visibile
        let selectedNota = $(event.target) // salvo la nota cliccata
        note.show(); // rendo effettivamente visibile il blocco

        $("#title").val(selectedNota.text());
        $("#title").prop("disabled", true); // disabilito la possibilità di poter interagire con l'input per l'utente
        $("#title").css("cursor", "not-allowed");
        $("#title").attr("title", "impossibile cambiare il titolo alla nota già creata");
        let testo = lista.getNotaFromTitle(selectedNota.text()).getText();
        $("#text").val(testo);

        $("#div-add-note").css("cursor", "default");
        $("#div-add-note").attr('title', "");
    }

    // funzione gestita dall'evento "click" del div di default per aggiungere una nuova nota
    function clickHandler(event) {
        event.preventDefault(); // evito il refresh della pagina

        if (createNewNote) return;
        createNewNote = true;
        note.show();

        $("#div-add-note").css("cursor", "default");
        $("#div-add-note").attr('title', "");
    }

    function reDrawNotes() {
        NoteTable.html("");
        let cnt = 0;
        // e ora ridisegno tutte le note per riavere gli "id" ordinati
        for (let i = 0; i < lista.note.length; i++) {
            let newRow;
            let newCol = $("<td>" + lista.getNota(i).title + "</td>");
            if (i == 0 || (i % 4) == 0) {
                newRow = $("<tr id=note-number-" + cnt + ">")
                newRow.append(newCol)
                cnt++;
                NoteTable.append(newRow);
            }
            else {
                let actualRow = $("#note-number-" + (cnt - 1))
                actualRow.append(newCol);
            }
            newCol.contextmenu(rightClick.bind(this));
            newCol.click(clickedNote.bind(this));
        }
        actualRowNumber = cnt - 1;
    }
        
});

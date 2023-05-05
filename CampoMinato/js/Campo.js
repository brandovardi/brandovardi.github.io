class Campo {

    // costruttore
    constructor(alt, larg, bombe) {
        // attributi
        this.height = alt;
        this.width = larg;
        this.gameover = false;
        this.bombe = bombe;
        this.win = false;
        this.board = [];
        this.flags = 0;
    }

    // metodo per pulire lo schermo togliendo il campo
    clear() {
        $("#campo_minato").html("");
    }

    // metodo per generare il campo
    generaCampo() {
        // crea la griglia di gioco
        // mi salvo il "div" campo_minato per utilizzarlo dopo
        let campo_minato = $("#campo_minato");
        // modifico il testo delle mine restanti
        $('#numeroMine').text("Mine Restanti: " + this.bombe);
        // ciclo for per generare il campo
        for (let i = 0; i < this.height; i++) {
            // il primo ciclo controlla le righe
            // creo un div che sarà la riga
            let row = $("<div>");
            // il secondo ciclo controllerà ogni colonna presente per ciascuna riga
            for (let j = 0; j < this.width; j++) {
                // creo la colonna numero "j" per la riga "i"
                let cella = $("<div>");
                // aggiungo una classe "cell" al div per controllarlo successivamente
                cella.addClass("cell");
                // aggiungo un attributo di tipo "data-row" per sapere in quale riga si trova
                cella.attr("data-row", i);
                // aggiungo un attributo di tipo "data-col" per sapere in quale colonna si trova
                cella.attr("data-col", j);
                // aggiungo un evento al div, ovvero quando viene cliccato con il tasto sinistro eseguirà l'evento "clickHandler" (una funzione della classe Campo)
                cella.click(this.clickHandler.bind(this));
                // aggiungo anche un evento per il tasto sinistro
                //(utilizzo "contextmenu" per fare in modo che quando l'utente preme il tasto sinistro del mouse non esce il menù solito)
                // e quando premerà tasto destro su una cella allora verrà eseguito l'evento "flagHandler"
                cella.contextmenu(this.flagHandler.bind(this));
                // aggiungo alla riga la colonna appena creata
                row.append(cella);
                // inoltre aggiorno la board della classe aggiungendoci una cella di default
                this.board.push({ row: i, col: j, bomb: false, clicked: false, flag: false, count: 0 });
            }
            // infine aggiungo in fondo al campo_minato la riga appena creata
            campo_minato.append(row);
        }
        // genero le mine casualmente
        this.mineRandom();
        // conto le mine attorno ad ogni casella
        this.contaMine();
    }

    // metodo (evento) che controlla quando l'utente preme il tasto destro
    flagHandler(event) {
        // evito il refresh della pagina
        event.preventDefault();
        // se l'utente ha già vinto o perso non faccio niente
        if (this.gameover || this.win) return;
        // mi salvo la cella che è stata cliccata utilizzanto event prendendo il "target"
        let cell = $(event.target);
        // mi salvo la riga della cella cliccata prendendo l'attributo "data-row"
        let row = parseInt(cell.attr("data-row"));
        // mi salvo la colonna della cella cliccata prendendo l'attributo "data-col"
        let col = parseInt(cell.attr("data-col"));
        // mi salvo la cella appena cliccata andando a prendere appunto l'oggetto cella
        let c1 = this.getCella(row, col);
        // se la cella è già stata cliccata quindi è già stata scoperta allora non faccio niente
        if (c1.clicked) return;
        // se la cella non ha ancora la bandierina e il numero di bandierine messe dall'utente fino a questo momento è minore del numero di bombe
        // allora posso mettere una bandierina
        if (!c1.flag && this.flags < this.bombe) {
            // modifico l'attributo della cella in modo tale che la flag sia attiva
            c1.flag = true;
            // aggiungo la classe alla cella
            cell.addClass("flag");
            // aggiorno il numero di bandierine inserite dall'utente
            this.flags++;
            // faccio un calcolo per ricavare quante bombe mancano da "coprire" con la bandierina
            let x = this.bombe - this.flags;
            // e aggiorno a schermo il numero delle mine restanti
            $('#numeroMine').text("Mine Restanti: " + x);
        }
        // se la cella cliccata non ha la bandierina e il numero delle bandierine inserite dall'utente ha raggiunto il numero delle bombe presenti nel campo
        // allora non faccio niente
        else if (!c1.flag && this.flags == this.bombe) {
            return;
        }
        // se invece la cella ha già la bandierina la tolgo
        else {
            // aggiorno l'attributo della cella
            c1.flag = false;
            // tolgo la classe
            cell.removeClass("flag");
            // aggiorno il numero di bandierine inserite dall'utente
            this.flags--;
            // calcolo per ricavare le mine restanti
            let x = this.bombe - this.flags;
            // aggiorno a schermo il numero delle mine restanti
            $('#numeroMine').text("Mine Restanti: " + x);
        }
    }

    // metodo per controllare la vittoria
    checkWin() {
        // ciclo per controllare tutto il campo
        for (let i = 0; i < this.board.length; i++) {
            let cell = this.board[i];
            // se c'è una cella che allo stesso tempo non ha la bomba e non è stata cliccata allora non ha vinto
            if (!cell.bomb && !cell.clicked) {
                return false;
            }
        }
        // se esce dal ciclo significa che ha scoperto tutte le caselle senza bomba
        return true;
    }

    // metodo per controllare l'evento del tasto sinistro del mouse
    clickHandler(event) {
        // se l'utente ha già vinto o perso non faccio niente 
        if (this.gameover || this.win) {
            return;
        }
        // evito che la pagina si ricarichi
        event.preventDefault();
        // mi salvo la cella che è stata cliccata (ovvero la cella che ha richiamato l'evento)
        let cell = $(event.target);
        // mi salvo la riga della cella
        let row = parseInt(cell.attr("data-row"));
        // mi salvo la colonna della cella
        let col = parseInt(cell.attr("data-col"));
        // mi salvo l'oggetto della cella cliccata
        let c1 = this.getCella(row, col);
        // se la cella è già stata cliccata
        if (c1.clicked) {
            // controllo se nella cella è presente un numero di mine diverso da zero
            // e con il metodo "controllaBandierine" vado a controllare se il numero delle bandierine inserite dall'utente attorno alla cella cliccata...
            // ...è uguale al numero di bombe che ha attorno
            if (c1.count != 0 && c1.count == this.controllaBandierine(row, col)) {
                // se la condizione è vera allora libererà tutte le celle coperte senza bandierina attorno alla cella cliccata...
                // ...(con eventuale espansione nel caso di una cella vuota)
                this.liberaCelle(row, col);
            }
        }
        // se la cella cliccata ha una bandierina allora non faccio niente
        if (c1.flag) return;
        // se la cella cliccata ha una bomba
        if (c1.bomb) {
            // allora modifico l'attributo clicked
            c1.clicked = true;
            // aggiungo la classe clicked (per una modifica con il css)
            cell.addClass("clicked");
            // e mostro tutte le bombe presenti nel campo (siccome ha perso avendo cliccato la bomba)
            this.showBombs();
            // gameover diventa vero
            this.gameover = true;
            // faccio vedere una scritta sotto la board
            $('#end').show();
            $('#end').text("Hai Perso!");
        } else {
            // se invece la cella cliccata non ha la bomba
            // aggiorno l'attributo clicked
            c1.clicked = true;
            // aggiungo la classe clicked
            cell.addClass("clicked");
            // se il contatore della cella è uguale a zero significa che ha cliccato una cella senza mine attorno
            if (c1.count == 0) {
                // quindi eseguo il metodo per liberare tutte le celle adiacenti vuote finché non trovo celle con bombe adiacenti
                this.clickEmptyCells(row, col);
            } else {
                // altrimenti se ha delle mine attorno aggiorno la classe indicando appunto quante mine ha attorno
                cell.addClass("count-" + c1.count);
            }
            // controllo sempre se ha vinto (solo se non becca una bomba)
            if (this.checkWin()) {
                // aggiorno l'attributo win
                this.win = true;
                // e faccio uscire una scritta per far vedere che vinto
                $('#end').show();
                $('#end').text("Hai Vinto!");
            }
        }
    }

    // metodo che ritorna il numero delle bandierine attorno ad una cella
    controllaBandierine(r, c) {
        // inizializzo il contatore delle bandierine
        let count = 0;
        // vado a prendere la cella da controllare salvandomela
        let cell = this.getCella(r, c);
        // ciclo per controllare le caselle attorno alla cella cliccata
        for (let j = -1; j <= 1; j++) { // il primo ciclo controlla le righe
            for (let k = -1; k <= 1; k++) { // il secondo ciclo controlla le celle della riga
                // vado a prendere la cella adiacente alla riga "cell.row + j" e colonna "cell.col + k"
                let row = cell.row + j;
                let col = cell.col + k;
                // controllo che la riga e colonna non siano minori di zero e che non superino le dimensioni massime del campo
                if (row < 0 || row >= this.height || col < 0 || col >= this.width) continue;
                // mi salvo la cella adiacente
                let adjacent = this.getCella(row, col);
                // se la cella adiacente non è ancora stata cliccata e ha la flag aggiorno il contatore
                if (!adjacent.clicked && adjacent.flag) count++;
            }
        }
        // ritorno il valore del contatore delle flags
        return count;
    }

    // metodo per scoprire le celle coperte senza bandierina attorno ad una cella con un contatore, cliccata
    liberaCelle(r, c) {
        // mi salvo la cella cliccata
        let cell = this.getCella(r, c);
        // ciclo per controllare le righe
        for (let j = -1; j <= 1; j++) {
            // ciclo per controllare le cella all'interno della riga
            for (let k = -1; k <= 1; k++) {
                // salvo riga e colonna
                let row = cell.row + j;
                let col = cell.col + k;
                // controllo che non sia una cella fuori dal campo, se esce dal campo allora passo al giro successivo
                if (row < 0 || row >= this.height || col < 0 || col >= this.width) continue;
                // misalvo la cella adiacente appena trovata
                let adjacent = this.getCella(row, col);
                // se la cella adiacente non ha la bandiera e ha la bomba allora ha perso
                if (!adjacent.flag && adjacent.bomb) {
                    // mostro tutte le mine
                    this.showBombs();
                    // aggiorno l'attributo gameover
                    this.gameover = true;
                    // e faccio vedere una scritta sotto al campo
                    $('#end').show();
                    $('#end').text("Hai Perso!");
                }
                // se la cella adiacente non ha la bandierina allora la scopro
                if (!adjacent.flag) {
                    // prendo l'elemento "cell" in base alla riga e colonna
                    let elem = this.getCellElement(row, col);
                    // e mi salvo anche l'oggetto cella per poter controllare gli attributi
                    let c1 = this.getCella(row, col);
                    // indico che la cella è stata cliccata
                    c1.clicked = true;
                    // aggiungo una classe all'elemento per fare in modo che sia cliccata
                    elem.addClass("clicked");
                    // controllo se il contatore della cella è uguale a zero
                    if (c1.count == 0) {
                        // se è zero la cella è vuota e allora eseguo la funzione apposita per liberare le celle adiacenti senza bombe
                        this.clickEmptyCells(row, col);
                    } else {
                        // altrimenti aggiungo la classe per sapere quante mine ha attorno
                        elem.addClass("count-" + c1.count);
                    }
                }
            }
        }
    }

    // metodo che fa vedere tutte le bombe se l'utente perde
    showBombs() {
        // ciclo per controllare tutto il campo
        for (let i = 0; i < this.board.length; i++) {
            // mi salvo la cella corrente
            let cell = this.board[i];
            // se la cella contiente una bomba
            if (cell.bomb) {
                // mi salvo l'elemento cella
                let c = this.getCellElement(cell.row, cell.col);
                // e aggiungo la classe "bomb" per renderla visibile usando il css
                c.addClass("bomb");
            }
        }
    }

    // metodo che ritorna l'elemento cella utilizzando jquery
    getCellElement(row, col) {
        // prendo l'elemento con gli attributi partendo dalla classe
        return $(".cell[data-row=" + row + "][data-col=" + col + "]");
    }

    // metodo che libera le celle attorno ad una cella vuota
    clickEmptyCells(row, col) {
        for (let j = -1; j <= 1; j++) {
            for (let k = -1; k <= 1; k++) {
                let rAdiac = row + j;
                let cAdiac = col + k;
                if (rAdiac < 0 || rAdiac >= this.height || cAdiac < 0 || cAdiac >= this.width) continue;
                let cellAdiac = this.getCella(rAdiac, cAdiac);
                if (cellAdiac.bomb || cellAdiac.clicked || cellAdiac.flag) continue;
                cellAdiac.clicked = true;
                let elementoCellaAdiac = this.getCellElement(rAdiac, cAdiac);
                elementoCellaAdiac.addClass("clicked");
                if (cellAdiac.count == 0) {
                    this.clickEmptyCells(rAdiac, cAdiac);
                } else {
                    elementoCellaAdiac.addClass("count-" + cellAdiac.count);
                }
            }
        }
    }

    // metodo per contare le mine attorno ad ogni singola cella
    contaMine() {
        // conta le mine nelle celle adiacenti
        for (let i = 0; i < this.board.length; i++) {
            let cell = this.board[i];
            if (cell.bomb) continue;
            let count = 0;
            for (let j = -1; j <= 1; j++) {
                for (let k = -1; k <= 1; k++) {
                    let row = cell.row + j;
                    let col = cell.col + k;
                    if (row < 0 || row >= this.height || col < 0 || col >= this.width) continue;
                    let adjacent = this.getCella(row, col);
                    if (adjacent.bomb) count++;
                }
            }
            cell.count = count;
        }
    }

    // metodo per generare casualmente le mine nel campo
    mineRandom() {
        // posiziona le mine
        for (let i = 0; i < this.bombe; i++) {
            // prendo una cella casuale dal campo
            let cella = this.getRandomCell();
            // se la cella non ha la bomba allora la piazzo (per fare in modo che tutte le mine vengano piazzate)
            if (!cella.bomb) cella.bomb = true;
            // altrimenti ricerco un'altra casella dove piazzare la mina
            else --i;
        }
    }

    // ritorna una cella casuale
    getRandomCell() {
        // uso la classe Math per generare un numero casuale da 0 alla grandezza del campo
        let k = Math.floor(Math.random() * this.board.length);
        // e ritorno la cella alla posizione appena generata casualmente
        return this.board[k];
    }

    // metodo che ritorna i dati di una cella in base alla riga e colonna che vogliamo
    getCella(r, c) {
        // ciclo per cercare la cella nel campo
        for (let i = 0; i < this.board.length; i++) {
            // mi salvo la cella corrente
            let cell = this.board[i];
            // se la riga e la colonna della cella corrente sono uguali a quelli passati per parametro tirorno la cella
            if (cell.row == r && cell.col == c) return cell;
        }
        // se esce dal ciclo non ha trovato la cella e ritorno null
        return null;
    }
}

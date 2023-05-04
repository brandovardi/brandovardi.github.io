class Campo {

    constructor(alt, larg, bombe) {
        this.height = alt;
        this.width = larg;
        this.gameover = false;
        this.bombe = bombe;
        this.win = false;
        this.board = [];
        this.flags = 0;
    }

    clear() {
        $("#campo_minato").html("");
    }

    generaCampo() {
        // crea la griglia di gioco
        let campo_minato = $("#campo_minato");
        $('#numeroMine').text("Mine Restanti: " + this.bombe);
        for (let i = 0; i < this.height; i++) {
            let row = $("<div>");
            for (let j = 0; j < this.width; j++) {
                let cella = $("<div>");
                cella.addClass("cell");
                cella.attr("data-row", i);
                cella.attr("data-col", j);
                cella.click(this.clickHandler.bind(this));
                cella.contextmenu(this.flagHandler.bind(this));
                row.append(cella);
                this.board.push({ row: i, col: j, bomb: false, clicked: false, flag: false, count: 0 });
            }
            campo_minato.append(row);
        }
        this.mineRandom();
        this.contaMine();
    }

    flagHandler(event) {
        if (this.gameover || this.win) return;
        event.preventDefault();
        let cell = $(event.target);
        let row = parseInt(cell.attr("data-row"));
        let col = parseInt(cell.attr("data-col"));
        let c1 = this.getCella(row, col);
        if (c1.clicked) return;
        if (!c1.flag && this.flags < this.bombe) {
            c1.flag = true;
            cell.addClass("flag");
            this.flags++;
            let x = this.bombe - this.flags;
            $('#numeroMine').text("Mine Restanti: " + x);
        } else {
            c1.flag = false;
            cell.removeClass("flag");
        }
    }

    checkWin() {
        for (let i = 0; i < this.board.length; i++) {
            let cell = this.board[i];
            if (!cell.bomb && !cell.clicked) {
                return false;
            }
        }
        return true;
    }

    clickHandler(event) {
        if (this.gameover || this.win) {
            return;
        }
        // evito che la pagina si ricarichi
        event.preventDefault();
        let cell = $(event.target);
        let row = parseInt(cell.attr("data-row"));
        let col = parseInt(cell.attr("data-col"));
        let c1 = this.getCella(row, col);
        if (c1.clicked) {
            if (c1.count != 0 && c1.count == this.controllaBandierine(row, col)) {
                this.liberaCelle(row, col);
            }
        }
        if (c1.flag) return;
        if (c1.bomb) {
            c1.clicked = true;
            cell.addClass("clicked");
            this.showBombs();
            this.gameover = true;
            $('#end').show();
            $('#end').text("Hai Perso!");
        } else {
            c1.clicked = true;
            cell.addClass("clicked");
            if (c1.count == 0) {
                this.clickEmptyCells(row, col);
            } else {
                cell.addClass("count-" + c1.count);
            }
            if (this.checkWin()) {
                this.win = true;
                $('#end').show();
                $('#end').text("Hai Vinto!");
            }
        }
    }

    controllaBandierine(r, c) {
        let count = 0;
        let cell = this.getCella(r, c);
        for (let j = -1; j <= 1; j++) {
            for (let k = -1; k <= 1; k++) {
                let row = cell.row + j;
                let col = cell.col + k;
                if (row < 0 || row >= this.height || col < 0 || col >= this.width) continue;
                let adjacent = this.getCella(row, col);
                if (!adjacent.clicked && adjacent.flag) count++;
            }
        }
        return count;
    }

    liberaCelle(r, c) {
        let cell = this.getCella(r, c);
        for (let j = -1; j <= 1; j++) {
            for (let k = -1; k <= 1; k++) {
                let row = cell.row + j;
                let col = cell.col + k;
                if (row < 0 || row >= this.height || col < 0 || col >= this.width) continue;
                let adjacent = this.getCella(row, col);
                if (!adjacent.flag && adjacent.bomb) {
                    this.showBombs();
                    this.gameover = true;
                    $('#end').show();
                    $('#end').text("Hai Perso!");
                }
                if (!adjacent.flag) {
                    let elem = this.getCellElement(row, col);
                    let c1 = this.getCella(row, col);
                    c1.clicked = true;
                    elem.addClass("clicked");
                    if (c1.count == 0) {
                        this.clickEmptyCells(row, col);
                    } else {
                        elem.addClass("count-" + c1.count);
                    }
                }
            }
        }
    }

    showBombs() {
        for (let i = 0; i < this.board.length; i++) {
            let cell = this.board[i];
            if (cell.bomb) {
                let c = this.getCellElement(cell.row, cell.col);
                c.addClass("bomb");
            }
        }
    }

    getCellElement(row, col) {
        return $(".cell[data-row=" + row + "][data-col=" + col + "]");
    }

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
                    // elementoCellaAdiac.text(cellAdiac.count);
                    elementoCellaAdiac.addClass("count-" + cellAdiac.count);
                }
            }
        }
    }

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

    mineRandom() {
        // posiziona le mine
        for (let i = 0; i < this.bombe; i++) {
            let cella = this.getRandomCell();
            if (!cella.bomb) cella.bomb = true;
            else --i;
        }
    }

    // ritorna una cella casuale
    getRandomCell() {
        let k = Math.floor(Math.random() * this.board.length);
        return this.board[k];
    }

    // metodo che ritorna i dati di una cella in base alla riga e colonna che vogliamo
    getCella(r, c) {
        for (let i = 0; i < this.board.length; i++) {
            let cell = this.board[i];
            if (cell.row == r && cell.col == c) return cell;
        }
        return null;
    }



}

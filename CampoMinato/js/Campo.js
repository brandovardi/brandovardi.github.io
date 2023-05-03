class Campo {

    constructor(dim, bombe) {
        this.size = dim;
        this.gameover = false;
        this.bombe = bombe;
        this.win = false;
        this.board = [];
    }

    generaCampo() {
        // crea la griglia di gioco
        let campo_minato = $("#campo_minato");
        for (let i = 0; i < this.size; i++) {
            let row = $("<div>");
            for (let j = 0; j < this.size; j++) {
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
        event.preventDefault();
        let cell = $(event.target);
        let row = parseInt(cell.attr("data-row"));
        let col = parseInt(cell.attr("data-col"));
        let c1 = this.getCella(row, col);
        if (c1.clicked) return;
        if (!c1.flag) {
            c1.flag = true;
            cell.addClass("flag");
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
                if (row < 0 || row >= this.size || col < 0 || col >= this.size) continue;
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
                if (row < 0 || row >= this.size || col < 0 || col >= this.size) continue;
                let adjacent = this.getCella(row, col);
                if (!adjacent.flag && adjacent.bomb) {
                    this.showBombs();
                    this.gameover = true;
                    $('#end').show();
                    $('#end').text("Hai Perso!");
                }
                if (!adjacent.flag) {
                    let elem = this.getCellElement(row, col);
                    elem.addClass("clicked");
                    elem.addClass("count-" + adjacent.count);
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
                if (rAdiac < 0 || rAdiac >= this.size || cAdiac < 0 || cAdiac >= this.size) continue;
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
                    if (row < 0 || row >= this.size || col < 0 || col >= this.size) continue;
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

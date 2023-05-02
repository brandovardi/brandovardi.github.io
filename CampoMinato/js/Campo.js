class Campo {

    constructor(dim, bomb) {
        this.dim = dim;
        this.bombe = bomb;
        this.open = 0;
        this.board = [];
    }

    piazzaBombe() {
        let c = 0;

        while (c < this.bombe) {

            let pr = Math.round((this.dim - 1) * Math.random());
            let pc = Math.round((this.dim - 1) * Math.random());

            if (!this.board[pr][pc].mina) {

                this.board[pr][pc].mina = true;

                for (let i = -1; i <= 1; i++)
                    for (let j = -1; j <= 1; j++) {
                        let dr = pr + i;
                        let dc = pc + j;
                        if (dr >= 0 && dc >= 0 && dr < this.dim && dc < this.dim) {
                            this.board[dr][dc].cont++;
                        }
                    }
                c++;
            }
        }
    }

    generaCampo(x) {
        $('#campo').empty();
        $('#nBombe').text("Numero Bombe: " + this.bombe);
        //crea la tabella
        
        if (x[0] == "P") {
            $('#campo').css("width", "550px");
            $('#campo').css("height", $('#campo').width() + "px");
        }
        else if (x[0] == "I") {
            $('#campo').css("width", "700px");
            $('#campo').css("height", $('#campo').width() + "px");
        }
        else if (x[0] == "A") {
            $('#campo').css("width", "850px");
            $('#campo').css("height", $('#campo').width() + "px");
        }


        for (let r = 0; r < this.dim; r++) {
            this.board[r] = [];
            for (let c = 0; c < this.dim; c++) {
                this.board[r][c] = new Cella();
                $('#campo').append('<div class="cella" data-row="' + r + '" data-col="' + c + '">&nbsp;</div>');
            }
        }
    }

    check(row, col) {

        if (this.board[row][col].aperta)
            return true;

        this.board[row][col].aperta = true;
        this.open++;

        $('.cella[data-row=' + row + '][data-col=' + col + ']').html(this.board[row][col].cont ? this.board[row][col].cont : "&nbsp;");
        $('.cella[data-row=' + row + '][data-col=' + col + ']').addClass("aperta");

        if (!this.board[row][col].mina && !this.board[row][col].cont) {
            for (var dr = row - 1; dr <= row + 1; dr++)
                for (var dc = col - 1; dc <= col + 1; dc++)
                    if (dc >= 0 && dr >= 0 && dc < this.dim && dr < this.dim)
                        this.check(dr, dc);
        } else if (this.board[row][col].mina) {
            // qui mettiamo la mina
            $('.cella[data-row=' + row + '][data-col=' + col + ']').html('<i class="fa fa-bomb"></i>');
            $('.cella[data-row=' + row + '][data-col=' + col + ']').addClass("mina");
            return false;
        }
        return true;
    }
    
    scopriMine() {
        for (let x = 0; x < this.dim; x++)
            for (let y = 0; y < this.dim; y++)
                if (this.board[x][y].mina) {
                    this.board[x][y].aperta = true;
                    $('.cella[data-row=' + x + '][data-col=' + y + ']').html('<i class="fa fa-bomb">*</i>');
                    $('.cella[data-row=' + x + '][data-col=' + y + ']').addClass("mina");
                }
    }

}
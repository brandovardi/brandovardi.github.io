class Lista {
    // costruttore di default
    constructor() {
        this.eventi = new Array(0);
        this.length = 0;
        this.table = new Array(0);
    }
    // metodo per aggiungere un evento alla lista
    add() {
        // mi salvo i due input richiesti
        let data = document.getElementById('data').value;
        let impegno = document.getElementById('impegno').value;
        // e controllo se sono stati inseriti
        if (data === "" || impegno === "") {
            alert("Inserire i dati richiesti!");
            return;
        }
        else {
            let Imp = new Evento(impegno, data, false);
            this.eventi.push(Imp);
            this.addImpegno(this.eventi.length);
        }
    }

    addImpegno(ind) {
        let x = "<tr id='" + (ind - 1) + "'><td align='center' style='width: 5%;'><input type='checkbox'></td><td> " + this.eventi[ind - 1].impegno + "</td><td align='right'><input type='button' onclick='l1.elimina(" + (ind - 1) + ")' value='Del'></td></tr>";
        document.getElementById('impegni').innerHTML += x;
        this.table.push(x);
    }

    elimina(ind) {
        this.eventi.splice(ind, 1);
        this.table.splice(ind, 1);
        this.drawTable();
    }

    drawTable() {
        let k = document.getElementById('impegni');
        k.innerHTML = "";
        for (let i = 0; i < this.table.length; i++) {
            k.innerHTML += this.table[i];
        }
    }

}

class Evento {

    constructor(impegno, scadenza, completato) {
        this.impegno = impegno;
        this.scadenza = scadenza;
        this.completato = completato;
    }

}

const l1 = new Lista();
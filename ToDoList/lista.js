class Lista {
    // costruttore di default
    constructor() {
        this.eventi = new Array(0);
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
        let x = "<tr id='" + (ind - 1) + "'><td align='center' style='width: 5%;'><input type='checkbox' id='" + ind + "'></td><td> " + this.eventi[ind - 1].impegno + "</td><td align='center'>" + this.eventi[ind - 1].scadenza + "</td><td align='right'><input type='button' onclick='l1.elimina(" + (ind - 1) + ")' value='Del'></td></tr>";
        document.getElementById('impegni').innerHTML += x;
        this.table.push(x);
    }

    elimina(ind) {
        this.eventi.splice(ind, 1);
        this.table.splice(ind, 1);
        this.pulisci();
        this.drawTable();
    }

    pulisci() {
        let lung = this.table.length;
        this.table = new Array(0);
        let impegni = $('#impegni');
        impegni.html("")
        for (let i = 0; i < lung; i++) {
            let x = "<tr id='" + i + "'><td align='center' style='width: 5%;'><input type='checkbox' id='" + i + "'></td><td> " + this.eventi[i].impegno + "</td><td align='center'>" + this.eventi[i].scadenza + "</td><td align='right'><input type='button' onclick='l1.elimina(" + i + ")' value='Del'></td></tr>";
            impegni.append(x);
            this.table.push(x);
        }
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

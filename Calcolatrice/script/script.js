// classe calcolatrice
class Calcolatrice {
    // unico costruttore di default
    constructor() {
        this.secondo = "";
        this.numCorr = "";
        this.operazione = ' ';
    }
    // metodo per aggiornare il numero inserito dall'utente sia nel display che nell'attributo
    numero(n) {
        this.numCorr += n;
        document.getElementById('text').value = this.numCorr;
    }
    // metodo per aggiornare il segno, ovvero l'operazione da effettuare
    segno(s) {
        this.operazione = s;
        this.secondo = this.numCorr;
        this.numCorr = "";
        document.getElementById('text').value = "";
    }
    // metodo per calcolare il risultato dell'operazione selezionata
    calcola(){
        let risultato = 0;
        if(this.operazione == '+') {
            risultato = parseInt(this.secondo) + parseInt(this.numCorr);
        }
        else if(this.operazione == '-') {
            risultato = parseInt(this.secondo) - parseInt(this.numCorr);
        }
        else if(this.operazione == 'x') {
            risultato = parseInt(this.secondo) * parseInt(this.numCorr);
        }
        else if(this.operazione == '÷') {
            risultato = parseInt(this.secondo) / parseInt(this.numCorr);
        }
        document.getElementById('text').value = risultato;
        this.secondo = "";
        this.numCorr = risultato;
    }
    // metodo per pulire lo schermo
    clear() {
        this.secondo = "";
        this.numCorr = "";
        this.operazione = "";
        document.getElementById('text').value = "";
    }

}

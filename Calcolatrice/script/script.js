// classe calcolatrice
class Calcolatrice{
    // unico costruttore di default
    constructor() {
        this.parziale = "";
        this.numCorrente = "";
        this.segno = ' ';
    }
    // metodo per aggiornare il numero inserito dall'utente sia nel display che nell'attributo
    aggiungiValore(n) {
        this.numCorrente += n;
        document.getElementById('text').value = this.numCorrente;
    }
    // metodo per aggiornare il segno, ovvero l'operazione da effettuare
    segnoCliccato(s) {
        this.segno = s;
        this.parziale = this.numCorrente;
        this.numCorrente = "";
        document.getElementById('text').value = "";
    }
    // metodo per calcolare il risultato dell'operazione selezionata
    calcola(){
        let risultato = 0;
        if(this.segno == '+') {
            risultato = parseInt(this.parziale) + parseInt(this.numCorrente);
        }
        else if(this.segno == '-') {
            risultato = parseInt(this.parziale) - parseInt(this.numCorrente);
        }
        else if(this.segno == 'x') {
            risultato = parseInt(this.parziale) * parseInt(this.numCorrente);
        }
        else if(this.segno == '÷') {
            risultato = parseInt(this.parziale) / parseInt(this.numCorrente);
        }
        document.getElementById('text').value = risultato;
        this.parziale = "";
        this.numCorrente = risultato;
    }
    // metodo per pulire lo schermo
    clear() {
        this.parziale = "";
        this.numCorrente = "";
        this.segno = "";
        document.getElementById('text').value = "";
    }

}
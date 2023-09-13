class Lista {

    constructor() {
        this.note = [];
    }

    addNota(titolo, testo)
    {
        if (typeof titolo !== "string" || typeof testo !== "string") return;
        
        let dataCorrente = new Date();

        let anno = dataCorrente.getFullYear();
        let mese = dataCorrente.getMonth() + 1; // Aggiungo 1 per ottenere il mese corretto
        let giorno = dataCorrente.getDate();
        let ora = dataCorrente.getHours();
        let minuti = dataCorrente.getMinutes();
        let secondi = dataCorrente.getSeconds();

        let dataFormattata = anno + "-" + mese + "-" + giorno + "-" + ora + "-" + minuti + "-" + secondi;

        let nota = new Nota(titolo, testo, dataFormattata);

        this.note.push(nota);
    }

    modifyNota(creationData, newText) {
        for (let i = 0; i < this.note.length; i++) {
            if (creationData === this.note[i].creationData) {
                this.note[i].text = newText
            }
        }
    }

    deleteNote(nota) {
        for (let i = 0; i < this.note.length; i++) {
            if (this.note[i].getData() == nota.getData()) {
                this.note.splice(i, 1);
                return;
            }
        }
    }

    getNotaFromTitle(title) {
        for (let i = 0; i < this.note.length; i++) {
            if (title === this.note[i].title)
            {
                return this.note[i];
            }
        }
        return null;
    }

    getNota(index) {
        return this.note[index];
    }

}

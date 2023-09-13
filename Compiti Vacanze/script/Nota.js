class Nota {
    constructor(title, text, data) {
        this.title = title;
        this.text = text;
        this.creationData = data; // string
    }

    getTitle() { return this.title; }
    getText() { return this.text; }
    getData() { return this.creationData; }
    setData(newData) { this.creationData = newData; } // solamente quando bisogna ricaricare i dati salvati
}
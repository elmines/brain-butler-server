class FormManager {
    constructor() {
        this.formQueue = [];
    }

    clear() {
        this.formQueue = [];
    }

    hasNext() {
        return this.formQueue.length > 0;
    }

    next() {
        if (this.formQueue.length < 1 ) return {fields: null};
        return this.formQueue.shift();
    }

    receiveForm(form) {
        this.formQueue.push(form);
    }
}

module.exports = FormManager;
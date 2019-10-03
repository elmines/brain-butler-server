
class FormManager {
    constructor(wss) {
        this.wss = wss;

        this.formQueue = [];

        wss.on("connection", ws => {

            ws.on("message", data => {
                data = JSON.parse(data);
                if (data.type && data.type === "form") this._receiveForm(data["form"]);
            });
        });


/*
        this.formQueue.push({
            title: "A Practice Form",
            categories: ["Choice", "Text"],
            fields: [
                {
                    exclusive: false,
                    name: "favoriteColor",
                    labels: ["Burgundy", "Teal", "Aqua"],
                    values: ["Red", "Green", "Blue"]
                },
                {
                    name: "favoriteFood",
                    label: "Favorite Food"                    
                }
            ]
        });

        this.formQueue.push({
            title: "Another practice form",
            categories: ["Text", "Choice"],
            fields: [
                {
                    name: "surname",
                    label: "Surname"
                },
                {
                    name: "hemisphere",
                    labels: ["Orient", "Occident"],
                    values: ["east", "west"],
                    exclusive: true,
                }
            ]
        });
        */
    }

    hasNext() {
        return this.formQueue.length > 0;
    }

    nextForm() {
        if (this.formQueue.length < 1 ) return {fields: null};
        return this.formQueue.shift();
    }

    _receiveForm(form) {
        this.formQueue.push(form);
    }
}

module.exports = FormManager;
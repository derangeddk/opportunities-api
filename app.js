const express = require("express");
const bodyParser = require("body-parser");

module.exports = (mailer) => {
    let app = express();

    let requestId = -1;

    app.use((req, res, next) => {
        req.requestId = ++requestId;
        console.log(`[request/${req.requestId}] ${new Date().toISOString()} ${req.method} ${req.path}`);
        next();
    });

    app.all("/interested-person", (req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
        next();
    });

    app.post("/interested-person", bodyParser.json(), (req, res) => {
        let name = req.body.name;
        let email = req.body.email;

        if(!name || name == "") {
            return res.status(400).send({
                error: "Invalid or missing name " + name
            });
        }
        if(!email || email == "" || email.indexOf("@") == -1) {
            return res.status(400).send({
                error: "Invalid or missing email " + email
            });
        }
        mailer.send({
            subject: "[opportunity] New interested person: " + name,
            text: `${name}\n${email}`,
            html: `<p>${name}<br>${email}</p>`
        }, {
            email: "opportunities@deranged.dk"
        }, (error) => {
            if(error) {
                console.error("Failed to send opportunity email: " + name + " <" + email + ">", error);
                return res.status(500).send({
                    error: "Failed to save request."
                });
            }
            return res.status(200).send({ success: "OK" });
        });
    });

    return app;
};

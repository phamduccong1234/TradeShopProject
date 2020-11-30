const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session)
const flash = require("req-flash")

const shareSession = session({
    secret: "tradeshop",
    store: new MongoStore({
        url: "mongodb://127.0.0.1:27017/TradeShop_session"
    })
})

app.use(shareSession)
app.use(flash({locals: 'flash' }))

require("../libs/mongo-db");
app.use(require("../apps/middlewares/share-data"));


app.use("/assets", express.static(path.join(__dirname, "..", "public")));

//Using body parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//Using template engine
app.set("views", path.join(__dirname, "..", "apps", "views"));
app.set("view engine", "ejs");

//app.use("/api", require("../routers/api"));
app.use("/", require("../routers/web"));

app.session = shareSession
app.use("*", function(req, res) {
    return res.render("404");
});

app.use((error, req, res, next) => {
    console.log("error", error);
    return res.render("404");
});
module.exports = app;
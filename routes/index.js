var express = require("express");
var router = express.Router();

const {
  models: { URL },
} = require("../database");

const shortid = require("shortid");
const { isUrlValid } = require("../helpers/functions");
const { BASE_URL } = require("../config");

/* GET home page. */
router.get("/", (req, res, next) => {
  res.render("index", { title: "Simple URL Shortener" });
});

/* POST create new shorten url */
router.post("/url", async (req, res, next) => {
  try {
    const { url } = req.body;
    const { ip } = req;
    const key = shortid.generate();

    if (isUrlValid(url)) {
      const urlData = {
        url,
        ip,
        key,
      };

      await URL.create(urlData);

      const shorten = BASE_URL + key;

      res.render("info", {
        url: shorten,
        title: "Your shorten URL is here",
      });
    } else {
      res.render("index", {
        title: "Your URL is not valid",
        description: "Please enter a valid URL for shorten",
      });
    }
  } catch (error) {
    console.log(error);
    res.render("index", {
      title: "An error occured :(",
      description: "Please try again later.",
    });
  }
});

/* GET Redirect to real url. */
router.get("/:key", async (req, res, next) => {
  const { key } = req.params;
  try {
    const url = await URL.findOne({ key });
    await URL.updateOne({ _id: url._id }, { opened: Number(url.opened) + 1 });

    res.writeHead(301, { Location: url.url });
    res.end();
  } catch (error) {
    res.render("index", {
      title: "There may be no such page",
      description: "The page you requested could not be reached",
    });
  }
});

module.exports = router;

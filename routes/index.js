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

/* POST create new short url */
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

      const short = BASE_URL + key;

      res.render("info", {
        url: short,
        title: "Your short URL is here",
      });
    } else {
      res.render("index", {
        title: "Your URL is not valid",
        description: "Please enter a valid URL to shorten",
      });
    }
  } catch (error) {
    res.render("index", {
      title: "An error occured :(",
      description: "Please try again later.",
    });
  }
});

/* GET clickmeter page. */
router.get("/clickmeter", (req, res, next) => {
  res.render("clickmeter", { title: "See number of clicks of your URL" });
});

/* POST get number of clicks */
router.post("/clickmeter", async (req, res, next) => {
  try {
    const { url } = req.body;

    const key = url.split("/").pop();
    const item = await URL.findOne({ key });

    if (item) {
      res.render("clickmeter", {
        title: item.opened + " times clicked",
        description: "Your URL: " + item.url,
      });
    } else {
      res.render("clickmeter", {
        title: "Your URL is not valid",
        description: "Please enter a valid URL",
      });
    }
  } catch (error) {
    res.render("clickmeter", {
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
    if (url) {
      await URL.updateOne({ _id: url._id }, { opened: Number(url.opened) + 1 });

      res.writeHead(301, { Location: url.url });
      res.end();
    } else {
      res.render("index", {
        title: "There may be no such a page",
        description: "The page you requested could not be reached",
      });
    }
  } catch (error) {
    res.render("index", {
      title: "There may be no such a page",
      description: "The page you requested could not be reached",
    });
  }
});

module.exports = router;

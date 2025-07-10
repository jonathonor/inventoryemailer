import { createRequire } from "module";
import { join, dirname } from "path";
import { JSONFilePreset } from "lowdb/node";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";

const require = createRequire(import.meta.url);

var config = process.env;
var schedule = require("node-schedule");

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, "db.json");
const defaultData = { inventory: [] };
const db = await JSONFilePreset("db.json", defaultData);

import { get3RiversInventory, get3RiversItemData } from "./shops/3rivers.js";
import {
  getBlackOvisInventory,
  getBlackOvisItemData,
} from "./shops/blackovis.js";
import { getGoHuntInventory, getGoHuntItemData } from "./shops/gohunt.js";
import {
  getLancasterInventory,
  getLancasterItemData,
} from "./shops/lancaster.js";
// import { getMidwayInventory, getMidwayItemData } from "./shops/midway.js";
import { getMikesInventory, getMikesItemData } from "./shops/mikes.js";
import { getPodiumInventory, getPodiumItemData } from "./shops/podium.js";
import { sendMonthlyEmail } from "./monthlyEmail.js";

db.data = db.data || [];

let getSectionHtml = (store, items) => {
  return `<main style="background-color: #fff;
  border-radius: 0 0 12px 12px;
  padding: 15px 15px 20px;
  display: grid;
  row-gap: 8px;">
  <div>${store}</div>
    ${getItemsHtml(items)}
  </main>`;
};

let getItemsHtml = (items) => {
  let html = "";
  for (const item of items) {
    html += ` <article style="display: grid;
    grid-template-columns: 1fr 3fr 1fr;
    align-items: center;
    padding: 10px 30px 10px 10px;
    overflow: hidden;
    border-radius: 10px;
    box-shadow: 0 5px 7px -1px rgba(51, 51, 51, 0.23);
    cursor: pointer;
    transition: transform .25s cubic-bezier(.7,.98,.86,.98), box-shadow .25s cubic-bezier(.7,.98,.86,.98);
    background-color: #fff;">
      <img src="${item.image}" alt="none" style="max-width: 100%;
      width: 60px;
      border-radius: 20%;
      box-shadow: 0 0 0 10px #ebeef3, 0 0 0 22px #f3f4f6;">
      
      ${getRow(item)}
    </article> `;
  }

  return html;
};

let getRow = (item) => {
  if (!Array.isArray(item.change)) {
    return `<span style="color: #979cb0;
      font-weight: 600;
      font-size: 18px;
      letter-spacing: 0.64px;
      margin-left: 32px;">${item.name}</span>
        <span style="color: #979cb0;
          font-weight: 700;
          font-size: 20px;
          text-align: right;">${item.inventory}
          <span style="color: ${isNegative(item.change) ? "red" : "green"};
          opacity: .8;
          font-weight: 600;
          font-size: 10px;
          margin-left: 3px;">
          ${isNegative(item.change) ? "" : "+"}${item.change}
          </span>
        </span>`;
  } else {
    console.log(item.change)
    return `<span style="color: #979cb0;
      font-weight: 600;
      font-size: 18px;
      letter-spacing: 0.64px;
      margin-left: 32px;">${item.name}</span>
        <span style="color: #979cb0;
          font-weight: 700;
          font-size: 20px;
          text-align: right;">${item.inventory}
            ${item.change.map((i) => {
              return `<span style="color: ${isNegative(i) ? "red" : "green"};
                  opacity: .8;
                  font-weight: 600;
                  font-size: 10px;
                  margin-left: 3px;">
                  ${isNegative(i) ? "" : "+"}${i}
                  </span>
                `;
    })}</span>`;
  }
};

let isNegative = (number) => {
  if (number < 1) {
    return true;
  } else {
    return false;
  }
};

let sendEmail = async () => {
  const transporter = nodemailer.createTransport({
    host: "smtp.titan.email",
    port: 587,
    auth: {
      user: process.env.titanEmail,
      pass: "/qb+am'Pe^h(Ff@",
    },
  });

  const html = `<article style="max-width: 490px; width: 100%; border-radius: 12px;">
  <header style="--start: 15%;
  height: 100px;
  background-image: repeating-radial-gradient(circle at var(--start), transparent 0%, transparent 10%, rgba(42, 45, 64, .33) 10%, rgba(42, 45, 64, .33) 17%), linear-gradient(to right, #2a2d40cc, #3659db);
  color: #fff;
  position: relative;
  border-radius: 12px 12px 0 0;
  overflow: hidden;">
    <h1 style="position: absolute;
    z-index: 2;
    top: 50%;
    right: calc(var(--start) * .75);
    transform: translateY(-50%);
    text-transform: uppercase;
    margin: 0;"><span style="font-size: 24px;
        font-weight: 700;
        letter-spacing: 6.5px;">Daily</span><span style="font-size: 13px;
        font-weight: 500;
        letter-spacing: 3.55px;
        opacity: .65;
        transform: translateY(-2px);">Inventory</span></h1>
  </header>
  ${getSectionHtml("goHunt", getGoHuntItemData(db))}
  ${getSectionHtml("Black Ovis", getBlackOvisItemData(db))}
  ${getSectionHtml("Lancaster", getLancasterItemData(db))}
  ${getSectionHtml("3Rivers", get3RiversItemData(db))}
  ${getSectionHtml("Podium", getPodiumItemData(db))}
  ${getSectionHtml("Mikes", getMikesItemData(db))}

</div>`;

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Daily Inventory 🏹" <info@modsaw.com>', // sender address
    to: "admin@modsaw.com", // list of receivers
    subject: "Inventory Data", // Subject line
    html: html, // html body
  });

  console.log("Message sent: %s", info.messageId);
};

// if you want to allow different servers to schedule different intervals replace this with
// https://github.com/kibertoad/toad-scheduler

// for testing (every minute) */1 * * * *
// for prod (every hour) 0 */1 * * *
// every day at 10am "0 15 * * *"
schedule.scheduleJob("0 15 1 * *", async () => {
  sendMonthlyEmail(db.data.inventory);
});
schedule.scheduleJob("0 15 * * *", async () => {
  let inventory = {
    "blackOvis-standard": "n/a",
    "blackOvis-deluxe": "n/a",
    "3Rivers-standard": "n/a",
    "3Rivers-deluxe": "n/a",
    "goHunt-standard": "n/a",
    "goHunt-deluxe": "n/a",
    "goHunt-lca-saw": "n/a",
    "lancaster-standard": "n/a",
    "lancaster-deluxe": "n/a",
    "lancaster-x-spot": "n/a",
    "lancaster-x-spot-mini": "n/a",
    "lancaster-lca-saw": "n/a",
    "lancaster-carbon-express": "n/a",
    "lancaster-lca-ez-green": "n/a",
    "lancaster-avalon-spinner": "n/a",
    "lancaster-pine-ridge-spinner": "n/a",
    "lancaster-lca-spin-square": "n/a",
    "lancaster-omp-spin-square": "n/a",
    "lancaster-g5-square": "n/a",
    "lancaster-bitz": "n/a",
    "lancaster-lca-scale": "n/a",
    "podium-carbon-express": "n/a",
    "podium-lca-saw": "n/a",
    "podium-square-up": "n/a",
    "podium-omp-spin-square": "n/a",
    "podium-g5-square": "n/a",
    "podium-modsaw-standard": "n/a",
    "podium-modsaw-deluxe": "n/a",
    "podium-lca-scale": "n/a",
    "mikes-deluxe": "n/a",
    "mikes-lca-ez-green": "n/a",
    "mikes-square-up": "n/a",
    "mikes-pine-ridge": "n/a",
    "mikes-g5": "n/a",
  };
  Promise.allSettled([
    getBlackOvisInventory("MODS0002-STD", db), //standard
    getBlackOvisInventory("MODS0001-DLX", db), //deluxe
    get3RiversInventory(898000), //standard
    get3RiversInventory(898001), //deluxe
    getGoHuntInventory(44680798601410, 7977543958722), //standard
    getGoHuntInventory(44899328688322, 8023016079554), //deluxe
    getGoHuntInventory(38027175559362, 6187186979010), //lca saw
    getLancasterInventory("modsaw-standard-arrow-saw-kit"),
    getLancasterInventory("modsaw-deluxe-arrow-saw-kit"),
    getLancasterInventory("x-spot-pro-arrow-saw"),
    getLancasterInventory("x-spot-mini-arrow-saw"),
    getLancasterInventory("last-chance-revolution-arrow-saw"),
    getLancasterInventory("carbon-express-arrow-saw"),
    getLancasterInventory("last-chance-ez-green-bow-press"),
    getLancasterInventory("avalon-arrow-inspection-spinner"),
    getLancasterInventory("pine-ridge-arrow-inspector"),
    getLancasterInventory("last-chance-square-up-arrow-squaring-spinning-tool"),
    getLancasterInventory("omp-flightdeck-arrow-center"),
    getLancasterInventory("g5-arrow-squaring-device"),
    getLancasterInventory("bitzenburger-fletching-jig"),
    getLancasterInventory("last-chance-pro-grain-scale-2-0"),
    getPodiumInventory(42176716570799, 7417370706095), // carbon express
    getPodiumInventory(41345580040367, 7164229648559), // lca saw
    getPodiumInventory(44396943638703, 8078134968495), // square up
    getPodiumInventory(43337274589359, 7760403824815), // omp
    getPodiumInventory(41345589706927, 7164232695983), // g5
    getPodiumInventory(45107251347631, 8211369459887), // modsaw standard
    getPodiumInventory(45107256098991, 8211369558191), // modsaw deluxe
    getPodiumInventory(44396962250927, 8078142636207), // lca scale
    getMikesInventory(15930), // deluxe
    getMikesInventory(13089), // ez green
    getMikesInventory(16672), // square up
    getMikesInventory(15387), // pine ridge
    getMikesInventory(10039), // g5
  ])
    .then((values) => {
      inventory["blackOvis-standard"] = values[0].value;
      inventory["blackOvis-deluxe"] = values[1].value;
      inventory["3Rivers-standard"] = values[2].value;
      inventory["3Rivers-deluxe"] = values[3].value;

      inventory["goHunt-standard"] = values[4].value;
      inventory["goHunt-deluxe"] = values[5].value;
      inventory["goHunt-lca-saw"] = values[6].value;

      inventory["lancaster-standard"] = values[7].value;
      inventory["lancaster-deluxe"] = values[8].value;
      inventory["lancaster-x-spot"] = values[9].value;
      inventory["lancaster-x-spot-mini"] = values[10].value;
      inventory["lancaster-lca-saw"] = values[11].value;
      inventory["lancaster-carbon-express"] = values[12].value;
      inventory["lancaster-lca-ez-green"] = values[13].value;
      inventory["lancaster-avalon-spinner"] = values[14].value;
      inventory["lancaster-pine-ridge-spinner"] = values[15].value;
      inventory["lancaster-lca-spin-square"] = values[16].value;
      inventory["lancaster-omp-spin-square"] = values[17].value;
      inventory["lancaster-g5-square"] = values[18].value;
      inventory["lancaster-bitz"] = values[19].value;
      inventory["lancaster-lca-scale"] = values[20].value;

      inventory["podium-carbon-express"] = values[21].value;
      inventory["podium-lca-saw"] = values[22].value;
      inventory["podium-square-up"] = values[23].value;
      inventory["podium-omp-spin-square"] = values[24].value;
      inventory["podium-g5-square"] = values[25].value;
      inventory["podium-modsaw-standard"] = values[26].value;
      inventory["podium-modsaw-deluxe"] = values[27].value;
      inventory["podium-lca-scale"] = values[28].value;

      inventory["mikes-deluxe"] = values[29].value;
      inventory["mikes-lca-ez-green"] = values[30].value;
      inventory["mikes-square-up"] = values[31].value;
      inventory["mikes-pine-ridge"] = values[32].value;
      inventory["mikes-g5"] = values[33].value;

      let dateInventoryObj = {
        date: new Date().toLocaleDateString("en-us", {
          timeZone: "America/Chicago",
          year: "numeric",
          month: "numeric",
          day: "numeric",
        }),
        data: inventory,
      };
      db.data.inventory.push(dateInventoryObj);
      return dateInventoryObj;
    })
    .then(async (obj) => {
      // console.log(obj);

      await db.write();
      sendEmail();
    });

//   Promise.all([getMidwayInventory(659161)])
//     .then((values) => {
//       console.log("value", values[0]);
//     })
//     .catch((err) => {
//       console.log("error", err);
//     });
});

process.on("SIGINT", function () {
  console.log("shutting down schedulers");
  schedule.gracefulShutdown().then(() => process.exit(0));
});

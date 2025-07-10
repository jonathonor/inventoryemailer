import nodemailer from "nodemailer";

function filterLastMonth(objects) {
  const today = new Date();
  const lastMonth = new Date(today);
  lastMonth.setMonth(today.getMonth() - 1);

  return objects.filter(obj => {
    const objDate = new Date(obj["date"]);
    return objDate >= lastMonth && objDate <= today;
  });
}

export const sendMonthlyEmail = async (dbData) => {
let data = filterLastMonth(dbData);
  
const today = new Date();
const lastMonth = new Date(today);
lastMonth.setMonth(today.getMonth() - 1);
const monthName = lastMonth.toLocaleString('default', { month: 'long' });
  
let standards = ["lancaster-standard", "goHunt-standard", "blackOvis-standard", "3Rivers-standard", "podium-modsaw-standard"];
let deluxe = ["lancaster-deluxe", "goHunt-deluxe", "blackOvis-deluxe", "podium-modsaw-deluxe", "3Rivers-deluxe", "mikes-deluxe"];
let carbons = ["lancaster-carbon-express", "podium-carbon-express"];
let lca = ["lancaster-lca-saw", "podium-lca-saw", "goHunt-lca-saw"];
let rest = ["lancaster-lca-scale", "podium-lca-scale",
"lancaster-lca-ez-green", "mikes-lca-ez-green",
"lancaster-pine-ridge-spinner", "mikes-pine-ridge",
"lancaster-omp-spin-square", "podium-omp-spin-square",
"lancaster-lca-spin-square", "podium-square-up", "mikes-square-up",
"lancaster-g5-square", "podium-g5-square", "mikes-g5",
"lancaster-x-spot", "lancaster-x-spot-mini", "lancaster-avalon-spinner"];

let standardSold = [];
let standardTotalSold = 0;

let deluxeSold = [];
let deluxeTotalSold = 0;
  
let carbonSold = [];
let carbonTotalSold = 0;
  
let lcaSold = [];
let lcaTotalSold = 0;
  
let restSold = [];
  
standards.forEach(name => {
  let changes = calculateChange(data, name, "date");
  let sold = changes.reduce((accumulator, currentValue) => accumulator + currentValue.sold, 0);
  standardSold.push({name, value: sold});
  standardTotalSold+=sold;
});
  
deluxe.forEach(name => {
  const changes = calculateChange(data, name, "date");
  let sold = changes.reduce((accumulator, currentValue) => accumulator + currentValue.sold, 0);
  deluxeSold.push({name, value: sold});
  deluxeTotalSold+=sold;
});

carbons.forEach(name => {
  const changes = calculateChange(data, name, "date");
  let sold = changes.reduce((accumulator, currentValue) => accumulator + currentValue.sold, 0);
  carbonSold.push({name, value: sold});  
  carbonTotalSold+=sold;
});

lca.forEach(name => {
  const changes = calculateChange(data, name, "date");
  let sold = changes.reduce((accumulator, currentValue) => accumulator + currentValue.sold, 0);
  lcaSold.push({name, value: sold}); 
  lcaTotalSold+=sold;
});

rest.forEach(name => {
  const changes = calculateChange(data, name, "date");
  let sold = changes.reduce((accumulator, currentValue) => accumulator + currentValue.sold, 0);
  restSold.push({name, value: sold}); 
});
  
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
        letter-spacing: 6.5px;">${monthName}</span><span style="font-size: 13px;
        font-weight: 500;
        letter-spacing: 3.55px;
        opacity: .65;
        transform: translateY(-2px);">Recap</span></h1>
  </header>
  ${getSectionHtml("Standard Modsaw", standardSold, standardTotalSold)}
  ${getSectionHtml("Deluxe Modsaw", deluxeSold, deluxeTotalSold)}
  ${getSectionHtml("Carbon Express", carbonSold, carbonTotalSold)}
  ${getSectionHtml("Lca Saw", lcaSold, lcaTotalSold)}
  ${getSectionHtml("Everything Else", restSold, "")}

</div>`;

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Monthly Recap 🏹" <info@modsaw.com>', // sender address
    to: "admin@modsaw.com", // list of receivers
    subject: "Monthly Inventory Data", // Subject line
    html: html, // html body
  });

  console.log("Message sent: %s", info.messageId);
};

let getSectionHtml = (itemName, items, totalSold) => {
  return `<main style="background-color: #fff;
  border-radius: 0 0 12px 12px;
  padding: 15px 15px 20px;
  display: grid;
  row-gap: 8px;">
  <div>${itemName} <b>${totalSold}</b></div>
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
      ${getRow(item)}
    </article> `;
  }

  return html;
};

let getRow = (item) => {
    return `<span style="color: #979cb0;
      font-weight: 600;
      font-size: 18px;
      letter-spacing: 0.64px;
      margin-left: 32px;">${item.name}</span>
        <span style="color: #979cb0;
          font-weight: 700;
          font-size: 20px;
          text-align: right;">${item.value}
        </span>`;
};

function calculateChange(data, valueKey, timeKey) {
  if (!data || data.length < 2) {
    return "Not enough data to calculate change.";
  }

  // Sort the data by time
  data.sort((a, b) => new Date(a[timeKey]) - new Date(b[timeKey]));

  const changes = [];
  for (let i = 1; i < data.length; i++) {
    const oldValue = data[i - 1]["data"][valueKey];
    const newValue = data[i]["data"][valueKey];

      let value = newValue - oldValue;
    const change = {
      sold: value < 0 ? value : 0,
      stocked: value > 0 ? value : 0,
    };
    changes.push(change);
  }
  return changes;
}






import axios from "axios";

// export const getMidwayInventory = async (id) => {
//   let res = await axios({
//     method: "post",
//     url: "https://www.midwayusa.com/api/cart/item",
//     headers: {
//       "Content-Type": "application/json",
//       Accept: "*/*",
//       "Cache-Control": "no-cache",
//       Host: "www.midwayusa.com",
//       "Accept-Encoding": "gzip, deflate, br",
//       Connection: "keep-alive",
//       "Content-Length": "36",
//     },
//     data: { saleItemId: 659161, quantity: 100 },
//     transformResponse: [
//       function (req) {
//         return req;
//       },
//     ],
//   });
//   let numberRegexG = /\d+/g;
//   let inStock = JSON.parse(res.data).WarningMessages[0];
//   return parseInt(inStock.match(numberRegexG)[0]);
// };

// export const getMidwayInventory = async () => {
//   let res = await fetch("https://www.midwayusa.com/api/cart/item", {
//     headers: {
//       "Content-Type": "application/json",
//       Accept: "*/*",
//       "Cache-Control": "no-cache",
//       Host: "www.midwayusa.com",
//       "Accept-Encoding": "gzip, deflate, br",
//       Connection: "keep-alive",
//       "Content-Length": "36",
//     },
//     method: "POST",
//     body: JSON.stringify({ saleItemId: 659161, quantity: 100 }),
//   });
//   let numberRegexG = /\d+/g;
//   let inStock = JSON.parse(res.data).WarningMessages[0];
//   return parseInt(inStock.match(numberRegexG)[0]);
// };

// export const getMidwayItemData = (db) => {
//   let dbLength = db.data.inventory.length;
//   let latest = db.data.inventory[dbLength - 1].data;
//   let previous = db.data.inventory[dbLength - 2].data;

//   return [
//     {
//       image: "https://lancasterarchery.com/cdn/shop/files/1042315_6_1000x.jpg",
//       id: "mikes-deluxe",
//       name: "modsaw Deluxe",
//       inventory: latest["mikes-deluxe"],
//       change: latest["mikes-deluxe"] - previous["mikes-deluxe"],
//     },
//     {
//       image: "https://lancasterarchery.com/cdn/shop/files/6910007_2023.jpg",
//       id: "mikes-lca-ez-green",
//       name: "EZ Green Press",
//       inventory: latest["mikes-lca-ez-green"],
//       change: latest["mikes-lca-ez-green"] - previous["mikes-lca-ez-green"],
//     },
//     {
//       image: "https://lancasterarchery.com/cdn/shop/files/1039419.jpg",
//       id: "mikes-square-up",
//       name: "Square Up",
//       inventory: latest["mikes-square-up"],
//       change: latest["mikes-square-up"] - previous["mikes-square-up"],
//     },
//     {
//       image: "https://lancasterarchery.com/cdn/shop/files/3450004.jpg",
//       id: "mikes-pine-ridge",
//       name: "Pine Ridge Spinner",
//       inventory: latest["mikes-pine-ridge"],
//       change: latest["mikes-pine-ridge"] - previous["mikes-pine-ridge"],
//     },
//     {
//       image: "https://lancasterarchery.com/cdn/shop/files/2240177.jpg",
//       id: "mikes-g5",
//       name: "G5 ASD",
//       inventory: latest["mikes-g5"],
//       change: latest["mikes-g5"] - previous["mikes-g5"],
//     },
//   ];
// };

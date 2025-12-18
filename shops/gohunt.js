import axios from "axios";

export const getGoHuntInventory = async (id, product_id) => {
  let res;
  try {
    res = await axios({
      method: "post",
      url: "https://shop.gohunt.com/cart/add",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Requested-With": "XMLHttpRequest",
      },
      data: {
        form_type: "product",
        id: id,
        "product-id": product_id,
        quantity: "100",
      },
      transformResponse: [
        function (req) {
          // Do whatever you want to transform the data
          return req;
        },
      ],
    });
  } catch (e) {
    let numberRegexG = /\d+/g;
    let soldOutRegex = /(sold out)/g;
    let ret = JSON.parse(e.response.data).errors;
    console.log("ret", ret);
    let soldOut = ret.match(soldOutRegex);
    console.log(soldOut);
    if (soldOut) {
      console.log("sold out");
      return 0;
    }
    let parsed = ret.match(numberRegexG)[0];
    console.log("parsed", parsed);
    let remainingQ = parsed ? parseInt(parsed) : 0;
    console.log("remain", remainingQ);
    return remainingQ;
  }
  return res;
};

export const getGoHuntItemData = (db) => {
  let dbLength = db.data.inventory.length;
  let latest = db.data.inventory[dbLength - 1].data;
  let previous = db.data.inventory[dbLength - 2].data;

  return [
    {
      image: "https://lancasterarchery.com/cdn/shop/files/1042314_1.jpg.jpg",
      id: "goHunt-standard",
      name: "modsaw Standard",
      inventory: latest["goHunt-standard"],
      change: latest["goHunt-standard"] - previous["goHunt-standard"],
    },
    {
      image: "https://lancasterarchery.com/cdn/shop/files/1042315_6_1000x.jpg",
      id: "goHunt-deluxe",
      name: "modsaw Deluxe",
      inventory: latest["goHunt-deluxe"],
      change: latest["goHunt-deluxe"] - previous["goHunt-deluxe"],
    },
    // {
    //   image: "https://lancasterarchery.com/cdn/shop/files/6910067.jpg",
    //   id: "goHunt-lca-saw",
    //   name: "LCA Saw",
    //   inventory: latest["goHunt-lca-saw"],
    //   change: latest["goHunt-lca-saw"] - previous["goHunt-lca-saw"],
    // },
  ];
};

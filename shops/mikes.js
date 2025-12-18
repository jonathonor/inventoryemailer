// getMikesInventory(15930) // deluxe
// getMikesInventory(13089) // ez green
// getMikesInventory(16672) // square up
// getMikesInventory(15387) // pine ridge
// getMikesInventory(10039) // g5

import axios from "axios";

export const getMikesInventory = async (id) => {
  let res = await axios({
    method: "post",
    url: "https://swymstore-v3pro-01.swymrelay.com/api/v2/provider/getPlatformProducts?pid=qCsbYWnk71dPZri%2F28PZoPLHuWaSTGjS19FVj5hMcBU%3D",
    headers: {
      Accept: "*/*",
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Requested-With": "XMLHttpRequest",
    },
    data: {
      productids: `[${id}]`,
      regid:
        "jxGjFss51MXgbWlxiVOl1qJ1PDJ-hvplH7BhbnONfBnm541UUDUcqp-scW9S1R5SIIB48u6jof-eCyvincAfxJmi5EP1KW8pioR0U16jm6MW41cCqbGk3RWt6b2LbIx-mJPY479rEo25Y-IWs92Yi7hwS5ngNtU2W_F7VLf4WHo",
      sessionid:
        "cs60y7av0f7lthvtxnpz5cdiya2x1k2jy037lzng4vaublkiq6agopfq90yn2ysz",
    },
    transformResponse: [
      function (req) {
        return req;
      },
    ],
  });
  return JSON.parse(res.data)[0].productdata.variants[0].inventory_level;
};

export const getMikesItemData = (db) => {
  let dbLength = db.data.inventory.length;
  let latest = db.data.inventory[dbLength - 1].data;
  let previous = db.data.inventory[dbLength - 2].data;

  return [
    {
      image: "https://lancasterarchery.com/cdn/shop/files/1042315_6_1000x.jpg",
      id: "mikes-deluxe",
      name: "modsaw Deluxe",
      inventory: latest["mikes-deluxe"],
      change: latest["mikes-deluxe"] - previous["mikes-deluxe"],
    },
    // {
    //   image: "https://lancasterarchery.com/cdn/shop/files/6910007_2023.jpg",
    //   id: "mikes-lca-ez-green",
    //   name: "EZ Green Press",
    //   inventory: latest["mikes-lca-ez-green"],
    //   change: latest["mikes-lca-ez-green"] - previous["mikes-lca-ez-green"],
    // },
    // {
    //   image: "https://lancasterarchery.com/cdn/shop/files/1039419.jpg",
    //   id: "mikes-square-up",
    //   name: "Square Up",
    //   inventory: latest["mikes-square-up"],
    //   change: latest["mikes-square-up"] - previous["mikes-square-up"],
    // },
    // {
    //   image: "https://lancasterarchery.com/cdn/shop/files/3450004.jpg",
    //   id: "mikes-pine-ridge",
    //   name: "Pine Ridge Spinner",
    //   inventory: latest["mikes-pine-ridge"],
    //   change: latest["mikes-pine-ridge"] - previous["mikes-pine-ridge"],
    // },
    // {
    //   image: "https://lancasterarchery.com/cdn/shop/files/2240177.jpg",
    //   id: "mikes-g5",
    //   name: "G5 ASD",
    //   inventory: latest["mikes-g5"],
    //   change: latest["mikes-g5"] - previous["mikes-g5"],
    // },
  ];
};

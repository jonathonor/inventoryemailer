// getPaperTunerInventory(44895826673945, 8039568605465) // papertuner white
// getPaperTunerInventory(44895826706713, 8039568605465) // papertuner green
// getPaperTunerInventory(47232677871897, 8039568605465) // papertuner orange

// getPaperTunerInventory(49915661943065, 9757417210137) // spinner
import axios from "axios";

export const getPaperTunerInventory = async (id, product_id) => {
  let res;
  try {
    res = await axios({
      method: "post",
      url: "https://papertuner.com/cart/add",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Requested-With": "XMLHttpRequest",
      },
      data: {
        form_type: "product",
        id: id,
        "product-id": product_id,
        quantity: "200",
      },
      transformResponse: [
        function (req) {
          // Do whatever you want to transform the data
          console.log("papertuner inventory", req);
          return req;
        },
      ],
    });
  } catch (e) {
    let numberRegexG = /\d+/g;
    let ret = JSON.parse(e.response.data).errors;
    return parseInt(ret.match(numberRegexG)[0]);
  }
  return res;
};

export const getPaperTunerItemData = (db) => {
  let dbLength = db.data.inventory.length;
  let latest = db.data.inventory[dbLength - 1].data;
  let previous = db.data.inventory[dbLength - 2].data;

  return [
    {
      image:
        "https://www.podiumarcher.com/cdn/shop/files/PaperTunerBlackandWhite2048nomagnets_v1_jpg.webp?v=1723221301&width=1200",
      id: "papertuner-white",
      name: "PaperTuner-W",
      inventory: latest["papertuner-white"] || 0,
      change: latest["papertuner-white"] - previous["papertuner-white"],
    },
    {
      image: "https://papertuner.com/cdn/shop/files/PaperTunerGreen.413.png",
      id: "papertuner-green",
      name: "PaperTuner-G",
      inventory: latest["papertuner-green"] || 0,
      change: latest["papertuner-green"] - previous["papertuner-green"],
    },
    {
      image: "https://papertuner.com/cdn/shop/files/PaperTunerOrange.427.png",
      id: "papertuner-orange",
      name: "PaperTuner-O",
      inventory: latest["papertuner-orange"] || 0,
      change: latest["papertuner-orange"] - previous["papertuner-orange"],
    },
    {
      image:
        "https://www.podiumarcher.com/cdn/shop/files/spinner1.webp?v=1747159724&width=1200",
      id: "papertuner-spinner",
      name: "PaperTuner Spinner",
      inventory: latest["papertuner-spinner"] || 0,
      change: latest["papertuner-spinner"] - previous["papertuner-spinner"],
    },
  ];
};

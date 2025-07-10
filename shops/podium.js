// getPodiumInventory(42176716570799, 7417370706095) // carbon express
// getPodiumInventory(41345580040367, 7164229648559) // lca saw
// getPodiumInventory(44396943638703, 8078134968495) // square up
// getPodiumInventory(43337274589359, 7760403824815) // omp
// getPodiumInventory(41345589706927, 7164232695983) // g5
// getPodiumInventory(45107251347631, 8211369459887) // modsaw standard
// getPodiumInventory(45107256098991, 8211369558191) // modsaw deluxe
// getPodiumInventory(44396962250927, 8078142636207) // lca scale

//ez green
// Draw Board: Draw Board Sold Separately
// Mount: Bench Mount
// Xtra Freight: Lower 48
// form_type: product
// id: 38183002308783
// quantity: 1
// product-id: 6265768280239

// ez fletch
// helicle: Left
// form_type: product
// id: 41405834068143
// quantity: 1
// product-id: 7164226633903
import axios from "axios";

export const getPodiumInventory = async (id, product_id) => {
  let res;
  try {
    res = await axios({
      method: "post",
      url: "https://www.podiumarcher.com/cart/add",
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

export const getPodiumItemData = (db) => {
  let dbLength = db.data.inventory.length;
  let latest = db.data.inventory[dbLength - 1].data;
  let previous = db.data.inventory[dbLength - 2].data;

  return [
    {
      image: "https://lancasterarchery.com/cdn/shop/files/1042314_1.jpg.jpg",
      id: "podium-modsaw-standard",
      name: "modsaw Standard",
      inventory: latest["podium-modsaw-standard"] || 0,
      change:
        latest["podium-modsaw-standard"] - previous["podium-modsaw-standard"],
    },
    {
      image: "https://lancasterarchery.com/cdn/shop/files/1042315_6_1000x.jpg",
      id: "podium-modsaw-deluxe",
      name: "modsaw Deluxe",
      inventory: latest["podium-modsaw-deluxe"] || 0,
      change: latest["podium-modsaw-deluxe"] - previous["podium-modsaw-deluxe"],
    },
    {
      image: "https://lancasterarchery.com/cdn/shop/files/1031501.jpg",
      id: "podium-carbon-express",
      name: "Carbon Express",
      inventory: latest["podium-carbon-express"],
      change:
        latest["podium-carbon-express"] - previous["podium-carbon-express"],
    },
    {
      image: "https://lancasterarchery.com/cdn/shop/files/6910067.jpg",
      id: "podium-lca-saw",
      name: "LCA Saw",
      inventory: latest["podium-lca-saw"],
      change: latest["podium-lca-saw"] - previous["podium-lca-saw"],
    },
    {
      image:
        "https://lancasterarchery.com/cdn/shop/files/1038795_1000x.jpg?v=1713971032",
      id: "podium-lca-scale",
      name: "LCA Scale",
      inventory: latest["podium-lca-scale"],
      change: latest["podium-lca-scale"] - previous["podium-lca-scale"],
    },
    {
      image: "https://lancasterarchery.com/cdn/shop/files/1039419.jpg",
      id: "podium-square-up",
      name: "Square Up",
      inventory: latest["podium-square-up"],
      change: latest["podium-square-up"] - previous["podium-square-up"],
    },
    {
      image: "https://lancasterarchery.com/cdn/shop/files/1034010.jpg",
      id: "podium-omp-spin-square",
      name: "OMP Spinner",
      inventory: latest["podium-omp-spin-square"],
      change:
        latest["podium-omp-spin-square"] - previous["podium-omp-spin-square"],
    },
    {
      image: "https://lancasterarchery.com/cdn/shop/files/2240177.jpg",
      id: "podium-g5-square",
      name: "G5 ASD",
      inventory: latest["podium-g5-square"],
      change: latest["podium-g5-square"] - previous["podium-g5-square"],
    },
    //     {
    //   image: "https://lancasterarchery.com/cdn/shop/files/6910007_2023.jpg",
    //   id: "podium-lca-ez-green",
    //   name: "EZ Green Press",
    //   inventory: latest["podium-lca-ez-green"],
    //   change:
    //     latest["podium-lca-ez-green"] - previous["podium-lca-ez-green"],
    // },
    //     {
    //   image: "https://lancasterarchery.com/cdn/shop/files/6910007_2023.jpg",
    //   id: "podium-ez-fletch",
    //   name: "EZ Fletch",
    //   inventory: latest["podium-ez-fletch"],
    //   change:
    //     latest["podium-ez-fletch"] - previous["podium-ez-fletch"],
    // },
  ];
};

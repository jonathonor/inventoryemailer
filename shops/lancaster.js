import axios from "axios";

export const getLancasterInventory = async (sku) => {
  let res = await axios({
    method: "get",
    url: `https://lancasterarchery.com/products/${sku}?view=json`,
    headers: {
      Accept: "text/html",
    },
    transformResponse: [
      function (req) {
        return req;
      },
    ],
  });
  let variants = JSON.parse(res.data).variants;
  return variants.length === 1 ? variants[0].inventory_quantity : variants.map(v => v.inventory_quantity);;
};

export const getLancasterItemData = (db) => {
  let dbLength = db.data.inventory.length;
  let latest = db.data.inventory[dbLength - 1].data;
  let previous = db.data.inventory[dbLength - 2].data;

  return [
    {
      image: "https://lancasterarchery.com/cdn/shop/files/1042314_1.jpg.jpg",
      id: "lancaster-standard",
      name: "modsaw Standard",
      inventory: latest["lancaster-standard"],
      change: latest["lancaster-standard"] - previous["lancaster-standard"],
    },
    {
      image: "https://lancasterarchery.com/cdn/shop/files/1042315_6_1000x.jpg",
      id: "lancaster-deluxe",
      name: "modsaw Deluxe",
      inventory: latest["lancaster-deluxe"],
      change: latest["lancaster-deluxe"] - previous["lancaster-deluxe"],
    },
    {
      image: "https://lancasterarchery.com/cdn/shop/files/6910067.jpg",
      id: "lancaster-lca-saw",
      name: "LCA Saw",
      inventory: latest["lancaster-lca-saw"],
      change: latest["lancaster-lca-saw"] - previous["lancaster-lca-saw"],
    },
    {
      image: "https://lancasterarchery.com/cdn/shop/files/1038795_1000x.jpg?v=1713971032",
      id: "lancaster-lca-scale",
      name: "LCA Scale",
      inventory: latest["lancaster-lca-scale"],
      change: latest["lancaster-lca-scale"] - previous["lancaster-lca-scale"],
    },
    {
      image: "https://lancasterarchery.com/cdn/shop/files/1031501.jpg",
      id: "lancaster-carbon-express",
      name: "Carbon Express",
      inventory: latest["lancaster-carbon-express"],
      change:
        latest["lancaster-carbon-express"] -
        previous["lancaster-carbon-express"],
    },
    {
      image:
        "https://lancasterarchery.com/cdn/shop/files/6820022_cddc7702-ab3c-4ab5-858d-4e0beaa08e82.jpg",
      id: "lancaster-x-spot",
      name: "X Spot",
      inventory: latest["lancaster-x-spot"],
      change: latest["lancaster-x-spot"] - previous["lancaster-x-spot"],
    },
    {
      image:
        "https://lancasterarchery.com/cdn/shop/files/6820024_8e16141c-cac7-4a62-a001-90ba8b4f6431.jpg",
      id: "lancaster-x-spot-mini",
      name: "X Spot Mini",
      inventory: latest["lancaster-x-spot-mini"],
      change:
        latest["lancaster-x-spot-mini"] - previous["lancaster-x-spot-mini"],
    },
    {
      image: "https://lancasterarchery.com/cdn/shop/files/6910007_2023.jpg",
      id: "lancaster-lca-ez-green",
      name: "EZ Green Press",
      inventory: latest["lancaster-lca-ez-green"],
      change:
        latest["lancaster-lca-ez-green"] - previous["lancaster-lca-ez-green"],
    },
    {
      image: "https://lancasterarchery.com/cdn/shop/products/1031651.jpg",
      id: "lancaster-avalon-spinner",
      name: "Avalon Spinner",
      inventory: latest["lancaster-avalon-spinner"],
      change:
        latest["lancaster-avalon-spinner"] -
        previous["lancaster-avalon-spinner"],
    },
    {
      image: "https://lancasterarchery.com/cdn/shop/files/3450004.jpg",
      id: "lancaster-pine-ridge-spinner",
      name: "Pine Ridge Spinner",
      inventory: latest["lancaster-pine-ridge-spinner"],
      change:
        latest["lancaster-pine-ridge-spinner"] -
        previous["lancaster-pine-ridge-spinner"],
    },
    {
      image: "https://lancasterarchery.com/cdn/shop/files/1039419.jpg",
      id: "lancaster-lca-spin-square",
      name: "LCA SquareUp",
      inventory: latest["lancaster-lca-spin-square"],
      change:
        latest["lancaster-lca-spin-square"] -
        previous["lancaster-lca-spin-square"],
    },
    {
      image: "https://lancasterarchery.com/cdn/shop/files/1034010.jpg",
      id: "lancaster-omp-spin-square",
      name: "OMP Spinner",
      inventory: latest["lancaster-omp-spin-square"],
      change:
        latest["lancaster-omp-spin-square"] -
        previous["lancaster-omp-spin-square"],
    },
    {
      image: "https://lancasterarchery.com/cdn/shop/files/2240177.jpg",
      id: "lancaster-g5-square",
      name: "G5 ASD",
      inventory: latest["lancaster-g5-square"],
      change: latest["lancaster-g5-square"] - previous["lancaster-g5-square"],
    },
    {
      image: "https://lancasterarchery.com/cdn/shop/files/1430002_right-clamp_1000x.jpg?v=1740601717",
      id: "lancaster-bitz",
      name: "Bitz",
      inventory: latest["lancaster-bitz"],
      change: latest["lancaster-bitz"].map((v, iter) => v - previous["lancaster-bitz"][iter]),
    },
  ];
};
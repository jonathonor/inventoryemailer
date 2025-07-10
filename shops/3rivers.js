import axios from "axios";

export const get3RiversInventory = async (id) => {
  let res = await axios({
    method: "post",
    url: "https://www.3riversarchery.com/mm5/json.mvc",
    params: {
      Store_Code: "3RA",
      Function: "Runtime_AttributeList_Load_ProductVariant_Possible",
    },
    headers: {
      Accept: "*/*",
      "Content-Type": "application/x-www-form-urlencoded",
      Cookie: "mm5-3RA-basket-id=6315d1bd857e1820acf980da2be30d7f",
      "X-Requested-With": "XMLHttpRequest",
    },
    data: {
      Product_Code: "5627X",
      Selected_Attribute_IDs: 59438,
      Selected_Attribute_Types: "select",
      Selected_Option_IDs: id,
      Session_Type: "runtime",
    },
    transformResponse: [
      function (req) {
        return req;
      },
    ],
  });

  return JSON.parse(res.data).data.variant.inv_available;
};

export const get3RiversItemData = (db) => {
  let dbLength = db.data.inventory.length;
  let latest = db.data.inventory[dbLength - 1].data;
  let previous = db.data.inventory[dbLength - 2].data;

  return [
    {
      image: "https://lancasterarchery.com/cdn/shop/files/1042314_1.jpg.jpg",
      id: "3Rivers-standard",
      name: "modsaw Standard",
      inventory: latest["3Rivers-standard"],
      change: latest["3Rivers-standard"] - previous["3Rivers-standard"],
    },
    {
      image: "https://lancasterarchery.com/cdn/shop/files/1042315_6_1000x.jpg",
      id: "3Rivers-deluxe",
      name: "modsaw Deluxe",
      inventory: latest["3Rivers-deluxe"],
      change: latest["3Rivers-deluxe"] - previous["3Rivers-deluxe"],
    },
  ];
};

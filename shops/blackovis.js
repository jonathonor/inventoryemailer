import axios from "axios";
import axiosRetry from "axios-retry";

// "MODS0001-DLX or MODS0002-STD"
export const getBlackOvisInventory = async (product_sku, db) => {
  let cartReq = await axios({
    method: "post",
    url: `https://www.blackovis.com/rest/V1/guest-carts`,
    headers: {
      Accept: "*/*",
      "x-requested-with": "XMLHttpRequest",
      "Content-Type": "application/json",
    },
    transformResponse: [
      function (res) {
        return res;
      },
    ],
  });

  let cartId = JSON.parse(cartReq.data);

  // Example usage:
  let dbLength = db.data.inventory.length;
  // add one so that the first request always fails, this way we can determine restock if first request succeeds
  const yesterdaysCount =
    product_sku === "MODS0002-STD"
      ? db.data.inventory[dbLength - 1].data["blackOvis-standard"] + 1
      : db.data.inventory[dbLength - 1].data["blackOvis-deluxe"] + 1;

  return fetchDataWithRetry(product_sku, cartId, yesterdaysCount, 1)
    .then((data) => {
      // console.log("Successfully added items to cart", data);
      return data;
    })
    .catch((error) => {
      console.error("Failed to fetch data after multiple retries:", error);
    });
};

export const getBlackOvisItemData = (db) => {
  let dbLength = db.data.inventory.length;
  let latest = db.data.inventory[dbLength - 1].data;
  let previous = db.data.inventory[dbLength - 2].data;

  return [
    {
      image: "https://lancasterarchery.com/cdn/shop/files/1042314_1.jpg.jpg",
      id: "blackOvis-standard",
      name: "modsaw Standard",
      inventory: latest["blackOvis-standard"],
      change: latest["blackOvis-standard"] - previous["blackOvis-standard"],
    },
    {
      image: "https://lancasterarchery.com/cdn/shop/files/1042315_6_1000x.jpg",
      id: "blackOvis-deluxe",
      name: "modsaw Deluxe",
      inventory: latest["blackOvis-deluxe"],
      change: latest["blackOvis-deluxe"] - previous["blackOvis-deluxe"],
    },
  ];
};

async function fetchDataWithRetry(product_sku, cartId, decrementor, counter) {
  if (decrementor <= 0) {
    return 0;
  }

  axiosRetry(axios, {
    retries: 1, // Only retry once per param
    retryCondition: (error) => {
      console.log("errmsg", error.response.data.message, decrementor);
      if (error.response.data.message == "The requested qty is not available") {
        return true;
      } else if (
        error.response.data.message ==
        "Product that you are trying to add is not available."
      ) {
        console.log("out of stock");
        return false;
      } else {
        return true;
      }
    },
    onRetry: (retryCount, error, requestConfig) => {
      console.log(
        `Retrying request with qty: ${decrementor}, attempt: ${counter}`
      );
    },
  });

  try {
    let response = await axios({
      method: "post",
      url: `https://www.blackovis.com/rest/V1/guest-carts/${cartId}/items`,
      headers: {
        Accept: "*/*",
        "x-requested-with": "XMLHttpRequest",
        "Content-Type": "application/json",
      },
      data: {
        cart_item: {
          quote_id: cartId,
          sku: product_sku,
          qty: decrementor,
        },
      },
    });

    if (counter === 1 && response.status === 200) {
      console.log("restocked");
      return "restocked"; //response.data;
    } else if (counter > 1 && response.status === 200) {
      console.log("found count");
      return decrementor; //response.data;
    } else {
      return fetchDataWithRetry(
        product_sku,
        cartId,
        decrementor - 1,
        counter + 1
      );
    }
  } catch (error) {
    if (
      error.response.data.message ==
      "Product that you are trying to add is not available."
    ) {
      return 0;
    } else {
      return fetchDataWithRetry(
        product_sku,
        cartId,
        decrementor - 1,
        counter + 1
      );
    }
  }
}
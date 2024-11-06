import { ERROR_MESSAGES } from '../constants/constants.js';

const validator = Object.freeze({
  invalidFormat(orderInput) {
    const pattern = /^\[([가-힣]+)-\d+\](,\[([가-힣]+)-\d+\])*$/;
    if (!pattern.test(orderInput)) throw new Error(ERROR_MESSAGES.INVALID_FORMAT);
  },

  productNotfound(orderList, productList) {
    const productNames = productList.map((product) => product.getInformation().name);
    if (orderList.some((order) => !productNames.includes(order.name))) {
      throw new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
    }
  },

  stockExceeded(orderList, productList) {
    orderList.forEach((order) => {
      const products = productList.filter(
        (product) => product.getInformation().name === order.name,
      );
      const stock = products.reduce(
        (acc, product) => acc + product.getInformation().stockQuantity,
        0,
      );
      if (stock < order.quantity) throw new Error(ERROR_MESSAGES.STOCK_EXCEEDED);
    });
  },
});

export default validator;

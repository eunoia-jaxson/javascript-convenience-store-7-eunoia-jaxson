import { ERROR_MESSAGES } from '../constants/constants.js';

const validator = Object.freeze({
  invalidFormat(orderInput) {
    const pattern = /^\[([가-힣]+)-\d+\](,\[([가-힣]+)-\d+\])*$/;
    if (!pattern.test(orderInput)) {
      throw new Error(ERROR_MESSAGES.INVALID_FORMAT);
    }
  },

  productNotfound(orderList, productNames) {
    if (orderList.some((order) => !productNames.includes(order.name))) {
      throw new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
    }
  },

  stockExceeded(isStockExceeded) {
    if (isStockExceeded) {
      throw new Error(ERROR_MESSAGES.STOCK_EXCEEDED);
    }
  },

  quantityMoreThanZero(orderList) {
    if (orderList.some((order) => order.quantity <= 0)) {
      throw new Error(ERROR_MESSAGES.INVALID_INPUT);
    }
  },
});

export default validator;

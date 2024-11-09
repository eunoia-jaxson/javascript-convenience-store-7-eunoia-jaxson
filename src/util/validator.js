import { ERROR_MESSAGES } from '../constants/constants.js';

const validator = Object.freeze({
  invalidFormat(orderInput) {
    const pattern = /^\[([가-힣]+)-\d+\](,\[([가-힣]+)-\d+\])*$/;
    if (!pattern.test(orderInput)) {
      throw new Error(ERROR_MESSAGES.INVALID_FORMAT);
    }
  },

  productNotFound(orders, productNames) {
    if (orders.some((order) => !productNames.includes(order.name))) {
      throw new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
    }
  },

  duplicateProduct(productNames) {
    if (productNames.length !== new Set(productNames).size) {
      throw new Error(ERROR_MESSAGES.INVALID_INPUT);
    }
  },

  stockExceeded(isStockExceeded) {
    if (isStockExceeded) {
      throw new Error(ERROR_MESSAGES.STOCK_EXCEEDED);
    }
  },

  quantityMoreThanZero(orders) {
    if (orders.some((order) => order.quantity <= 0)) {
      throw new Error(ERROR_MESSAGES.INVALID_INPUT);
    }
  },

  invalidCharacter(character) {
    if (character !== 'Y' && character !== 'N') {
      throw new Error(ERROR_MESSAGES.INVALID_INPUT);
    }
  },
});

export default validator;

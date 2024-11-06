import { Console } from '@woowacourse/mission-utils';
// import fs from 'fs';
import { SYSTEM_MESSAGES } from '../constants/constants.js';

const OutputView = {
  print(message) {
    Console.print(message);
  },

  welcome() {
    this.print(SYSTEM_MESSAGES.WELCOME);
    this.print(SYSTEM_MESSAGES.AVAILABLE_PRODUCTS);
  },

  async printProducts(products) {
    products.forEach((product) => {
      this.print(product.toString());
    });
  },
  // ...
};

export default OutputView;

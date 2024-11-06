import { Console } from '@woowacourse/mission-utils';
// import fs from 'fs';
import { SYSTEM_MESSAGES } from '../constants/constants.js';

const OutputView = {
  welcome() {
    Console.print(SYSTEM_MESSAGES.WELCOME);
    Console.print(SYSTEM_MESSAGES.AVAILABLE_PRODUCTS);
  },

  async printProducts(products) {
    products.forEach((product) => {
      Console.print(product.toString());
    });
  },
  // ...
};

export default OutputView;

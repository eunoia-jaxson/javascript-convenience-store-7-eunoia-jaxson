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
      if (product.stockQuantity === 0) {
        this.print(
          `- ${product.name} ${product.unitPrice.toLocaleString()}원 재고 없음 ${product.promotion}`,
        );
        return;
      }
      this.print(
        `- ${product.name} ${product.unitPrice.toLocaleString()}원 ${product.stockQuantity.toLocaleString()}개 ${product.promotion}`,
      );
    });
  },
  // ...
};

export default OutputView;

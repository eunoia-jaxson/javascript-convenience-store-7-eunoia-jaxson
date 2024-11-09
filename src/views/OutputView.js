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

  printProducts(products) {
    products.forEach((product) => {
      if (product.stockQuantity === 0) {
        this.printZeroStockProduct(product);
        return;
      }
      this.printProduct(product);
    });
  },

  printZeroStockProduct(product) {
    this.print(
      `- ${product.name} ${product.unitPrice.toLocaleString()}원 재고 없음 ${product.promotion}`,
    );
  },

  printProduct(product) {
    this.print(
      `- ${product.name} ${product.unitPrice.toLocaleString()}원 ${product.stockQuantity.toLocaleString()}개 ${product.promotion}`,
    );
  },

  printOrders(orders) {
    orders.forEach((order) => {
      this.print(order.toString());
    });
  },
};

export default OutputView;

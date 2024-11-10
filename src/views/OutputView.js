import { Console } from '@woowacourse/mission-utils';
import fs from 'fs';
import { RECEIPT, SYSTEM_MESSAGES } from '../constants/constants.js';

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

  printReceipt(orders, totalCount, totalPrice, promotionPrice, membershipDiscount) {
    this.print(RECEIPT.HEADER);
    this.printOrderProducts(orders);
    this.checkLength(orders.filter((order) => order.getPromotionQuantity() > 0));
    this.printTotalPrice(totalCount, totalPrice, promotionPrice, membershipDiscount);
  },

  printOrderProducts(orders) {
    this.print(RECEIPT.PRODUCT_LIST_TITLE);
    orders.forEach((order) => {
      if (order.getName().length < 4) {
        this.print(RECEIPT.PRODUCT(order.getName(), order.getQuantity(), order.getTotalPrice()));
        return;
      }
      this.print(RECEIPT.PRODUCT_LONG(order.getName(), order.getQuantity(), order.getTotalPrice()));
    });
  },

  checkLength(orders) {
    if (orders.length > 0) {
      this.print(RECEIPT.GIFT_HEADER);
      this.printPromotionProducts(orders);
    }
  },

  printPromotionProducts(orders) {
    orders.forEach((order) => {
      if (order.getName().length < 4) {
        this.print(RECEIPT.GIFT(order.getName(), order.getPromotionQuantity()));
        return;
      }
      this.print(RECEIPT.GIFT_LONG(order.getName(), order.getPromotionQuantity()));
    });
  },

  printTotalPrice(totalCount, totalPrice, promotionPrice, membershipDiscount) {
    this.print(RECEIPT.FOOTER);
    this.print(RECEIPT.TOTAL_PURCHASE(totalCount, totalPrice));
    this.print(RECEIPT.EVENT_DISCOUNT(promotionPrice));
    this.print(RECEIPT.MEMBERSHIP_DISCOUNT(membershipDiscount));
    Console.print(RECEIPT.FINAL_AMOUNT(totalPrice - promotionPrice - membershipDiscount));
  },

  async fileUpdate(stock) {
    fs.writeFileSync('public/products.md', stock);
  },
};

export default OutputView;

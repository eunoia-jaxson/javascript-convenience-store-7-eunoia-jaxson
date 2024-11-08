import { Console } from '@woowacourse/mission-utils';
import fs from 'fs';
import { SYSTEM_MESSAGES } from '../constants/constants.js';

const InputView = {
  async readItem() {
    const input = await Console.readLineAsync(SYSTEM_MESSAGES.ENTER_PRODUCT_AND_QUANTITY);
    return input;
  },

  async readProductsFromFile() {
    return fs.readFileSync('public/products.md').toString().split('\n');
  },

  async readPromotionsFromFile() {
    return fs.readFileSync('public/promotions.md').toString().split('\n');
  },

  async readIncludeUnmetPromotionQuantity(productName) {
    const input = await Console.readLineAsync(SYSTEM_MESSAGES.PROMOTION_ELIGIBILITY(productName));
    return input;
  },

  async readRegularPricePayment(regularPricePayment) {
    const input = await Console.readLineAsync(
      SYSTEM_MESSAGES.PROMOTION_OUT_OF_STOCK(regularPricePayment[0], regularPricePayment[1]),
    );
    return input;
  },
};

export default InputView;

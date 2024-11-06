import { Console } from '@woowacourse/mission-utils';
import fs from 'fs';
import ProductConverter from '../model/ProductConverter.js';
import { SYSTEM_MESSAGES } from '../constants/constants.js';

const InputView = {
  async readItem() {
    try {
      const input = await Console.readLineAsync(SYSTEM_MESSAGES.ENTER_PRODUCT_AND_QUANTITY);
      return input;
    } catch (error) {
      Console.print(error.message);
      return this.readItem();
    }
  },

  async readProductsFromFile() {
    const products = fs.readFileSync('public/products.md').toString().split('\n');
    return ProductConverter.convertProductsList(products.slice(1, -1));
  },
};

export default InputView;

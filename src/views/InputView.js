import { Console } from '@woowacourse/mission-utils';
import fs from 'fs';
import ProductConverter from '../model/ProductConverter.js';

const InputView = {
  async readItem() {
    const input = await Console.readLineAsync(
      '구매하실 상품명과 수량을 입력해 주세요. (예: [사이다-2],[감자칩-1])',
    );
    return input;
  },

  async readProductsFromFile() {
    const products = fs.readFileSync('public/products.md').toString().split('\n');
    return ProductConverter.convertProductsList(products.slice(1, -1));
  },
};

export default InputView;

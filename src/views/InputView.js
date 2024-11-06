import { Console } from '@woowacourse/mission-utils';
import fs from 'fs';
import Product from '../model/Product.js';

const InputView = {
  async readItem() {
    const input = await Console.readLineAsync(
      '구매하실 상품명과 수량을 입력해 주세요. (예: [사이다-2],[감자칩-1])',
    );
    return input;
  },

  async readProductsFromFile() {
    const products = fs.readFileSync('public/products.md').toString().split('\n');

    return this.convertProductsList(products.slice(1, -1));
  },

  convertProductsList(rawProducts) {
    const products = rawProducts.map((product) => {
      const productInformation = product.split(',');
      if (productInformation[3] === 'null') productInformation[3] = '';

      return new Product({
        name: productInformation[0],
        unitPrice: Number(productInformation[1]),
        stockQuantity: Number(productInformation[2]),
        promotion: productInformation[3],
      });
    });

    return this.outOfStock(products);
  },

  outOfStock(products) {
    products.forEach((product, index) => {
      const information = product.getInformation();
      const nextInformation = products[index + 1].getInformation();

      if (information.name !== nextInformation.name && information.promotion !== '') {
        this.spliceArray(products, index, information);
      }
    });

    return products;
  },

  spliceArray(products, index, information) {
    products.splice(
      index + 1,
      0,
      new Product({
        name: information.name,
        unitPrice: information.unitPrice,
        stockQuantity: 0,
        promotion: '',
      }),
    );
  },
};

export default InputView;

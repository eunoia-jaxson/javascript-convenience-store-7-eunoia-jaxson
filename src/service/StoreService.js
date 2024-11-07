import { DateTimes } from '@woowacourse/mission-utils';
import validator from '../util/validator.js';
import ProductConverter from '../model/ProductConverter.js';

class StoreService {
  #productList;
  #orderList;
  #today;

  constructor() {
    this.#productList = [];
    this.#orderList = [];
    this.#today = DateTimes.now();
  }

  setProductList(products) {
    this.#productList = ProductConverter.convertProductsList(products.slice(1, -1));
  }

  getProductList() {
    return this.#productList;
  }

  setOrderList(orders) {
    this.#orderList = orders;
  }

  validateOrderInput(orderInput) {
    validator.invalidFormat(orderInput);
    const orderList = this.#preprocessingOrderList(orderInput);
    const productNames = this.#productList.map((product) => product.getInformation().name);
    validator.productNotfound(orderList, productNames);
    validator.quantityMoreThanZero(orderList);
    validator.stockExceeded(this.#isStockExceeded(orderList, this.#productList));
    return orderList;
  }

  #preprocessingOrderList(orderInput) {
    return orderInput.split(',').map((rawOrder) => {
      const order = rawOrder.split('-');
      return {
        name: order[0].slice(1),
        quantity: Number(order[1].slice(0, -1)),
      };
    });
  }

  #isStockExceeded = (orderList, productList) =>
    orderList.some((order) => {
      const products = productList.filter(
        (product) => product.getInformation().name === order.name,
      );
      const stock = products.reduce(
        (acc, product) => acc + product.getInformation().stockQuantity,
        0,
      );
      return stock < order.quantity;
    });

  getUnmetPromotionQuantity() {}
}

export default new StoreService();

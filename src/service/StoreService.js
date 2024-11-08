import { DateTimes } from '@woowacourse/mission-utils';
import validator from '../util/validator.js';
import ProductConverter from '../models/ProductConverter.js';
import PromotionConverter from '../models/PromotionConverter.js';
import Product from '../models/Product.js';
import Promotion from '../models/Promotion.js';

class StoreService {
  #productList;
  #orderList;
  #today;
  #promotionList;

  constructor() {
    this.#productList = [];
    this.#orderList = [];
    this.#today = DateTimes.now();
    this.#promotionList = [];
  }

  setProductList(products) {
    this.#productList = ProductConverter.convertProductList(products.slice(1, -1));
  }

  setPromotionList(promotions) {
    this.#promotionList = PromotionConverter.convertPromotionList(
      promotions.slice(1, -1),
      this.#today,
    );
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
    const productNames = this.#productList.map((product) => product.getName());
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
      const products = productList.filter((product) => product.getName() === order.name);
      const stock = products.reduce((acc, product) => acc + product.getStockQuantity(), 0);
      return stock < order.quantity;
    });

  getUnmetPromotionQuantity() {
    return this.#orderList.filter((order) => {
      const orderProduct = Product.findOrderProduct(this.#productList, order.name);
      const productPromotion = Promotion.findProductPromotion(this.#promotionList, orderProduct);
      return (
        order.quantity < orderProduct.getStockQuantity() &&
        order.quantity % (productPromotion.getBuy() + 1) === productPromotion.getBuy()
      );
    });
  }

  async handleIncludeUnmet(includeUnmet, unmetOrder) {
    if (includeUnmet === 'N') return;
    if (includeUnmet === 'Y') {
      this.#orderList.find((order) => order.name === unmetOrder.name).quantity += 1;
      return;
    }
    validator.invalidCharacter();
  }
}

export default new StoreService();

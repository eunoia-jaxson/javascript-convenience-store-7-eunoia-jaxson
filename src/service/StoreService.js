import { DateTimes } from '@woowacourse/mission-utils';
import validator from '../util/validator.js';
import ProductConverter from '../models/ProductConverter.js';
import PromotionConverter from '../models/PromotionConverter.js';

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
    this.#orderList = orders.map((order) => {
      const orderProduct = this.#productList.find((product) => product.name === order.name);
      return {
        name: order.name,
        unitPrice: orderProduct.unitPrice,
        quantity: order.quantity,
        promotion: orderProduct.promotion,
      };
    });
  }

  validateOrderInput(orderInput) {
    validator.invalidFormat(orderInput);
    const orderList = this.#preprocessingOrderList(orderInput);
    const productNames = this.#productList.map((product) => product.name);
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
      const products = productList.filter((product) => product.name === order.name);
      const stock = products.reduce((acc, product) => acc + product.stockQuantity, 0);
      return stock < order.quantity;
    });

  getUnmetPromotionQuantity() {
    return this.#orderList.filter((order) => {
      const [orderProduct, productPromotion] = this.#preprocessingFilter(order.name);
      if (orderProduct === null) return false;
      return (
        order.quantity < orderProduct.stockQuantity &&
        order.quantity % (productPromotion.buy + 1) === productPromotion.buy
      );
    });
  }

  #preprocessingFilter(orderName) {
    const orderProduct = this.#productList.find(
      (product) => product.promotion !== '' && product.name === orderName,
    );
    if (orderProduct === undefined) return [null];
    const productPromotion = this.#promotionList.find(
      (promotion) => promotion.name === orderProduct.promotion,
    );
    return [orderProduct, productPromotion];
  }

  async handleIncludeUnmet(includeUnmet, unmetOrder) {
    if (includeUnmet === 'N') return;
    if (includeUnmet === 'Y') {
      this.#orderList.find((order) => order.name === unmetOrder.name).quantity += 1;
      return;
    }
    validator.invalidCharacter();
  }

  getRegularPricePaymentProducts() {
    const regularPricePaymentProducts = this.#orderList.filter((order) => {
      const [orderProduct, productPromotion] = this.#preprocessingFilter(order.name);
      if (orderProduct === null) return false;
      return (
        order.quantity / (productPromotion.buy + 1) >
        Math.floor(orderProduct.stockQuantity / (productPromotion.buy + 1))
      );
    });
    return this.regularPricePayment(regularPricePaymentProducts);
  }

  regularPricePayment(regularPricePaymentProducts) {
    return regularPricePaymentProducts.map((order) => {
      const [orderProduct, productPromotion] = this.#preprocessingFilter(order.name);
      if (orderProduct === null) return false;
      const regularPriceAmount =
        order.quantity -
        (orderProduct.stockQuantity - (orderProduct.stockQuantity % (productPromotion.buy + 1)));
      return [order.name, regularPriceAmount];
    });
  }

  async handleRegularPricePayment(regularPricePayment, regularPricePaymentProducts) {
    if (regularPricePayment === 'Y') return;
    if (regularPricePayment === 'N') {
      this.#orderList.find((order) => order.name === regularPricePaymentProducts[0]).quantity -=
        regularPricePaymentProducts[1];
      return;
    }
    validator.invalidCharacter();
  }
}

export default new StoreService();

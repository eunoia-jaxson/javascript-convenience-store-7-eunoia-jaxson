import { DateTimes } from '@woowacourse/mission-utils';
import validator from '../util/validator.js';
import ProductConverter from '../models/ProductConverter.js';
import PromotionConverter from '../models/PromotionConverter.js';
import OrderProduct from '../models/OrderProduct.js';

class StoreService {
  #products;
  #orders;
  #promotions;
  #membershipDiscount;

  constructor() {
    this.#products = [];
    this.#orders = [];
    this.#promotions = [];
    this.#membershipDiscount = 0;
  }

  setProductList(products) {
    this.#products = ProductConverter.convertProductList(products.slice(1, -1));
  }

  setPromotionList(promotions) {
    this.#promotions = PromotionConverter.convertPromotionList(
      promotions.slice(1, -1),
      DateTimes.now(),
    );
  }

  getProductList() {
    return this.#products;
  }

  getOrderList() {
    return ProductConverter.convertOrderProduct(this.#orders);
  }

  setOrderList(orders) {
    this.#orders = orders.map((order) => {
      const product = this.#products.find((item) => item.name === order.name);
      return new OrderProduct(order.name, product.unitPrice, order.quantity, product.promotion);
    });
  }

  validateOrderInput(orderInput) {
    validator.invalidFormat(orderInput);
    const orders = this.#preprocessingOrderList(orderInput);
    const productNames = this.#products.map((product) => product.name);
    validator.productNotFound(orders, productNames);
    validator.duplicateProduct(orders.map((order) => order.name));
    validator.quantityMoreThanZero(orders);
    validator.stockExceeded(this.#isStockExceeded(orders, this.#products));
    return orders;
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

  #isStockExceeded = (orders, productList) =>
    orders.some((order) => {
      const products = productList.filter((product) => product.name === order.name);
      const stock = products.reduce((acc, product) => acc + product.stockQuantity, 0);
      return stock < order.quantity;
    });

  getUnmetPromotionQuantity() {
    return this.#orders.filter((order) => {
      const product = order.preprocessingFilterProduct(this.#products);
      if (product === null) return false;
      const promotion = order.preprocessingFilterPromotion(this.#promotions, product);
      if (promotion === null) return false;
      order.setPromotionQuantity(product.stockQuantity, promotion.buy);
      return this.#unmetCondition(order.getQuantity(), product.stockQuantity, promotion.buy);
    });
  }

  #unmetCondition(quantity, stockQuantity, buy) {
    return quantity < stockQuantity && quantity % (buy + 1) === buy;
  }

  async handleIncludeUnmet(includeUnmet, unmetOrderName) {
    validator.invalidCharacter(includeUnmet);
    if (includeUnmet === 'N') return;
    if (includeUnmet === 'Y') {
      this.#orders.find((order) => order.getName() === unmetOrderName).givePromotionQuantity();
    }
  }

  getRegularPricePaymentProducts() {
    const regularPricePaymentProducts = this.#filteredOrders();
    this.#regularPricePayment(regularPricePaymentProducts);
    return regularPricePaymentProducts;
  }

  #filteredOrders() {
    return this.#orders.filter((order) => {
      const product = order.preprocessingFilterProduct(this.#products);
      if (product === null) return false;
      const promotion = order.preprocessingFilterPromotion(this.#promotions, product);
      if (promotion === null) return false;
      return this.#condition(order, product.stockQuantity, promotion.buy);
    });
  }

  #condition(order, stockQuantity, buy) {
    return (
      Math.floor(order.getQuantity() / (buy + 1)) > Math.floor(stockQuantity / (buy + 1)) ||
      (Math.floor(order.getQuantity() / (buy + 1)) === Math.floor(stockQuantity / (buy + 1)) &&
        order.getQuantity() % (buy + 1) !== 0)
    );
  }

  #regularPricePayment(regularPricePaymentProducts) {
    regularPricePaymentProducts.forEach((order) => {
      const product = order.preprocessingFilterProduct(this.#products);
      const promotion = order.preprocessingFilterPromotion(this.#promotions, product);
      if (product !== null && promotion !== null) {
        order.setRegularPriceQuantity(product.stockQuantity, promotion.buy);
      }
    });
  }

  async handleRegularPricePayment(regularPricePayment, regularPricePaymentProduct) {
    validator.invalidCharacter(regularPricePayment);
    this.#removeRegularPriceQuantity(regularPricePaymentProduct);
    if (regularPricePayment === 'N') return;
    if (regularPricePayment === 'Y') {
      this.#orders.push(regularPricePaymentProduct.createRegularProduct());
      this.#orders.sort((a, b) => a.getName() - b.getName());
    }
  }

  #removeRegularPriceQuantity(regularPricePaymentProduct) {
    this.#orders
      .find((order) => order.getName() === regularPricePaymentProduct.getName())
      .removeRegularPriceQuantity(regularPricePaymentProduct);
  }

  handleMembershipApply(isMembershipApplied) {
    validator.invalidCharacter(isMembershipApplied);
    if (isMembershipApplied === 'N') return;
    if (isMembershipApplied === 'Y') {
      this.#membershipDiscount = this.#calculateMembershipDiscount();
    }
  }

  #calculateMembershipDiscount() {
    let discount =
      this.#orders
        .filter((order) => order.getPromotion() === '')
        .reduce((acc, order) => acc + order.getTotalPrice(), 0) * 0.3;
    if (discount > 8000) discount = 8000;
    return discount;
  }

  getMembershipDiscount() {
    return this.#membershipDiscount;
  }

  getTotalCount() {
    return this.#orders.reduce((acc, order) => acc + order.getQuantity(), 0);
  }

  getTotalPrice() {
    return this.#orders.reduce((acc, order) => acc + order.getTotalPrice(), 0);
  }

  getPromotionPrice() {
    return this.#orders.reduce((acc, order) => acc + order.getPromotionPrice(), 0);
  }

  validateRepurchase(purchase) {
    validator.invalidCharacter(purchase);
    this.#membershipDiscount = 0;
    return purchase;
  }

  // productsStock() {
  //   this.#productsStockUpdate();
  //   return ProductConverter.convertProductStock(this.#products);
  // }

  productsStockUpdate() {
    this.#orders.forEach((order) => {
      const filteredProducts = this.#products.filter((product) => product.name === order.getName());
      filteredProducts[0].stockQuantity -= order.getQuantity();
      if (filteredProducts[0].stockQuantity < 0) {
        filteredProducts[1].stockQuantity += filteredProducts[0].stockQuantity;
        filteredProducts[0].stockQuantity -= filteredProducts[0].stockQuantity;
      }
    });
  }
}

export default new StoreService();

class OrderProduct {
  #name;
  #unitPrice;
  #quantity;
  #promotion;
  #promotionQuantity;
  #regularPriceQuantity;

  // eslint-disable-next-line max-params
  constructor(name, unitPrice, quantity, promotion) {
    this.#name = name;
    this.#unitPrice = unitPrice;
    this.#quantity = quantity;
    this.#promotion = promotion;
    this.#promotionQuantity = 0;
    this.#regularPriceQuantity = 0;
  }

  toString() {
    return `- ${this.#name} ${this.#unitPrice.toLocaleString()}원 ${this.#quantity.toLocaleString()}개 ${this.#promotion}`;
  }

  getName() {
    return this.#name;
  }

  getQuantity() {
    return this.#quantity;
  }

  getPromotion() {
    return this.#promotion;
  }

  getPromotionQuantity() {
    return this.#promotionQuantity;
  }

  getRegularPriceQuantity() {
    return this.#regularPriceQuantity;
  }

  getTotalPrice() {
    return this.#quantity * this.#unitPrice;
  }

  setPromotionQuantity(buy) {
    this.#promotionQuantity = Math.floor(this.#quantity / (buy + 1));
  }

  setRegularPriceQuantity(stockQuantity, buy) {
    this.#regularPriceQuantity = this.#quantity - (stockQuantity - (stockQuantity % (buy + 1)));
  }

  givePromotionQuantity() {
    this.#quantity += 1;
    this.#promotionQuantity += 1;
  }

  removeRegularPriceQuantity() {
    this.#quantity -= this.#regularPriceQuantity;
  }

  preprocessingFilter(products, promotions) {
    const orderProduct = products.find(
      (product) => product.promotion !== '' && product.name === this.#name,
    );
    if (orderProduct === undefined) return [null];
    const productPromotion = promotions.find(
      (promotion) => promotion.name === orderProduct.promotion,
    );
    return [orderProduct, productPromotion];
  }

  createRegularProduct() {
    return new OrderProduct(this.#name, this.#unitPrice, this.#regularPriceQuantity, '');
  }
}

export default OrderProduct;

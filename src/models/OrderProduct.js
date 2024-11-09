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

  getName() {
    return this.#name;
  }

  getQuantity() {
    return this.#quantity;
  }

  setQuantity(quantity) {
    this.#quantity += quantity;
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

  getPromotionPrice() {
    return this.#promotionQuantity * this.#unitPrice;
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

  preprocessingFilterProduct(products) {
    const orderProduct = products.find(
      (product) => product.promotion !== '' && product.name === this.#name,
    );
    if (orderProduct === undefined) return null;
    return orderProduct;
  }

  preprocessingFilterPromotion(promotions, orderProduct) {
    const productPromotion = promotions.find(
      (promotion) => promotion.name === orderProduct.promotion,
    );
    if (productPromotion === undefined) return null;
    return productPromotion;
  }

  createRegularProduct() {
    return new OrderProduct(this.#name, this.#unitPrice, this.#regularPriceQuantity, '');
  }
}

export default OrderProduct;

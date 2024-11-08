class Product {
  #name;
  #unitPrice;
  #stockQuantity;
  #promotion;

  // eslint-disable-next-line max-params
  constructor(name, unitPrice, stockQuantity, promotion) {
    this.#name = name;
    this.#unitPrice = unitPrice;
    this.#stockQuantity = stockQuantity;
    this.#promotion = promotion;
  }

  getName() {
    return this.#name;
  }

  getUnitPrice() {
    return this.#unitPrice;
  }

  getStockQuantity() {
    return this.#stockQuantity;
  }

  getPromotion() {
    return this.#promotion;
  }

  toString() {
    if (this.#stockQuantity === 0) {
      return `- ${this.#name} ${this.#unitPrice.toLocaleString()}원 재고 없음 ${this.#promotion}`;
    }
    return `- ${this.#name} ${this.#unitPrice.toLocaleString()}원 ${this.#stockQuantity.toLocaleString()}개 ${this.#promotion}`;
  }

  static findOrderProduct(productList, orderName) {
    return productList.find((product) => product.#promotion !== '' && product.#name === orderName);
  }
}

export default Product;

class Product {
  #information;

  constructor(information) {
    this.#information = information;
  }

  getInformation() {
    return this.#information;
  }

  toString() {
    const { name, unitPrice, stockQuantity, promotion } = this.#information;
    if (stockQuantity === 0) {
      return `- ${name} ${unitPrice.toLocaleString()}원 재고 없음 ${promotion}`;
    }
    return `- ${name} ${unitPrice.toLocaleString()}원 ${stockQuantity.toLocaleString()}개 ${promotion}`;
  }
}

export default Product;

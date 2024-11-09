class ProductConverter {
  convertProductList(rawProducts) {
    const products = rawProducts.map((product) => {
      const [name, unitPrice, stockQuantity, promotion] = product.split(',');
      if (promotion === 'null') {
        return this.#product(name, unitPrice, stockQuantity, '');
      }
      return this.#product(name, unitPrice, stockQuantity, promotion);
    });
    return this.#outOfStock(products);
  }

  #product(name, unitPrice, stockQuantity, promotion) {
    return {
      name,
      unitPrice: Number(unitPrice),
      stockQuantity: Number(stockQuantity),
      promotion,
    };
  }

  #outOfStock(products) {
    products.forEach((product, index) => {
      if (this.#condition(products, index, product)) {
        this.#spliceArray(products, index, product);
      }
    });
    return products;
  }

  #condition(products, index, product) {
    return (
      products[index + 1] && product.name !== products[index + 1].name && product.promotion !== ''
    );
  }

  #spliceArray(products, index, product) {
    products.splice(index + 1, 0, {
      name: product.name,
      unitPrice: product.unitPrice,
      stockQuantity: 0,
      promotion: '',
    });
  }
}

export default new ProductConverter();

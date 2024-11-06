// ProductConverter.js
import Product from './Product.js';

class ProductConverter {
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
  }

  outOfStock(products) {
    products.forEach((product, index) => {
      const information = product.getInformation();
      const nextInformation = products[index + 1]?.getInformation();

      if (
        nextInformation &&
        information.name !== nextInformation.name &&
        information.promotion !== ''
      ) {
        this.spliceArray(products, index, information);
      }
    });
    return products;
  }

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
  }
}

export default new ProductConverter();

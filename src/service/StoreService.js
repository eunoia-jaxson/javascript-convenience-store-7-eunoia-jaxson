import validator from '../util/validator.js';

class StoreService {
  validateOrderInput(orderInput, productList) {
    validator.invalidFormat(orderInput);
    const orderList = this.preprocessingOrderList(orderInput);

    const productNames = productList.map((product) => product.getInformation().name);
    validator.productNotfound(orderList, productNames);
    validator.stockExceeded(this.#isStockExceeded(orderList, productList));
    return orderList;
  }

  preprocessingOrderList(orderInput) {
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
}

export default new StoreService();

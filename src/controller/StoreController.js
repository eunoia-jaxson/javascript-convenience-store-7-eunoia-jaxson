import InputView from '../views/InputView.js';
import OutputView from '../views/OutputView.js';
import StoreService from '../service/StoreService.js';

class StoreController {
  async start() {
    OutputView.welcome();
    StoreService.setProductList(await InputView.readProductsFromFile());
    OutputView.printProducts(StoreService.getProductList());
    await this.#enterInputs();
  }

  async #enterInputs() {
    await this.#enterOrder();
    await this.#enterIncludeUnmetPromotionQuantity();
  }

  async #enterOrder() {
    try {
      const orderInput = await InputView.readItem();
      const orderList = StoreService.validateOrderInput(orderInput);
      StoreService.setOrderList(orderList);
    } catch (error) {
      OutputView.print(error.message);
      await this.#enterOrder();
    }
  }

  async #enterIncludeUnmetPromotionQuantity() {
    try {
      StoreService.getUnmetPromotionQuantity();
    } catch (error) {
      OutputView.print(error.message);
      await this.#enterIncludeUnmetPromotionQuantity();
    }
  }
}

export default new StoreController();

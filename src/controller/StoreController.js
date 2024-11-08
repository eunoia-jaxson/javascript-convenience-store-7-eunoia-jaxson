import InputView from '../views/InputView.js';
import OutputView from '../views/OutputView.js';
import StoreService from '../service/StoreService.js';

class StoreController {
  async start() {
    OutputView.welcome();
    StoreService.setProductList(await InputView.readProductsFromFile());
    StoreService.setPromotionList(await InputView.readPromotionsFromFile());
    OutputView.printProducts(StoreService.getProductList());
    await this.#enterInputs();
  }

  async #enterInputs() {
    await this.#enterOrder();
    await this.enterIncludeUnmetPromotionQuantity();
  }

  async #enterOrder() {
    try {
      const orderInput = await InputView.readItem();
      const orderList = StoreService.validateOrderInput(orderInput);
      StoreService.setOrderList(orderList);
    } catch (error) {
      OutputView.print(error.message);
      this.#enterOrder();
    }
  }

  async enterIncludeUnmetPromotionQuantity() {
    try {
      const unmetPromotionQuantitys = StoreService.getUnmetPromotionQuantity();
      for (let i = 0; i < unmetPromotionQuantitys.length; i++) {
        const includeUnmet = await InputView.readIncludeUnmetPromotionQuantity(
          unmetPromotionQuantitys[i].name,
        );
        await StoreService.handleIncludeUnmet(includeUnmet, unmetPromotionQuantitys[i]);
      }
    } catch (error) {
      OutputView.print(error.message);
      this.enterIncludeUnmetPromotionQuantity();
    }
  }
}

export default new StoreController();

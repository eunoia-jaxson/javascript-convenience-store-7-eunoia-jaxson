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
    await this.confirmIncludeUnmetPromotionQuantity();
    await this.confirmRegularPricePayment();
    OutputView.printOrders(StoreService.getOrderList());
  }

  async #enterOrder() {
    while (true) {
      try {
        StoreService.setOrderList(StoreService.validateOrderInput(await InputView.readItem()));
        break; // 성공 시 루프 종료
      } catch (error) {
        OutputView.print(error.message); // 에러 발생 시 메시지 출력 후 반복
      }
    }
  }

  async confirmIncludeUnmetPromotionQuantity() {
    while (true) {
      try {
        await this.#iterationUnmetPromotions(StoreService.getUnmetPromotionQuantity());
        break;
      } catch (error) {
        OutputView.print(error.message);
      }
    }
  }

  async #iterationUnmetPromotions(unmetPromotionQuantitys) {
    for (let i = 0; i < unmetPromotionQuantitys.length; i++) {
      const includeUnmet = await InputView.readIncludeUnmetPromotionQuantity(
        unmetPromotionQuantitys[i].getName(),
      );
      await StoreService.handleIncludeUnmet(includeUnmet, unmetPromotionQuantitys[i].getName());
    }
  }

  async confirmRegularPricePayment() {
    while (true) {
      try {
        await this.#iterationRegularPricePayment(StoreService.getRegularPricePaymentProducts());
        break;
      } catch (error) {
        OutputView.print(error.message);
      }
    }
  }

  async #iterationRegularPricePayment(regularPriceProducts) {
    for (let i = 0; i < regularPriceProducts.length; i++) {
      const regularPricePayment = await InputView.readRegularPricePayment(
        regularPriceProducts[i].getName(),
        regularPriceProducts[i].getRegularPriceQuantity(),
      );
      await StoreService.handleRegularPricePayment(regularPricePayment, regularPriceProducts[i]);
    }
  }
}

export default new StoreController();

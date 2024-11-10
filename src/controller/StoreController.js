import InputView from '../views/InputView.js';
import OutputView from '../views/OutputView.js';
import StoreService from '../service/StoreService.js';

class StoreController {
  async start() {
    let purchase = 'Y';
    StoreService.setProductList(await InputView.readProductsFromFile());
    StoreService.setPromotionList(await InputView.readPromotionsFromFile());
    while (purchase === 'Y') {
      await this.#mainFlow();
      purchase = await this.#enterRepurchase();
      OutputView.print('');
    }
  }

  async #mainFlow() {
    OutputView.welcome();
    OutputView.printProducts(StoreService.getProductList());
    await this.#enterInputs();
    this.#printReceipt();
    StoreService.productsStockUpdate();
  }

  async #enterInputs() {
    await this.#enterOrder();
    await this.confirmIncludeUnmetPromotionQuantity();
    await this.confirmRegularPricePayment();
    await this.confirmMembership();
  }

  async #enterOrder() {
    try {
      const orderInput = await InputView.readItem();
      StoreService.setOrderList(StoreService.validateOrderInput(orderInput));
      return null;
    } catch (error) {
      OutputView.print(error.message);
      return this.#enterOrder();
    }
  }

  async confirmIncludeUnmetPromotionQuantity() {
    try {
      const unmetPromotionQuantitys = StoreService.getUnmetPromotionQuantity();
      await this.#iterationUnmetPromotions(unmetPromotionQuantitys);
      return null;
    } catch (error) {
      OutputView.print(error.message);
      return this.confirmIncludeUnmetPromotionQuantity();
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
    try {
      const regularPriceProducts = StoreService.getRegularPricePaymentProducts();
      await this.#iterationRegularPricePayment(regularPriceProducts);
      return null;
    } catch (error) {
      OutputView.print(error.message);
      return this.confirmRegularPricePayment();
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

  async confirmMembership() {
    try {
      const isMembershipApplied = await InputView.readMembershipApply();
      StoreService.handleMembershipApply(isMembershipApplied);
      return null;
    } catch (error) {
      OutputView.print(error.message);
      return this.confirmMembership();
    }
  }

  #printReceipt() {
    OutputView.printReceipt(
      StoreService.getOrderList(),
      StoreService.getTotalCount(),
      StoreService.getTotalPrice(),
      StoreService.getPromotionPrice(),
      StoreService.getMembershipDiscount(),
    );
  }

  async #enterRepurchase() {
    try {
      const purchase = await InputView.readRetry();
      return StoreService.validateRepurchase(purchase);
    } catch (error) {
      OutputView.print(error.message);
      return this.#enterRepurchase();
    }
  }
}

export default new StoreController();

import InputView from '../views/InputView.js';
import OutputView from '../views/OutputView.js';
import StoreService from '../service/StoreService.js';

class StoreController {
  #productList;
  #orderList;

  constructor() {
    this.#productList = [];
    this.#orderList = [];
  }

  async start() {
    OutputView.welcome();
    this.#productList = await InputView.readProductsFromFile();
    OutputView.printProducts(this.#productList);
    await this.#enterInputs();
  }

  async #enterInputs() {
    try {
      const orderInput = await InputView.readItem();
      this.#orderList = StoreService.validateOrderInput(orderInput, this.#productList);
    } catch (error) {
      OutputView.print(error.message);
      await this.#enterInputs();
    }
  }
}

export default new StoreController();

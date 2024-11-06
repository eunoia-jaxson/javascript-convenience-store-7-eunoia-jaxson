import InputView from '../views/InputView.js';
import OutputView from '../views/OutputView.js';

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
    this.#orderList = await InputView.readItem();
  }
}

export default StoreController;

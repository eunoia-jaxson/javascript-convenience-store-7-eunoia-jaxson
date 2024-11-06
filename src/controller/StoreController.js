import InputView from '../views/InputView.js';
import OutputView from '../views/OutputView.js';

class StoreController {
  #productsList;

  constructor() {
    this.#productsList = [];
  }

  async start() {
    OutputView.welcome();
    this.#productsList = await InputView.readProductsFromFile();
    OutputView.printProducts(this.#productsList);
  }
}

export default StoreController;

import StoreController from './controller/StoreController.js';

class App {
  async run() {
    await StoreController.start();
  }
}

export default App;

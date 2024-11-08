class Promotion {
  #name;
  #buy;
  #get;
  #startDate;
  #endDate;

  // eslint-disable-next-line max-params
  constructor(name, buy, get, startDate, endDate) {
    this.#name = name;
    this.#buy = buy;
    this.#get = get;
    this.#startDate = startDate;
    this.#endDate = endDate;
  }

  getName() {
    return this.#name;
  }

  getGet() {
    return this.#get;
  }

  getBuy() {
    return this.#buy;
  }

  getStartDate() {
    return this.#startDate;
  }

  getEndDate() {
    return this.#endDate;
  }

  static findProductPromotion(promotionList, orderProduct) {
    return promotionList.find((promotion) => promotion.#name === orderProduct.getPromotion());
  }
}

export default Promotion;

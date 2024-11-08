import Promotion from './Promotion.js';

class PromotionConverter {
  convertPromotionList(rawPromotions, today) {
    const promotions = rawPromotions.map((promotion) => {
      const [name, buy, get, startDate, endDate] = promotion.split(',');
      return new Promotion(name, Number(buy), Number(get), new Date(startDate), new Date(endDate));
    });

    return this.#filterPromotion(promotions, today);
  }

  #filterPromotion(promotions, today) {
    return promotions.filter(
      (promotion) =>
        today >= promotion.getStartDate() &&
        today <= promotion.getEndDate() &&
        promotion.getGet() === 1,
    );
  }
}

export default new PromotionConverter();

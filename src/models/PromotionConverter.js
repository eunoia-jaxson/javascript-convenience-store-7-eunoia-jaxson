class PromotionConverter {
  convertPromotionList(rawPromotions, today) {
    const promotions = rawPromotions.map((promotion) => {
      const [name, buy, get, startDate, endDate] = promotion.split(',');
      return {
        name,
        buy: Number(buy),
        get: Number(get),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      };
    });

    return this.#filterPromotion(promotions, today);
  }

  #filterPromotion(promotions, today) {
    return promotions.filter(
      (promotion) => today >= promotion.startDate && today <= promotion.endDate,
    );
  }
}

export default new PromotionConverter();

const ERROR_PREFIX = Object.freeze('[ERROR]');

const ERROR_MESSAGES = Object.freeze({
  INVALID_FORMAT: `${ERROR_PREFIX} 올바르지 않은 형식으로 입력했습니다. 다시 입력해 주세요.`,
  PRODUCT_NOT_FOUND: `${ERROR_PREFIX} 존재하지 않는 상품입니다. 다시 입력해 주세요.`,
  STOCK_EXCEEDED: `${ERROR_PREFIX} 재고 수량을 초과하여 구매할 수 없습니다. 다시 입력해 주세요.`,
  INVALID_INPUT: `${ERROR_PREFIX} 잘못된 입력입니다. 다시 입력해 주세요.`,
});

const SYSTEM_MESSAGES = Object.freeze({
  WELCOME: '안녕하세요. W편의점입니다.',
  AVAILABLE_PRODUCTS: '현재 보유하고 있는 상품입니다.\n',
  ENTER_PRODUCT_AND_QUANTITY:
    '\n구매하실 상품명과 수량을 입력해 주세요. (예: [사이다-2],[감자칩-1])\n',
  MEMBERSHIP_DISCOUNT: '\n멤버십 할인을 받으시겠습니까? (Y/N)\n',
  ADDITIONAL_PURCHASE: '\n감사합니다. 구매하고 싶은 다른 상품이 있나요? (Y/N)\n',
  PROMOTION_ELIGIBILITY: (product) =>
    `\n현재 ${product}은(는) 1개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)\n`,
  PROMOTION_OUT_OF_STOCK: (product, quantity) =>
    `\n현재 ${product} ${quantity}개는 프로모션 할인이 적용되지 않습니다. 그래도 구매하시겠습니까? (Y/N)\n`,
});

const RECEIPT = Object.freeze({
  HEADER: '\n===========W 편의점===========',
  PRODUCT_LIST_TITLE: '상품명\t\t수량\t금액',
  PRODUCT: (product, quantity, price) =>
    `${product}\t\t${quantity.toLocaleString()}\t${price.toLocaleString()}`,
  PRODUCT_LONG: (product, quantity, price) =>
    `${product}\t${quantity.toLocaleString()}\t${price.toLocaleString()}`,
  GIFT_HEADER: '===========증\t정============',
  GIFT: (product, quantity) => `${product}\t\t${quantity.toLocaleString()}`,
  GIFT_LONG: (product, quantity) => `${product}\t${quantity.toLocaleString()}`,
  FOOTER: '==============================',
  TOTAL_PURCHASE: (quantity, price) =>
    `총구매액\t${quantity.toLocaleString()}\t${price.toLocaleString()}`,
  EVENT_DISCOUNT: (price) => `행사할인\t\t-${price.toLocaleString()}`,
  MEMBERSHIP_DISCOUNT: (price) => `멤버십할인\t\t-${price.toLocaleString()}`,
  FINAL_AMOUNT: (price) => `내실돈\t\t\t${price.toLocaleString()}`,
});

export { ERROR_MESSAGES, SYSTEM_MESSAGES, RECEIPT };

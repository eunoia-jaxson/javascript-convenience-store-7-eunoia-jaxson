import StoreService from '../src/service/StoreService.js';
import { ERROR_MESSAGES } from '../src/constants/constants.js';

describe('사용자 구매 목록 유효성 검사', () => {
  let products;

  beforeEach(() => {
    // 테스트에 사용할 기본 products
    products = [
      '더미,0,0,null', // 앞에 더미 데이터
      '사이다,1000,5,null', // 실제 데이터
      '감자칩,1500,10,null', // 실제 데이터
      '더미,0,0,null', // 뒤에 더미 데이터
    ];

    // StoreService에 products 설정
    StoreService.setProductList(products);
  });

  test.each([
    {
      orderInput: '[사이다-2],[감자칩-1]',
      expectedOrderList: [
        { name: '사이다', quantity: 2 },
        { name: '감자칩', quantity: 1 },
      ],
      error: null,
    },
    {
      orderInput: '사이다-2, 감자칩-1', // 잘못된 포맷 (대괄호 없음)
      expectedOrderList: null,
      error: ERROR_MESSAGES.INVALID_FORMAT,
    },
    {
      orderInput: '[콜라-1]', // 존재하지 않는 상품
      expectedOrderList: null,
      error: ERROR_MESSAGES.PRODUCT_NOT_FOUND,
    },
    {
      orderInput: '[사이다-10]', // 재고 초과 주문
      expectedOrderList: null,
      error: ERROR_MESSAGES.STOCK_EXCEEDED,
    },
    {
      orderInput: '[사이다-0]', // 수량이 0인 경우
      expectedOrderList: null,
      error: ERROR_MESSAGES.INVALID_INPUT, // 가정: INVALID_QUANTITY 메시지 존재
    },
  ])('주문 입력 유효성 검사 - $orderInput', ({ orderInput, expectedOrderList, error }) => {
    if (error) {
      expect(() => {
        StoreService.validateOrderInput(orderInput);
      }).toThrow(error);
    } else {
      const orders = StoreService.validateOrderInput(orderInput);
      expect(orders).toEqual(expectedOrderList);
    }
  });
});

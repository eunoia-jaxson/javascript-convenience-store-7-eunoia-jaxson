import StoreService from '../src/service/StoreService.js';
import { ERROR_MESSAGES } from '../src/constants/constants.js';

describe('사용자 구매 목록 유효성 검사', () => {
  let productList;

  beforeEach(() => {
    // 테스트에 사용할 기본 productList
    productList = [
      {
        getInformation: () => ({ name: '사이다', stockQuantity: 5 }),
      },
      {
        getInformation: () => ({ name: '감자칩', stockQuantity: 10 }),
      },
    ];
  });

  test('올바른 인풋에 대해서 구매 목록 리스트를 생성한다.', () => {
    const orderInput = '[사이다-2],[감자칩-1]';
    const orderList = StoreService.validateOrderInput(orderInput, productList);

    expect(orderList).toEqual([
      { name: '사이다', quantity: 2 },
      { name: '감자칩', quantity: 1 },
    ]);
  });

  test('잘못된 포맷으로 입력할 경우 예외가 발생한다.', () => {
    const orderInput = '사이다-2, 감자칩-1'; // 잘못된 포맷 (대괄호 없음)

    expect(() => {
      StoreService.validateOrderInput(orderInput, productList);
    }).toThrow(ERROR_MESSAGES.INVALID_FORMAT);
  });

  test('재고 목록에 없는 상품을 입력한 경우 예외가 발생한다.', () => {
    const orderInput = '[콜라-1]'; // 존재하지 않는 상품

    expect(() => {
      StoreService.validateOrderInput(orderInput, productList);
    }).toThrow(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
  });

  test('재고를 초과한 구매의 경우 예외가 발생한다.', () => {
    const orderInput = '[사이다-10]'; // 재고 초과 주문

    expect(() => {
      StoreService.validateOrderInput(orderInput, productList);
    }).toThrow(ERROR_MESSAGES.STOCK_EXCEEDED);
  });
});

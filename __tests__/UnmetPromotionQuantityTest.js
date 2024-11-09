import StoreController from '../src/controller/StoreController.js';
import InputView from '../src/views/InputView.js';
import StoreService from '../src/service/StoreService.js';
import OrderProduct from '../src/models/OrderProduct.js'; // OrderProduct 클래스를 가져옴

jest.mock('../src/views/InputView.js');
jest.mock('../src/service/StoreService.js');

describe('StoreController - confirmIncludeUnmetPromotionQuantity', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test.each([
    {
      unmetPromotions: [new OrderProduct('사이다', 1000, 2, '탄산2+1')],
      userResponses: ['Y'],
      description: '사용자가 추가 프로모션 수량을 포함시키는 경우, 추가한다.',
    },
    {
      unmetPromotions: [
        new OrderProduct('초코바', 1500, 3, 'MD추천상품'),
        new OrderProduct('사이다', 1000, 2, '탄산2+1'),
      ],
      userResponses: ['N', 'Y'],
      description:
        '첫 번째 프로모션은 포함하지 않고 두 번째 프로모션은 포함시키는 경우, 첫 번째 프로모션은 추가하지 않고 두 번째 프로모션만 추가한다.',
    },
    {
      unmetPromotions: [],
      userResponses: [],
      description: '부합하지 않는 프로모션 항목이 없을 때, 추가하지 않는다.',
    },
  ])('$description', async ({ unmetPromotions, userResponses }) => {
    // Mock unmet promotions returned from StoreService
    StoreService.getUnmetPromotionQuantity.mockReturnValue(unmetPromotions);

    // Mock user responses
    userResponses.forEach((response) => {
      InputView.readIncludeUnmetPromotionQuantity.mockResolvedValueOnce(response);
    });

    await StoreController.confirmIncludeUnmetPromotionQuantity();

    // Check that the correct number of calls were made
    expect(InputView.readIncludeUnmetPromotionQuantity).toHaveBeenCalledTimes(
      unmetPromotions.length,
    );

    expect(StoreService.handleIncludeUnmet).toHaveBeenCalledTimes(userResponses.length);
  });

  test('프로모션 처리 중 오류 발생 시 재시도한다.', async () => {
    const unmetPromotions = [new OrderProduct('사이다', 1000, 2, '탄산2+1')];
    StoreService.getUnmetPromotionQuantity.mockReturnValue(unmetPromotions);

    // Mock an error during processing
    InputView.readIncludeUnmetPromotionQuantity.mockRejectedValueOnce(new Error('Test error'));
    InputView.readIncludeUnmetPromotionQuantity.mockRejectedValueOnce(new Error('Test error'));

    // Mock successful retry input
    InputView.readIncludeUnmetPromotionQuantity.mockResolvedValueOnce('Y');

    await StoreController.confirmIncludeUnmetPromotionQuantity();

    // Check that it retried the input after error
    expect(InputView.readIncludeUnmetPromotionQuantity).toHaveBeenCalledTimes(3);
    expect(StoreService.handleIncludeUnmet).toHaveBeenCalledTimes(1);
  });
});

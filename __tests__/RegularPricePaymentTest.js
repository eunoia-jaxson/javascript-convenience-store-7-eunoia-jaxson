import StoreController from '../src/controller/StoreController.js';
import InputView from '../src/views/InputView.js';
import StoreService from '../src/service/StoreService.js';
import OrderProduct from '../src/models/OrderProduct.js'; // OrderProduct 클래스를 가져옴

jest.mock('../src/views/InputView.js');
jest.mock('../src/service/StoreService.js');

describe('StoreController - confirmRegularPricePayment', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test.each([
    {
      regularPriceProducts: [new OrderProduct('사이다', 1000, 8, '탄산2+1')],
      userResponses: ['Y'],
      description: '사용자가 정가 결제를 수락하는 경우, 정가 결제한다.',
    },
    {
      regularPriceProducts: [
        new OrderProduct('콜라', 1200, 12, '탄산2+1'),
        new OrderProduct('사이다', 1000, 7, '탄산2+1'),
      ],
      userResponses: ['N', 'Y'],
      description:
        '첫 번째 제품의 정가 결제를 거부하고 두 번째 제품의 정가 결제를 수락하는 경우, 첫 번째는 초과한 상품을 제외하고 두 번째는 정가 결제한다.',
    },
    {
      regularPriceProducts: [],
      userResponses: [],
      description: '정가로 결제할 제품이 없는 경우, 그대로 진행한다.',
    },
  ])('$description', async ({ regularPriceProducts, userResponses }) => {
    // Mock regular price products returned from StoreService
    StoreService.getRegularPricePaymentProducts.mockReturnValue(regularPriceProducts);

    // Mock user responses
    userResponses.forEach((response) => {
      InputView.readRegularPricePayment.mockResolvedValueOnce(response);
    });

    await StoreController.confirmRegularPricePayment();

    // Check that the correct number of calls were made
    expect(InputView.readRegularPricePayment).toHaveBeenCalledTimes(regularPriceProducts.length);

    expect(StoreService.handleRegularPricePayment).toHaveBeenCalledTimes(userResponses.length);
  });

  test('정가 결제 처리 중 오류 발생 시 재시도한다.', async () => {
    const regularPriceProducts = [new OrderProduct('사이다', 1000, 9, '탄산2+1')];
    StoreService.getRegularPricePaymentProducts.mockReturnValue(regularPriceProducts);

    // Mock an error during processing
    InputView.readRegularPricePayment.mockRejectedValueOnce(new Error('Test error'));
    InputView.readRegularPricePayment.mockRejectedValueOnce(new Error('Test error'));

    // Mock successful retry input
    InputView.readRegularPricePayment.mockResolvedValueOnce('Y');

    await StoreController.confirmRegularPricePayment();

    // Check that it retried the input after error
    expect(InputView.readRegularPricePayment).toHaveBeenCalledTimes(3);
    expect(StoreService.handleRegularPricePayment).toHaveBeenCalledTimes(1);
  });
});

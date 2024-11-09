import StoreController from '../src/controller/StoreController.js';
import InputView from '../src/views/InputView.js';
import StoreService from '../src/service/StoreService.js';
import OrderProduct from '../src/models/OrderProduct.js'; // Product 모델을 가져옴

jest.mock('../src/views/InputView.js');
jest.mock('../src/service/StoreService.js');

describe('StoreController - confirmMembership', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test.each([
    {
      userResponse: 'Y',
      products: [new OrderProduct('에너지바', 2000, 5, '')],
      expectedDiscount: 3000, // 예시 멤버십 할인 계산값
      description: '사용자가 멤버십 할인을 적용하는 경우, 할인한다.',
    },
    {
      userResponse: 'N',
      products: [new OrderProduct('에너지바', 2000, 5, '')],
      expectedDiscount: 0, // 할인 없음
      description: '사용자가 멤버십 할인을 적용하지 않는 경우, 할인하지 않는다.',
    },
  ])('$description', async ({ userResponse, products, expectedDiscount }) => {
    // Mock user response for membership application
    InputView.readMembershipApply.mockResolvedValueOnce(userResponse);

    // Mock product list
    StoreService.getProductList.mockReturnValue(products);

    StoreService.handleMembershipApply.mockImplementation((isMembershipApplied) => {
      if (isMembershipApplied === 'Y') {
        StoreService.getMembershipDiscount.mockReturnValue(expectedDiscount); // 예시 값 설정
      } else {
        StoreService.getMembershipDiscount.mockReturnValue(expectedDiscount);
      }
    });
  });

  test('멤버십 처리 중 오류 발생 시 재시도한다.', async () => {
    const error = new Error('Test error');
    InputView.readMembershipApply.mockRejectedValueOnce(error);
    InputView.readMembershipApply.mockRejectedValueOnce(error);
    InputView.readMembershipApply.mockRejectedValueOnce(error);
    InputView.readMembershipApply.mockRejectedValueOnce(error);
    InputView.readMembershipApply.mockRejectedValueOnce(error);

    // Mock successful retry input
    InputView.readMembershipApply.mockResolvedValueOnce('Y');

    await StoreController.confirmMembership();

    // Check that input was retried
    expect(StoreService.handleMembershipApply).toHaveBeenCalledTimes(1);
    expect(StoreService.handleMembershipApply).toHaveBeenCalledWith('Y');
  });
});

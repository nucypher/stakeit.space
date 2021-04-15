import {addNewStake} from './stake-service';

/**
 * mocking the Token contract instance
 * mock just returns data that passed to function:
 * approveAndCall(address _spender, uint256 _value, bytes calldata _extraData)
 */
jest.mock('../ethereum/instances/instances.js', () => ({
   Token: {
      methods: {
         approveAndCall: (DISPATCHER_ADDRESS, amount, duration) => ({
            send: obj => ({
               DISPATCHER_ADDRESS,
               amount,
               duration,
            }),
         }),
      },
   },
}));

describe('Stake service. Testing addNewStake function', () => {
   let result;
   beforeEach(async () => {
      global.ethereum = jest.fn();
      result = await addNewStake(45000.5, 365);
   });

   it('should return correct dispatcher eth address', () => {
      expect(result.DISPATCHER_ADDRESS).toBe('0xbbD3C0C794F40c4f993B03F65343aCC6fcfCb2e2');
   });
   it('should correctly convert NU (inputAmount) into NuNits', () => {
      expect(result.amount).toBe('45000500000000000000000');
   });
   it('should correctly convert days (inputDuration) into array of bytes', () => {
      expect(result.duration).toEqual('0x35');
   });
});

import ServiceWeb3Setters from './web3-service-setters';
import { daysPerPeriod } from '../utils/utils'

const serviceWeb3Setters = new ServiceWeb3Setters();

jest.mock('../ethereum/instances/instances', () => ({
   Escrow: {
      methods: {
         setReStake: value => ({
            send: acc => ({ value, acc: acc.from }),
         }),
         setWindDown: value => ({
            send: acc => ({ value, acc: acc.from }),
         }),
         setWorker: address => ({
            send: acc => ({ address, acc: acc.from }),
         }),
         prolongStake: (index, periods) => ({
            send: acc => ({ index, periods, acc: acc.from })
         }),
         divideStake: (index, value, periods) => ({
            send: acc => ({ index, value, periods, acc: acc.from })
         })
      },
   },
}));

global.ethereum = {
   selectedAddress: '0x...',
};

describe('testing blockchain setters', () => {

   it('setRestake should return correct value', async () => {
      const matchedObject = {
         value: true,
         acc: '0x...',
      };
      const res = await serviceWeb3Setters.setRestake(true);
      expect(res).toStrictEqual(matchedObject);
   });

   it('setWinddown should return correct value', async () => {
      const matchedObject = {
         value: true,
         acc: '0x...',
      };
      const res = await serviceWeb3Setters.setWinddown(true);
      expect(res).toStrictEqual(matchedObject);
   });

   it('setWorker should return worker address', async () => {
      const matchedObject = {
         address: '<Worker address>',
         acc: '0x...',
      };
      const res = await serviceWeb3Setters.setWorker('<Worker address>');
      expect(res).toStrictEqual(matchedObject);
   });

   it('prolongStake should return index and periods', async () => {
      const matchedObject = {
         index: '4',
         periods: `${Math.ceil(45/daysPerPeriod)}`,
         acc: '0x...',
      };
      const res = await serviceWeb3Setters.prolongStake('4', '45');
      expect(res).toStrictEqual(matchedObject)
   });

   it('divideStake should return index, new stake value in nuNits and periods', async () => {
      const matchedObject = {
         index: '4',
         value: '45000560000000000000000',
         periods: `${Math.ceil(45/daysPerPeriod)}`,
         acc: '0x...',
      };
      const res = await serviceWeb3Setters.divideStake('4', '45000.56', '45');
      expect(res).toStrictEqual(matchedObject)
   });
});

import utils from 'web3-utils';
import { daysToPeriods } from '../utils/utils'
import {Escrow, instancePolicy} from '../ethereum/instances/instances';

export default class ServiceWeb3Setters {
   _getAccount() {
      const account = window.ethereum.selectedAddress;
      return account
   }

   setRestake = async value => {
      return await Escrow.methods.setReStake(value).send({ from: this._getAccount() });
   };

   setWinddown = async value => {
      return await Escrow.methods.setWindDown(value).send({ from: this._getAccount() });
   };

   setWorker = async address => {
      return await Escrow.methods.setWorker(address).send({ from: this._getAccount() });
   };

   prolongStake = async (index, periods) => {
      return await Escrow.methods.prolongStake(index, daysToPeriods(periods)).send({ from: this._getAccount() });
   };

   divideStake = async (index, value, periods) => {
      const nits = utils.toWei(value, 'ether');
      return await Escrow.methods.divideStake(index, nits, daysToPeriods(periods)).send({ from: this._getAccount() });
   };

   withdrawNu = async amount => {
      const nits = utils.toWei(String(amount), 'ether');
      return await Escrow.methods.withdraw(nits).send({ from: this._getAccount() });
   };
   withdrawPolicy = async () => {
      return await instancePolicy.methods.withdraw().send({ from: this._getAccount() });
   };
}

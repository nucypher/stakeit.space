import Web3 from 'web3';
import {Escrow, instancePolicy, Token, Worklock, WORKLOCK_ADDRESS} from '../ethereum/instances/instances';
// import { convertMS } from '../utils/utils';

const web3 = new Web3(window.ethereum);

export default class ServiceWeb3 {
   _convertMS(milliseconds) {
      var day, hour, minute, seconds;
      seconds = Math.floor(milliseconds / 1000);
      minute = Math.floor(seconds / 60);
      seconds = seconds % 60;
      hour = Math.floor(minute / 60);
      minute = minute % 60;
      day = Math.floor(hour / 24);
      hour = hour % 24;
      return {
         day: day,
         hour: hour,
         minute: minute,
         seconds: seconds,
      };
   }

   getStakeData = async () => {
      let stakerData = {};

      stakerData.account = (await web3.eth.getAccounts())[0];
      // stakerData.account = window.ethereum.selectedAddress;

      stakerData.network = window.ethereum.networkVersion;

      const nits = await Token.methods.balanceOf(stakerData.account).call();
      stakerData.balanceNu = parseFloat(nits) / 10 ** 18;

      return stakerData;
   };

   getManageData = async () => {
      const stakerInfo = await this.getStakeData();
      const { balanceNu, account } = stakerInfo;

      const balanceEth = parseFloat(web3.utils.fromWei(await web3.eth.getBalance(account), 'ether')).toFixed(2);

      const StakerInfo = await Escrow.methods.stakerInfo(account).call();

      let stakerFlags = await Escrow.methods.getFlags(account).call()

      const confirmedPeriods = StakerInfo.confirmedPeriod1

      let workerBal;
      if (StakerInfo.worker !== '0x0000000000000000000000000000000000000000') {
         workerBal = parseFloat(web3.utils.fromWei(await web3.eth.getBalance(StakerInfo.worker), 'ether')).toFixed(2);
      } else {
         workerBal = 0;
      }
      // Get users locked tokens
      const lockedStakerNits = await Escrow.methods.getLockedTokens(account, 0).call();
      const lockedStakerNu = web3.utils.fromWei(lockedStakerNits, 'ether');
      // Calculate Stakers unlocked NU
      const stakerUnlockedNits = web3.utils.toBN(StakerInfo.value).sub(web3.utils.toBN(lockedStakerNits));
      const stakerNuUnlocked = web3.utils.fromWei(stakerUnlockedNits, 'ether');

      const isReStakeLockedBool = await Escrow.methods.isReStakeLocked(account).call();
      const isRestakeLocked = isReStakeLockedBool ? 'Locked' : 'Unlocked';

      // get substake length by substake index
      const getSubStakesLength = await Escrow.methods.getSubStakesLength(account).call();

      // getting an array with all substakes
      const getAllSubstakes = await (async () => {
         if (getSubStakesLength !== '0') {
            let substakeList = [];
            for (let i = 0; i < getSubStakesLength; i++) {
               let rawList = await Escrow.methods.getSubStakeInfo(account, i).call();
               rawList.id = i.toString();
               rawList.lastPeriod = await Escrow.methods.getLastPeriodOfSubStake(account, i).call();
               substakeList.push(rawList);
            }
            return substakeList;
         } else {
            let substakeList = null;
            return substakeList;
         }
      })();

      const policyFee = await instancePolicy.methods.nodes(account).call();

      const res = {
         stakerBalEth: balanceEth,
         stakersNuAll: StakerInfo.value,
         stakerNuLocked: lockedStakerNu,
         stakerNuBal: balanceNu,
         stakerNuUnlocked: stakerNuUnlocked,
         workerEthBal: workerBal,
         staker: account,
         worker: StakerInfo.worker,
         status: isRestakeLocked,
         windDown: stakerFlags.windDown,
         reStakeDisabled: !stakerFlags.reStake,
         subStakesLength: getSubStakesLength,
         substakeList: getAllSubstakes,
         StakerInfo: StakerInfo,
         confirmedPeriods: confirmedPeriods,
         policyFee: policyFee[3],
      };

      return res;
   };

   getFooterData = async () => {
      const footer = {};

      footer.currentPeriod = Math.floor(Date.now() / 86400000);

      const totalNuSupply = await Token.methods.totalSupply().call();

      // footer.supplyInBln = (totalNuSupply / 10 ** 18 / 10 ** 9)
      //    .toFixed(2);

      const getReservedReward = await Escrow.methods.getReservedReward().call();

      // Get number of active stakers and locked amount
      let getStakersAndTokens
      try {
        getStakersAndTokens = await Escrow.methods.getActiveStakers(1, 0, 0).call();
      } catch (error) {
        console.error(error);
      }

      if(getStakersAndTokens){
        footer.lockedNu = (parseFloat(getStakersAndTokens[0]) / 10 ** 18).toLocaleString('en-Us');
        footer.percentLocked = ((getStakersAndTokens[0] / (totalNuSupply - getReservedReward)) * 100).toFixed(2);
        footer.activeStakers = getStakersAndTokens[1].length;
      } else {
        footer.percentLocked = 0
        footer.lockedNu = 0
        footer.activeStakers = 0
      }

      footer.circulatingSupply = ((totalNuSupply - getReservedReward) / 10 ** 18 / 10 ** 9).toFixed(3);

      return footer;

      // Get number of stakers (with inactive)
      // const getStakersLength = await instanceEscrow.methods.getStakersLength().call();
   };

   getWorklockData = async () => {
      const accounts = await web3.eth.getAccounts();
      // const account = window.ethereum.selectedAddress;
      const account = (await web3.eth.getAccounts())[0];

      // TIME START
      // Start bid day
      const startBidDate = await Worklock.methods.startBidDate().call();
      const biddingStartDateHuman = new Date(startBidDate * 1000).toUTCString();

      // End bid day
      const endBidDate = await Worklock.methods.endBidDate().call();
      const biddingEndDateHuman = new Date(endBidDate * 1000).toUTCString();

      // Calculate bidding remaining
      const currentDateUnix = Date.now();
      const biddingTimeRemainingMs = endBidDate * 1000 - currentDateUnix;
      const objB = this._convertMS(biddingTimeRemainingMs);
      const biddingTimeRemaining = `${objB.day} Days, ${objB.hour} Hours, ${objB.minute} Mins`;

      // Cancellation Window End Date
      const cancellationEndDate = await Worklock.methods.endCancellationDate().call();
      const endCancellationDateHuman = new Date(cancellationEndDate * 1000).toUTCString();

      // Calculate Cancellation Window Duration
      const cancellationTimeDuration = cancellationEndDate - startBidDate;
      const objD = this._convertMS(cancellationTimeDuration * 1000);
      const cancellationTimeDurationHuman = `${objD.day} D, ${objD.hour} H, ${objD.minute} M`;


      // Calculate Cancellation Window Time Remaining
      const remainingCancelationTime = cancellationEndDate * 1000 - currentDateUnix;
      const objC = this._convertMS(remainingCancelationTime);
      const remainingCancellationTimeHuman = `${objC.day} Days, ${objC.hour} Hours, ${objC.minute} Mins`;

      const isClaimingAvailable = await Worklock.methods.isClaimingAvailable().call();
      let isClaimingAvailableHuman;
      if (isClaimingAvailable) {
         isClaimingAvailableHuman = 'Yes';
      } else {
         isClaimingAvailableHuman = 'No';
      }

      const minAllowedBid = await Worklock.methods.minAllowedBid().call();
      const minAllowedBidETH = parseFloat(web3.utils.fromWei(minAllowedBid, 'ether')).toFixed(2);

      const getBiddersLength = await Worklock.methods.getBiddersLength().call();

      // get current bid
      const workInfo = await Worklock.methods.workInfo(account).call();
      const currentBid = web3.utils.fromWei(workInfo[0], 'ether');
      // get completedWork
      const refundedWork = workInfo[1];
      // is tokens claimed ?
      const claimed = workInfo[2];

      const ethToTokensNits = await Worklock.methods.ethToTokens(workInfo[0]).call();
      const ethToTokensNu = ethToTokensNits / 10 ** 18;

      const boostingRefund = await Worklock.methods.boostingRefund().call();

      const SLOWING_REFUND = await Worklock.methods.SLOWING_REFUND().call();

      const getAvailableRefund = web3.utils.fromWei(await Worklock.methods.getAvailableRefund(account).call(), 'ether');

      const getContractBal = parseFloat(
         web3.utils.fromWei(await web3.eth.getBalance(WORKLOCK_ADDRESS), 'ether')
      ).toFixed(2);

      const bonusETHSupplyWei = await Worklock.methods.bonusETHSupply().call();

      const bonusETHSupply = parseFloat(web3.utils.fromWei(bonusETHSupplyWei, 'ether')).toFixed(2);

      const tokenSupply = await Worklock.methods.tokenSupply().call();

      const tokenSupplyH = tokenSupply / 10 ** 18;

      const getRemainingWork = await Worklock.methods.getRemainingWork(account).call();

      // minAllowableLockedTokens
      const minAllowableLockedTokens = await Worklock.methods.minAllowableLockedTokens().call();

      // console.log(getRemainingWork);
      const bonusTokenSupply = tokenSupply - getBiddersLength * minAllowableLockedTokens;
      const bonusDepositRate = bonusTokenSupply / bonusETHSupplyWei;
      const bonusRefundRate = (bonusDepositRate * SLOWING_REFUND) / boostingRefund;

      const completedWork = (await Escrow.methods.getCompletedWork(account).call()) - workInfo[1];
      // const completedWork = blabla - refundedWork;
      // Setters

      const makeBid = async value => {
        await Worklock.methods.bid().send({
          from: accounts[0],
          value: web3.utils.toWei(String(value), "ether"),
        })
      }

      // Cancel Bid
      const cancelBid = async () => {
         await Worklock.methods.cancelBid().send({
            from: account,
         });
      };

      // Claim
      const claimTokens = async () => {
         // alert('ho ho ho')
         await Worklock.methods.claim().send({
            from: account,
         });
      };
      // Refund
      const refund = async () => {
         // alert('ho ho ho')
         await Worklock.methods.refund().send({
            from: account,
         });
      };

      const worklockData = {
         // account: account,
         biddersLength: getBiddersLength,
         // time start
         biddingStartDate: biddingStartDateHuman,
         biddingEndDate: biddingEndDateHuman,
         // biddingDuration: biddingDuration,
         biddingTimeRemaining: biddingTimeRemaining,
         cancellationEndDate: endCancellationDateHuman,
         cancellationTimeDuration: cancellationTimeDurationHuman,
         cancellationTimeRemaining: remainingCancellationTimeHuman,
         CancelationTime: remainingCancelationTime,

         // time end
         claimingBool: isClaimingAvailable,
         claimingYesNo: isClaimingAvailableHuman,
         //
         // Economics
         minAllowedBid: minAllowedBidETH,
         workInfo: workInfo,

         claimed: claimed,
         currentBid: parseFloat(currentBid).toFixed(4),
         tokensAllocated: ethToTokensNu,
         boostingRefund: boostingRefund,
         SLOWING_REFUND: SLOWING_REFUND,
         availableRefund: parseFloat(getAvailableRefund).toFixed(4),
         getContractBal: getContractBal,
         bonusETHSupply: bonusETHSupply,
         bonusDepositRate: bonusDepositRate.toFixed(2),
         bonusRefundRate: bonusRefundRate.toFixed(2),
         getRemainingWork: getRemainingWork,
         tokenSupply: tokenSupplyH,
         bonusTokenSupply: bonusTokenSupply / 10 ** 18,

         claimTokens: claimTokens,
         makeBid: makeBid,
         cancelBid: cancelBid,
         refund: refund,
         refundedWork: refundedWork,

         methods: Worklock.methods,

         completedWork: completedWork,
      };
      return worklockData;
   };

   getSetters = async () => {
      const setters = {};
      setters.setRestake = async value => {
         try {
            const accounts = await web3.eth.getAccounts();
            await Escrow.methods.setReStake(value).send({ from: accounts[0] });
         } catch (err) {
            console.error('Error', err);
         }
      };

      setters.setWinddown = async value => {
         try {
            const accounts = await web3.eth.getAccounts();
            await Escrow.methods.setWindDown(value).send({ from: accounts[0] });
         } catch (err) {
            console.error('Error', err);
         }
      };

      setters.setWorker = async address => {
         try {
            const accounts = await web3.eth.getAccounts();
            await Escrow.methods.setWorker(address).send({ from: accounts[0] });
         } catch (err) {
            console.error('Error', err);
         }
      };

      setters.prolongStake = async (index, periods) => {
         try {
            const accounts = await web3.eth.getAccounts();
            await Escrow.methods.prolongStake(index, periods).send({ from: accounts[0] });
         } catch (err) {
            console.error('Error', err);
         }
      };

      setters.divideStake = async (index, value, periods) => {
         try {
            const accounts = await web3.eth.getAccounts();

            const nits = web3.utils.toWei(value, 'ether');
            // console.log(typeof nits);
            // console.log(nits);

            await Escrow.methods.divideStake(index, nits, periods).send({ from: accounts[0] });
         } catch (err) {
            console.error('Error', err);
         }
      };

      return setters;
   };
}

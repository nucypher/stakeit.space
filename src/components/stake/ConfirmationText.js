import React from 'react';
import BigNumber from 'bignumber.js';
import styled from 'styled-components';
import { daysToPeriods } from '../../utils/utils'
// import {dark} from '../../themes/theme'

const ContainerScrollable = styled.div`
   display: grid;
   grid-template-rows: 45vh;
   grid-template-columns: minmax(200px, 600px);
   margin: 0 10px;
   p {
      letter-spacing: 0.2px;
      margin: 20px 0;
      line-height: 2rem;
   }
   span {
      display: block;
      line-height: 2rem;
   }
   b {
      color: ${({ theme }) => theme.textPrimary};
      font-weight: 500;
   }
   .scrollable {
      border-radius: 5px;
      padding-right: 40px;
      padding-left: 30px;
      border: 1px solid #333;
      font-size: 14px;
      overflow-y: scroll;
      scrollbar-color: #444 #111;
      scrollbar-width: auto;
      margin-bottom: 20px;
      border: 1px solid ${({ theme }) => theme.footerBorder};
      color: ${({ theme }) => theme.textSecondary};
      background-color: ${({ theme }) => (theme.darkMode ? '#22232a' : theme.addressBackground)};
      &::-webkit-scrollbar-track {
         background: ${({ theme }) => theme.footerBorder};
      }
      &::-webkit-scrollbar-thumb {
         background: ${({ theme }) => theme.background4};
         /* border-radius: 6px; */
      }
   }
`;

const ConfirmationText = props => {
   const x = new BigNumber(props.amount);
   const y = x.multipliedBy(10 ** 18).toFixed();

   return (
      <ContainerScrollable>
         <div className="scrollable">
            <p>
               Staking address: <b>{props.account}</b>
            </p>
            <span>
               ~ Value: <b>{props.amount}</b> NU ({y} NuNits)
            </span>
            <span>
               ~ Duration: <b>{props.duration}</b> Days (<b>{daysToPeriods(props.duration)}</b> Periods)
            </span>
            <p>* Ursula Node Operator Notice *</p>
            <p>
               By agreeing to stake <b>{props.amount}</b> NU ({y} NuNits):
            </p>
            <p>- Staked tokens will be locked for the stake duration.</p>
            <p>
               - You are obligated to maintain a networked and available Ursula-Worker node bonded to the staker address
               <b> {props.account}</b> for the duration of the stake(s) (<b>{props.duration}</b> periods).
            </p>
            <p>
               - Agree to allow NuCypher network users to carry out uninterrupted re-encryption work orders at-will
               without interference. Failure to keep your node online, or violation of re-encryption work orders will
               result in the loss of staked tokens as described in the NuCypher slashing protocol. Keeping your Ursula
               node online during the staking period and successfully producing correct re-encryption work orders will
               result in rewards paid out in ethers retro-actively and on-demand.
            </p>
         </div>
      </ContainerScrollable>
   );
};
export default ConfirmationText;

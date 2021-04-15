import React, {useState} from 'react';
import styled from 'styled-components';
import s from './staker.module.css';
import {connect} from 'react-redux';

import EthAccountContainer from '../eth-accont-container';
import StakerButtons from './staker-buttons';

const StakerContent = styled.div`
   margin: 10px 0;
   padding-top: 10px;
   padding-bottom: 10px;
   border-top: 1px solid ${({ theme }) => theme.background2};
   border-bottom: 1px solid ${({ theme }) => theme.background2};
   p {
      display: grid;
      grid-auto-flow: column;
      justify-content: space-between;
      margin: 0;
      height: 26px;
      line-height: 26px;
      color: rgb(119, 119, 119);
      font-size: 13px;
      span {
         color: ${({ theme }) => theme.textSecondary};
         b {
            color: ${({ theme }) => theme.textPrimary};
            font-weight: 600;
            letter-spacing: 0.3px;
         }
      }
   }
`;

const Staker = ({
   staker,
   stakerBalEth,
   stakerNuBal,
   stakerNuLocked,
   stakerNuUnlocked,
   migrated,
   windDown,
   reStakeDisabled
}) => {
   const [copied, setCopied] = useState(false);

   const onAddrClick = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
   };
   return (
      <div className={s.staker_manage}>
         <EthAccountContainer copied={copied} onAddrClick={onAddrClick} address={staker} title="Staker Account" />

         <StakerContent>
            <p>
               <span>Ether Balance:</span>
               <span>
                  <b>{stakerBalEth}</b> ETH
               </span>
            </p>

            <p>
               <span>Balance:</span>
               <span>
                  <b>{stakerNuBal.toLocaleString('en-Us')}</b> NU
               </span>
            </p>
            <p>
               <span>Locked in stake:</span>
               <span>
                  <b>{stakerNuLocked.toLocaleString('en-Us')}</b> NU
               </span>
            </p>
            <p>
               <span>Migrated:</span>
               <span>
                  <b>{migrated ? 'yes': 'no'}</b>
               </span>
            </p>
            <p>
               <span>
                  Unlocked <i>(Available to withdraw):</i>
               </span>
               <span>
                  <b>{(+stakerNuUnlocked.toLocaleString('en-Us')).toFixed(3)}</b> NU
               </span>
            </p>
         </StakerContent>

         <StakerButtons

            windDown={windDown}
            reStakeDisabled={reStakeDisabled}
         />
      </div>
   );
};

const mapStateToProps = ({ user }) => ({
   staker: user.manage.staker,
   stakerBalEth: user.manage.stakerBalEth,
   stakerNuBal: user.manage.stakerNuBal,
   stakerNuLocked: user.manage.stakerNuLocked,
   stakerNuUnlocked: user.manage.stakerNuUnlocked,
   migrated: user.manage.migrated,
   windDown: user.manage.windDown,
   reStakeDisabled: user.manage.reStakeDisabled,
});
export default connect(mapStateToProps)(Staker);

import React, {useRef, useState} from 'react';
import styled from 'styled-components';
import utils from 'web3-utils';
import Modal from '../../worklock/modal/modal';
import SetWorkerModal from './set-worker-modal';
import EthAccountContainer from '../eth-accont-container';
import MainSpinner from '../../loader/main-spinner';
import {connect} from 'react-redux';

import WithdrawRewards from './withdrawRewards';
import {Button} from '../../buttons/buttons';
import {setWorkerThunk} from '../../../redux/settersReducer';

const WorkerWrapper = styled.div`
   grid-area: worker;
   .worker_content {
      margin: 10px 0;
      padding-top: 10px;
      padding-bottom: 10px;
      /* border-bottom: 1px solid #333; */
      border-top: 1px solid ${({ theme }) => theme.background2};
      border-bottom: 1px solid ${({ theme }) => theme.background2};
      p {
         display: grid;
         grid-auto-flow: column;
         justify-content: space-between;
         margin: 0;
         height: 26px;
         line-height: 26px;
         color: ${({ theme }) => theme.textSecondary};
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
   }
`;

const Worker = ({ worker, workerEthBal, setWorker, confirmedPeriods, currentPeriod, setWorkerThunk, isManageDataLoading }) => {
   const [inputAddress, setInputAddress] = useState('');
   const [isValid, setIsValid] = useState(true);
   const [copied, setCopied] = useState(false);

   let buttonContent;
   if (worker === '0x0000000000000000000000000000000000000000') {
      buttonContent = 'Bond worker';
   } else {
      buttonContent = 'Change worker';
   }

   const modalRef = useRef();

   const openModal = e => {
      e.preventDefault();
      modalRef.current.openMod();
   };
   const closeModal = () => {
      modalRef.current.closeMod();
      setInputAddress('');
      setIsValid(true);
   };
   const handleInputChange = value => {
      setInputAddress(value);
      if (!utils.isAddress(value)) {
         setIsValid(false);
      } else {
         setIsValid(true);
      }
   };

   const handleClick = () => {
      if (isValid && inputAddress !== '') {
         setWorkerThunk(inputAddress);
      } else {
         setIsValid(false);
      }
   };

   const onAddrClick = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
   };

   if (isManageDataLoading) return <MainSpinner />;
   return (
      <WorkerWrapper>
         <EthAccountContainer copied={copied} onAddrClick={onAddrClick} address={worker} title="Worker Account">
            <Button onClick={openModal}>{buttonContent}</Button>
         </EthAccountContainer>
         <div className="worker_content">
            <p>
               Ether Balance:
               <span>
                  <b>{workerEthBal}</b> ETH
               </span>
            </p>
            <p>
               Last confirmed period:
               <span>
                  {currentPeriod > confirmedPeriods ? (
                     <b style={{ color: '#ee5a5a' }}>{confirmedPeriods}</b>
                  ) : (
                     <b style={{ color: '#5cae72' }}>{confirmedPeriods}</b>
                  )}
               </span>
            </p>
         </div>
         <WithdrawRewards />
         <div>
            <Modal ref={modalRef}>
               <SetWorkerModal
                  isValid={isValid}
                  inputAddress={inputAddress}
                  closeModal={closeModal}
                  handleClick={handleClick}
                  handleInputChange={handleInputChange}
               />
            </Modal>
         </div>
      </WorkerWrapper>
   );
};

const mapStateToProps = ({ user }) => ({
   isManageDataLoading: user.isManageDataLoading,
   worker: user.manage.worker,
   workerEthBal: user.manage.workerEthBal,
   setWorker: user.manage.setWorker,
   confirmedPeriods: user.manage.confirmedPeriods,
   currentPeriod: user.footer.currentPeriod,
});
export default connect(mapStateToProps, { setWorkerThunk })(Worker);

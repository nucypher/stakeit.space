import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components';

import NoStakes from './no-stakes/no-stakes';
import Modal from '../../../worklock/modal/modal';
import {Button} from '../../../buttons/buttons';
import DivideModal from './divide-modal';
import ProlongModal from './prolong-modal';

import {substakeObjectCreator} from '../../../../utils/utils';

const SubstakePanel = styled.div`
   display: grid;
   border: 1px solid ${({ theme }) => theme.footerBorder};
   background-color: ${({ theme }) => (theme.darkMode ? '#22232a' : theme.addressBackground)};
   grid-template-columns: 1fr 275px;
   margin: 5px 0 15px 0;
   border-radius: 10px;
   padding-right: 10px;
   .substake_item {
      display: grid;
      grid-gap: 5px;
      margin-top: 1px;
      padding: 14px;
      grid-template-columns: 1.5fr 2fr 1.5fr 2fr 2fr;
      div {
         display: grid;
         align-items: center;
         justify-content: center;
         span:last-child {
            font-size: 12px;
            color: grey;
            text-align: center;
         }
         span:first-child {
            font-size: 16px;
            text-align: center;
            letter-spacing: 0.3px;
            font-weight: 500;
            color: ${({ theme }) => theme.textPrimary};
            padding-top: 3px;
         }
      }
   }
   .substake_buttons {
      margin: 8px 0;
      padding: 0 30px;
      display: grid;
      grid-template-columns: 100px 100px;
      column-gap: 30px;
      justify-content: center;
      align-items: center;
   }
`;

const SubstakeItemTitles = styled.div`
   display: grid;
   color: grey;
   grid-template-columns: 1fr 275px;
   justify-content: center;
   align-content: center;
   padding-right: 10px;
   align-items: center;
   div {
      display: grid;
      grid-template-columns: 1.5fr 2fr 1.5fr 2fr 2fr;
      grid-auto-flow: column;
      margin: 0 12px;
   }
   span {
      text-align: center;
      font-size: 12px;
   }
`;

const Substakes = ({ substakeList, prolongStake, divideStake }) => {
   const [id, setId] = useState(null);

   const [currentStake, setCurrentStake] = useState('');

   useEffect(() => {
      window.scrollTo(0, window.pageYOffset);
   }, []);

   const modalRef1 = useRef();
   const modalRef2 = useRef();

   const openModal1 = id => {
      setId(id);
      modalRef1.current.openMod();
   };
   const openModal2 = (id, lockedValue) => {
      setId(id);
      setCurrentStake((lockedValue / 10 ** 18).toLocaleString('en-Us'));
      modalRef2.current.openMod();
   };
   const closeModal = () => {
      // setProlongValue('');
      modalRef1.current.closeMod();
   };
   const closeModal2 = () => {
      // setProlongValue('');
      modalRef2.current.closeMod();
   };

   return (
      <div>
         <SubstakeItemTitles>
            <div>
               <span>Substake</span>
               <span>Amount</span>
               <span>Duration</span>
               <span>Created</span>
               <span>Ends</span>
            </div>
            <span>Modify</span>
         </SubstakeItemTitles>
         <div className="list_items">
            {substakeList === null ? (
               <NoStakes />
            ) : (
               substakeList.map(object => {
                  let newObject = substakeObjectCreator(object);
                  return (
                     <SubstakePanel key={object.id}>
                        <div className="substake_item">
                           <div>
                              <span>№ {object.id}</span>
                              <span>STAKE</span>
                           </div>
                           <div>
                              <span>{newObject.value}</span>
                              <span>NU</span>
                           </div>
                           <div>
                              <span>{newObject.daysLeft}</span>
                              <span>DAYS</span>
                           </div>
                           <div>
                              <span>{newObject.startDay}</span>
                              <span>{newObject.startYear}</span>
                           </div>
                           <div>
                              <span>{newObject.endDay}</span>
                              {newObject.isActive && <span>{newObject.endYear}</span>}
                           </div>
                        </div>
                        {newObject.isActive && <div className="substake_buttons">
                           <Button onClick={() => openModal1(object.id)}>Prolong</Button>
                           <Button onClick={() => openModal2(object.id, object.lockedValue)}>Divide</Button>
                        </div>}
                     </SubstakePanel>
                  );
               })
            )}
         </div>

         <Modal ref={modalRef1}>
            <ProlongModal id={id} closeModal={closeModal} />
         </Modal>
         <Modal ref={modalRef2}>
            <DivideModal id={id} closeModal2={closeModal2} currentStake={currentStake} />
         </Modal>
      </div>
   );
};
export default Substakes;

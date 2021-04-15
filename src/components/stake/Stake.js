import React from 'react';
import styled from 'styled-components';

// import { dark as theme } from '../../themes/theme';
import Slider from './Slider';
import InputText from './Input';


export const StakeWrapper = styled.div`
   height: 500px;
   margin-bottom: 20%;
   padding-top: 5vh;
   border-radius: 15px;
   margin-top: 4vh;
   h4 {
      text-transform: uppercase;
      text-align: center;
      font-weight: 500;
      letter-spacing: .3px;
      color: ${({ theme }) => theme.textPrimary};
      padding-bottom: 15px;
   }
   .button_group_confirm {
      display: grid;
      grid-auto-flow: column;
      justify-content: center;
      column-gap: 20px;
      margin-top: 20px;
   }
`;

const FormWrapper = styled.div`
   width: 350px;
   margin: 0 auto;
   margin-top: 30px;
`;

const InputTitle = styled.div`
   display: flex;
   justify-content: space-between;
   padding: 0 25px;
   span {
      font-size: 13px;
      color: ${({theme}) => theme.textSecondary};
      /* cursor: pointer; */

   }
   .balance_click {
      font-weight: 600;
      color: ${({theme}) => theme.textPrimary};
      letter-spacing: 0.3px;
      cursor: pointer;
   }
`;

const Button = styled.div`
   display: grid;
   flex-direction: column;
   margin-top: 20px;
   span:last-child {
      font-size: 11px;
      text-align: center;
      color: #888;

   }
   span:first-child {
      padding: 10px 0;
      font-size: 14px;
      letter-spacing: 0.8px;
      background-color: ${({ disable, theme }) => (disable ? theme.independenceDark : theme.buttonPrimary)};
      color: ${({ disable, theme }) => (disable ? theme.greyText : 'white')};
      pointer-events: ${({ disable, theme }) => (disable ? 'none' : 'auto')};
      border: none;
      width: 95%;
      margin: 30px auto 15px auto;
      border-radius: 10px;
      font-family: Lato, sans-serif;
      align-content: center;
      justify-content: center;
      text-align: center;
      font-weight: 600;
      &:hover {
         cursor: pointer;
      }
   }
`;

const Stake = ({
   balanceNu,
   amount,
   duration,
   amount_error,
   duration_error,
   disable,
   handleAmount,
   handleDuration,
   onButtonClick,
}) => {
   return (
      <StakeWrapper>
         <h4>Add New Stake</h4>
         <FormWrapper>
            <InputTitle>
               <span>Amount</span>
               <span onClick={() => handleAmount(balanceNu)}>
                  Balance <b className="balance_click">{balanceNu.toFixed(2)}</b> NU
               </span>
            </InputTitle>

            <InputText
               onChange={(e) => handleAmount(e.target.value)}
               error={amount_error}
               placeholder="0.0"
               autoComplete="off"
               type="text"
               name="nuAmount"
               value={amount}
               label="NU"
            />

            <InputTitle>
               <span>Duration</span>
            </InputTitle>

            <InputText
               onChange={(e) => handleDuration(e.target.value)}
               placeholder="0"
               error={duration_error}
               handleDuration={handleDuration}
               value={duration}
               name="duration"
               label="DAYS"
            />

            <Slider duration={duration} handleDuration={handleDuration} />

            <Button disable={disable}>
               <span onClick={onButtonClick}>Stake It!</span>
               <span>Enter amount and duration to continue.</span>
            </Button>
         </FormWrapper>
      </StakeWrapper>
   );
};

export default Stake;

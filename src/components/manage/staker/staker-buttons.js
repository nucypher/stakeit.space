import React from 'react';
import styled from 'styled-components';
import {connect} from 'react-redux';
import {Svg7} from '../../loader/7';

import {setRestakeThunk, setWindDownThunk} from '../../../redux/settersReducer';

const StakerButtonsWrapper = styled.div`
   margin-top: 30px;
   display: grid;
   grid-template-columns: 1fr 1fr;
   h4 {
      font-weight: 500;
      font-size: 14px;
      color: ${({ theme }) => theme.textPrimary};
      span {
         font-size: 12px;
         margin: 0 10px;
         border: 1px solid ${({ theme }) => theme.independenceDark};
         color: ${({ theme }) => theme.textSecondary};
         border-radius: 7px;
         padding: 2px 8px;
      }
   }
   .btn_group {
      width: 124px;
      background-color: ${({ theme }) => (theme.darkMode ? theme.independenceDark : theme.addressBackground)};
      border-radius: 10px;
      display: grid;
      grid-auto-flow: column;
      span {
         width: 62px;
         height: 30px;
         line-height: 30px;
         letter-spacing: .3px;
         background-color: ${({ theme }) => (theme.darkMode ? theme.independenceDark : theme.addressBackground)};
         color: ${({ theme }) => theme.textSecondary};
         cursor: pointer;
         font-family: 'Lato', sans-serif;
         border-radius: 10px;
         text-align: center;
         align-items: center;
         justify-content: center;
         display: grid;
         svg {
            stroke: ${({ theme }) => (theme.darkMode ? 'white' : '#aeaeae')};
         }

         &:hover {
            color: ${({ theme }) => theme.textPrimary};
            transition: 0.2s;
         }
      }
      .button_active {
         background-color: ${({ theme }) => theme.buttonPrimary};
         pointer-events: none;
         cursor: none;
         color: #f6f9ff;
         font-weight: 600;
         transition: 0.4s;
      }
   }
`;

const StakerButtons = ({ status, reStakeDisabled, windDown, setRestakeThunk, showRestakeLoader, showWindDownLoader, setWindDownThunk }) => {
   const handleRestake = bool => {
      setRestakeThunk(bool);
   };

   const handleWinddown = bool => {
      setWindDownThunk(bool);
   };

   return (
      <StakerButtonsWrapper>
         <div>
            <h4>
               Re-Stake
            </h4>
            <div className="btn_group">
               <span
                  className={!reStakeDisabled ? 'button_active' : null}
                  onClick={() => handleRestake(true)}
                  >
                  {showRestakeLoader && reStakeDisabled ? <Svg7 /> : 'On'}
               </span>
               <span
                  className={reStakeDisabled ? 'button_active' : null}
                  onClick={() => handleRestake(false)}
                  >
                  {showRestakeLoader && !reStakeDisabled ? <Svg7 /> : 'Off'}
               </span>
            </div>
         </div>

         <div>
            <h4>Wind-Down</h4>
            <div className="btn_group">
               <span
                  className={windDown ? 'button_active' : null}
                  onClick={() => handleWinddown(true)}
                  >
                  {showWindDownLoader && !windDown ? <Svg7 /> : 'On'}
               </span>
               <span
                  className={!windDown ? 'button_active' : null}
                  onClick={() => handleWinddown(false)}
                  >
                  {showWindDownLoader && windDown ? <Svg7 /> : 'Off'}
               </span>
            </div>
         </div>
      </StakerButtonsWrapper>
   );
};

const mapStateToProps = ({ setters }) => ({
   showRestakeLoader: setters.showRestakeLoader,
   showWindDownLoader: setters.showWindDownLoader
});

export default connect(mapStateToProps, { setRestakeThunk, setWindDownThunk })(StakerButtons);

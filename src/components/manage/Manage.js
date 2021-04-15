import React from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components';

import Staker from './staker/staker';
import Worker from './worker/worker';
import ManageBottom from './manage-bottom/manage-bottom';
import MainSpinner from '../loader/main-spinner';

const ManegeWrapper = styled.div`
   margin: 40px 20px 20px 20px;
   display: grid;
   grid-template-columns: minmax(250px, 600px);
   grid-template-rows: 330px 330px 1fr;
   grid-auto-flow: column;
   grid-gap: 60px;
   padding-bottom: 70px;
   grid-template-areas:
      'staker'
      'worker'
      'list';

   @media (min-width: 840px) {
      grid-template-columns: minmax(300px, 430px) minmax(300px, 430px);
      grid-template-rows: 330px auto;
      grid-template-areas:
         'staker worker'
         'list list';
   }
   .worker_manage {
      grid-area: worker;
   }
   .substake_list {
      display: grid;
      grid-area: list;
      grid-template-rows: 80px auto;
      margin-top: 20px;
   }
`;

const Manage = ({ isManageDataLoading }) => {
   if (isManageDataLoading) return <MainSpinner />;

   return (
      <ManegeWrapper>
         <Staker />
         <Worker />
         <ManageBottom />
      </ManegeWrapper>
   );
};
const mapStateToProps = ({ user }) => ({
   isManageDataLoading: user.isManageDataLoading,

});
export default connect(mapStateToProps)(Manage);

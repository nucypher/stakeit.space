import Web3 from 'web3';
import {abiEscrow, abiManager, abiToken, abiWorklock} from './contract-abis'

const abiIndex = 3;  // registry index of ABI
const providerUri = process.env.WEB3_PROVIDER_URI
const web3 = new Web3(window.ethereum || providerUri);
if (window.ethereum){
    window.ethereum.autoRefreshOnNetworkChange = false;
}

// PolicyManager
const POLICY_MANAGER_DISPATCHER_ADDRESS = '0x67E4A942c067Ff25cE7705B69C318cA2Dfa54D64';  // PM Dispatcher Address
const POLICY_MANAGER_ABI = abiManager[abiIndex];
export const instancePolicy = new web3.eth.Contract(POLICY_MANAGER_ABI, POLICY_MANAGER_DISPATCHER_ADDRESS);

// StakingEscrow
const STAKING_ESCROW_DISPATCHER_ADDRESS = '0xbbD3C0C794F40c4f993B03F65343aCC6fcfCb2e2';  // SE Dispatcher Address
const STAKING_ESCROW_ABI = abiEscrow[abiIndex];
export const Escrow = new web3.eth.Contract(STAKING_ESCROW_ABI, STAKING_ESCROW_DISPATCHER_ADDRESS);

// Token
const TOKEN_ADDRESS = "0x4fE83213D56308330EC302a8BD641f1d0113A4Cc";
const TOKEN_ABI = abiToken[abiIndex];
export const Token = new web3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS);

// Worklock
export const WORKLOCK_ADDRESS = "0xe9778E69a961e64d3cdBB34CF6778281d34667c2";
const WORKLOCK_ABI = abiWorklock[abiIndex];
export const Worklock = new web3.eth.Contract(WORKLOCK_ABI, WORKLOCK_ADDRESS);

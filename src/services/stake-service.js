import Web3 from "web3"
import { Token, Escrow } from "../ethereum/instances/instances"
import { daysToPeriods } from "../utils/utils"


const web3 = new Web3(window.ethereum)

export const addNewStake = async (inputAmount, inputDuration) => {
  const account = window.ethereum.selectedAddress
  const amount = web3.utils.toWei(String(inputAmount), "ether")
  const hex = web3.utils.numberToHex(daysToPeriods(inputDuration))
  try {
    return await Token.methods
      .approveAndCall("0xbbD3C0C794F40c4f993B03F65343aCC6fcfCb2e2", amount, hex)
      .send({ from: account })
  } catch (error) {
    console.log(error)
  }
}

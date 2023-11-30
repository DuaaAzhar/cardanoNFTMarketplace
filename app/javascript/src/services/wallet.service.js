import { walletConstants } from "../constants/wallet.constants"

const saveSelectedWallet = name => localStorage.setItem(walletConstants.STORAGE_KEY, name)
const getSelectedWallet = () => localStorage.getItem(walletConstants.STORAGE_KEY)

export {
  saveSelectedWallet,
  getSelectedWallet
}

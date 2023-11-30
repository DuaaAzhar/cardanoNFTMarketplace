import React, { Fragment, useState } from 'react';
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import { PulseLoader } from 'react-spinners'

import NamiSVG from '../../assets/wallet/iconNami.svg';
import EternlWallet from '../../assets/wallet/eternlWallet.svg'
import FlintSVG from '../../assets/wallet/iconFlint.svg';
import DownIcon from '../../assets/elements/down-icon.svg';
import CheckMark from '../../assets/elements/checkmark.svg';
import { walletConstants } from '../../constants/wallet.constants';
import './balanceButton.scss'

function BalanceButton({ handleWalletConnection }) {
  const storeWallet = useSelector(state => state.wallet.wallet)
  const walletSelected = useSelector(state => state.wallet.walletSelected)
  const walletConnectStatus = useSelector(state => state.wallet.walletLoading)
  const [buttonClicked, setButtonClicked] = useState();

  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);

  return (
    <Fragment>
    <div className="d-flex align-items-center balance-wallet-dropdown border ">
      <div className="b-dropdown border-end ">
        <button to="#" className="btn" data-toggle="collapse"
          data-target="#navbarsExample09" aria-controls="navbarsExample09"
          aria-expanded={!isNavCollapsed ? true : false} aria-label="Toggle navigation"
          onClick={handleNavCollapse}>
          {activeWallet(walletSelected)}
          <img src={DownIcon} className="ms-1" />
        </button>
        <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse h-auto`}>
        <ul className="hover-dropdown p-0 dropdown-custom scrollable-menu" role="menu">
          <li onClick={handleNavCollapse}>
            <Link to='#' className='text-decoration-none text-danger' onClick={() => {
              setButtonClicked(walletConstants.NAMI_WALLET)
              handleWalletConnection(window.cardano?.nami, walletConstants.NAMI_WALLET, true)
            }
            }
            >
              <img className='me-3' width="30px" height="30px" src={NamiSVG} />
              Nami
              {
                walletSelected === walletConstants.NAMI_WALLET ? <img className='me-3 float-end' width="30px" height="30px" src={CheckMark} /> :
                  walletConnectStatus === true && buttonClicked === walletConstants.NAMI_WALLET ? <div className='me-3 mt-1 float-end'><PulseLoader size={8} color="#dc3545" /></div> :
                    null
              }
            </Link>
          </li>
          <li onClick={handleNavCollapse}>
            <Link to='#' className='text-decoration-none text-danger' onClick={() => {
              setButtonClicked(walletConstants.ETERNL_WALLET)
              handleWalletConnection(window.cardano?.eternl, walletConstants.ETERNL_WALLET, true)
            }
            }
            >
              <img className='me-3' width="30px" height="30px" src={EternlWallet} />
              Eternl
              {
                walletSelected === walletConstants.ETERNL_WALLET ? <img className='me-3 float-end' width="30px" height="30px" src={CheckMark} /> :
                  walletConnectStatus === true && buttonClicked === walletConstants.ETERNL_WALLET ? <div className='me-3 mt-1 float-end'><PulseLoader size={8} color="#dc3545" /></div> :
                    null
              }
            </Link>
          </li>
          <li onClick={handleNavCollapse}>
            <Link to='#' className='text-decoration-none text-danger' onClick={() => {
              setButtonClicked(walletConstants.FLINT_WALLET)
              handleWalletConnection(window?.cardano?.flint, walletConstants.FLINT_WALLET, true)
            }
            }
            >
              <img className='me-3' width="30px" height="30px" src={FlintSVG} />
              Flint
              {
                walletSelected === walletConstants.FLINT_WALLET ? <img className='me-3 float-end' width="30px" height="30px" src={CheckMark} /> :
                  walletConnectStatus === true && buttonClicked === walletConstants.FLINT_WALLET ? <div className='me-3 mt-1 float-end'><PulseLoader size={8} color="#dc3545" /></div> :
                    null
              }
            </Link>
          </li>
        </ul>
        </div>
      </div>
      {/* TODO: Redirect to this if someone hit /dashboard */}
      <Link
        to="/dashboard/nfts"
        className="btn">
        ADA {balanceFormatter(storeWallet.getBalance())}
      </Link>
    </div>
    </Fragment>
  );
}

// Utility Function
function activeWallet(walletSelected) {
  if (walletSelected === walletConstants.NAMI_WALLET)
    return <img width="30px" height="30px" className="img" src={NamiSVG} />
  else if (walletSelected === walletConstants.ETERNL_WALLET)
    return <img width="30px" height="30px" className="img" src={EternlWallet} />
  else if (walletSelected === walletConstants.FLINT_WALLET)
    return <img width="30px" height="30px" className="img" src={FlintSVG} />
  else
    return <img className="img" src="" />
}

const balanceFormatter = (balance) => (balance / walletConstants.ROUND_BALANCE_FIGURE).toFixed(2)

export default BalanceButton;

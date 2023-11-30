import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Bars } from "react-loader-spinner";

import NamiSVG from '../../assets/wallet/iconNami.svg';
import EternlWallet from '../../assets/wallet/eternlWallet.svg'
import FlintSVG from '../../assets/wallet/iconFlint.svg';
import { walletConstants } from '../../constants/wallet.constants';
import './connectButton.scss'

export default function ConnectButton({ handleWalletConnection }) {
  const walletConnectStatus = useSelector(state => state.wallet.walletLoading)

  return (
    <div className="d-flex align-items-center wallet-dropdown">
      <button className="btn btn-danger ">
        {walletConnectStatus === true ? (
          <Bars
            height={23.5}
            width={61}
            color="#ffffff"
            ariaLabel="loading-indicator"
          />
        ) : (
          "Connect"
        )}
      </button>
      <ul className="hover-dropdown p-0">
        <li>
          <Link
            to="#" className='text-decoration-none text-danger'
            onClick={() => {
              handleWalletConnection(
                window.cardano?.nami,
                walletConstants.NAMI_WALLET,
                true
              );
            }}
          >
            <img className="me-3" width="30px" height="30px" src={NamiSVG} />
            Nami
          </Link>
        </li>
        <li>
          <Link
            to="#" className='text-decoration-none text-danger'
            onClick={() => {
              handleWalletConnection(
                window.cardano?.eternl,
                walletConstants.ETERNL_WALLET,
                true
              );
            }}
          >
            <img
              className="me-3"
              width="30px"
              height="30px"
              src={EternlWallet}
            />
            Eternl
          </Link>
        </li>
        <li>
          <Link
            to="#" className='text-decoration-none text-danger'
            onClick={() => {
              handleWalletConnection(
                window?.cardano?.flint,
                walletConstants.FLINT_WALLET,
                true
              );
            }}
          >
            <img className="me-3" width="30px" height="30px" src={FlintSVG} />
            Flint
          </Link>
        </li>
      </ul>
    </div>
  );
}

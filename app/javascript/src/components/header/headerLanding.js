import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Link } from "react-router-dom";

import Logo from "../../assets/branding/angryKongsLogoRed.jpeg";
import LogoText from "../../assets/branding/angryKongsLogoTextBlack.jpeg";
import { initWallet } from "../../actions/wallet";
import { walletConstants } from "../../constants/wallet.constants"
import ConnectButton from "../connectbutton/connectButton";
import BalanceButton from "../balancebutton/balanceButton";
import { getSelectedWallet } from "../../services/wallet.service";
import "./headerLanding.scss";

export default function HeaderLanding() {
    const connected = useSelector(state => state.wallet.connected)

    const [isToggled, setToggled] = useState(false);
    const [counter, setCounter] = useState(0);

    const dispatch = useDispatch()

    useEffect(() => {
        const [walletObj, walletSelected] = walletFound()
        if (!!walletObj) {
            handleWalletConnection(walletObj, walletSelected)
        }
        else if (counter < 50)
            setCounter(counter + 1)
        else
            console.log(walletConstants.NONE_INITIALIZED);
    }, [counter])

    const handleWalletConnection = async (wallet, name, forceEnable = false) => {
        if (!wallet) {
            console.log(walletConstants.EXTENSION_NOT_ENABLED);
            return
        }

        dispatch(initWallet(wallet, name, forceEnable))
    }

    const walletFound = () => {
        const wallet = getSelectedWallet()

        if (wallet === walletConstants.ETERNL_WALLET)
            return [window?.cardano?.eternl, wallet]
        else if (wallet === walletConstants.FLINT_WALLET)
            return [window?.cardano?.flint, wallet]
        else if (wallet === walletConstants.NAMI_WALLET)
            return [window?.cardano?.nami, wallet]
        else
            return [undefined, undefined]
    }

    const [isNavCollapsed, setIsNavCollapsed] = useState(true);

    const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);

    return (
        <div className="header landing">
            <div className="container">
                <div className="row">
                    <div className="col-xl-12">
                        <div className="navigation">
                            <nav className="navbar navbar-expand-lg navbar-light "  >
                                <div className="brand-logo " >
                                    <Link to="/">
                                        <img src={Logo} className="logo-img" />
                                        <img src={LogoText} className="logo-text" />
                                    </Link>
                                </div>
                                <button className="navbar-toggler" type="button" data-toggle="collapse"
                                    data-target="#navbarsExample09" aria-controls="navbarsExample09"
                                    aria-expanded={!isNavCollapsed ? true : false} aria-label="Toggle navigation"
                                    onClick={handleNavCollapse}>
                                    <span className="navbar-toggler-icon" ></span>
                                </button>
                                <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse h-auto`}
                                >
                                    <ul className="navbar-nav me-auto scrollable-menu" >
                                        <li className="nav-item" onClick={handleNavCollapse}>
                                            <Link to="/" className="nav-link"  >Home</Link>
                                        </li>
                                        <li className="nav-item" onClick={handleNavCollapse}>
                                            <Link to="/about" className="nav-link" >About</Link>
                                        </li>
                                        <li className="nav-item" onClick={handleNavCollapse}>
                                            <Link to="/collections" className="nav-link" >Collections</Link>
                                        </li>
                                        <li className="nav-item" onClick={handleNavCollapse}>
                                            <Link to="/minting" className="nav-link" >MintNFT</Link>
                                        </li>
                                    </ul>

                                    <div className="WalletConnection_btn">

                                        {connected ?
                                            <BalanceButton handleWalletConnection={handleWalletConnection} /> :
                                            <ConnectButton handleWalletConnection={handleWalletConnection} />
                                        }
                                    </div>
                                </div>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
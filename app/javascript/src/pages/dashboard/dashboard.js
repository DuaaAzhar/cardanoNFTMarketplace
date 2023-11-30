import React, { Fragment } from "react";
import { useSelector } from 'react-redux';

import Sidebar from "../../components/userdashboard/sidebar/sidebar";
import Nfts from "../../components/userdashboard/nfts/nfts";
import connectWallet from '../../assets/connectWallet.png'
import { Route, Switch, useRouteMatch } from "react-router";
import Onsale from "../../components/userdashboard/onsale/onSale"
import Activity from "../../components/userdashboard/activity/activity";
import Settings from "../../components/userdashboard/settings/settings";
import './dashboard.scss'

export default function Dashboard() {
  const storeWalletConnectedStatus = useSelector(state => state.wallet.connected);
  let match = useRouteMatch();

  return (
    <div id="main-wrapper" className="front">
      <div className="app">
        {storeWalletConnectedStatus ?
          <Fragment>
            <Sidebar />
            <Switch>
              <Route exact path={`${match.path}/onsale`} component={Onsale} />
              <Route exact path={`${match.path}/nfts`} component={Nfts} />
              <Route exact path={`${match.path}/activity`} component={Activity} />
              <Route exact path={`${match.path}/settings`} component={Settings} />
            </Switch>
          </Fragment> :
          <Fragment>
            <section id="section1">
              <div className="hero_guest">
                <div className="container">
                  <div className="row">
                    <div className="hedline col-sm-12 text-center">
                      <h1 className="mb-3">
                        Connect your wallet and explore<span> extraordinary NFTs</span>
                      </h1>
                      <img src={connectWallet} alt="Please Connect Your Wallet" />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </Fragment>
        }
      </div>
    </div>
  )
}

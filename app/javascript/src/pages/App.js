import React, { Fragment } from "react";
import { ToastContainer } from 'react-toastify';
import { Route, Switch } from "react-router";
import 'react-toastify/dist/ReactToastify.css';
import ScrollToTop from "react-scroll-to-top";

import Header from "../components/header/headerLanding";
import Home from "./home/home";
import NftDetail from "./nftdetail/nftDetail";
import PageNotFound from "./pagenotfound/pageNotFound";
import Dashboard from "./dashboard/dashboard";
import Collectionitems from "./collectionitems/collectionitems";
import Collection from "./collection/collection"
import Minting from "./minting/minting";
import About from './about/about'
import GlobalScroll from "../util/globalScroll";

export default function App() {
  return (
    <Fragment>
      <GlobalScroll />
      <ScrollToTop
        smooth
        component={<i className="bi bi-arrow-up text-white"></i>}
        style={{
          background: "#dc3545",
          right: '20px',
          bottom: '20px',
          width: '30px',
          height: '30px',
        }}
      />
      <Header />
      <Switch>
        <Route path='/asset/:policyId/:assetName' component={NftDetail} />
        <Route exact path='/collections/:id' component={Collectionitems} />
        <Route exact path='/collections' component={Collection} />
        <Route exact path='/minting' component={Minting} />
        <Route path='/dashboard' component={Dashboard} />
        <Route path='/about' component={About} />
        <Route exact path='/' component={Home} />
        <Route component={PageNotFound} />
      </Switch>
      <ToastContainer position='bottom-right' hideProgressBar='true' theme="dark" />
    </Fragment>
  )
}

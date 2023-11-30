import React, { useEffect } from "react";
import { useDispatch } from 'react-redux';

import Banner from "../../components/banner/banner";
import NotableDrops from "../../components/notabledrops/notableDrops";
import TopCollection from "../../components/topcollection/topCollection";
import TrendingItems from "../../components/trendingitems/trendingItems";
import CreateCell from "../../components/createcell/createCell";
import Footer from "../../components/footer/footer";
import { setCollection } from "../../actions/collection";
import { setNfts } from "../../actions/nft";
import './home.scss'

export default function Home() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setCollection())
    dispatch(setNfts())
  }, [])

  return (
    <div id="main-wrapper">
      <Banner />
      <NotableDrops />
      <TopCollection />
      <TrendingItems />
      <CreateCell />
      <Footer />
    </div>
  )
}

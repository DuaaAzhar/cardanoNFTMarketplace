import React from "react";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react/swiper-react.js";
import SwiperCore, { Autoplay, Navigation } from "swiper";

import Arrows from "../arrows/bootstrapArrows";
import "./trendingItems.scss";
import NftCards from "../nftcards/nftCards";
import { collectionConstants } from "../../constants/collection.constants";
import { hex2ascii } from "hex2ascii";

SwiperCore.use([Autoplay, Navigation]);

export default function trendingitems() {
  const nfts = useSelector((state) => state.nft.nfts);


  return (
    <div className="trending-category section-padding position-relative bg-light triangle-top-light triangle-bottom-light">
      <div className="container">
        <div className="row ">
          <div className="col-xl-12">
            <div className="section-title text-center d-flex justify-content-between">
              <h2>Trending Items</h2>
              <Arrows />
            </div>
          </div>
        </div>
        <div className="row ">
          <div className=" col">
            <div className="trending-slider">
              <Swiper
                slidesPerView={4}
                spaceBetween={30}
                loop={true}
                autoplay={{
                  delay: 2500,
                  disableOnInteraction: false,
                }}
                navigation={{
                  prevEl: ".trend_prev",
                  nextEl: ".trend_next",
                }}
                breakpoints={{
                  230: {
                    slidesPerView: 1,
                  },
                  321: {
                    sliderPerView: 1,
                  },
                  375: {
                    slidesPerView: 1,
                  },
                  399: {
                    slidesPerView: 2,
                  },
                  499: {
                    slidesPerView: 2,
                  },
                  640: {
                    slidesPerView: 2,
                  },
                  768: {
                    slidesPerView: 3,
                  },
                  991: {
                    slidesPerView: 4,
                  },
                }}
                className="custom-class"
              >
                {nfts &&
                  nfts.map((item, id) => {
                    let price = item.attributes.transaction.at(-1)?.price
                    return (
                      <SwiperSlide key={id} >
                        <NftCards
                          item={item}
                          price={price}
                          btnTitle="Show Details"
                          metadata={item.attributes}
                          cardType={collectionConstants.BUY}
                          itemName={hex2ascii(item.attributes.asset_name)}
                          imageUrl={item.attributes.onchain_metadata?.image}
                          buttonfunction={`/asset/${item.attributes.policy_id}/${item.attributes.asset_name}`}
                        />
                      </SwiperSlide>
                    );
                  })}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

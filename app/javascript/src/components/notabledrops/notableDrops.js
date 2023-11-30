import React from "react";
import { useSelector } from 'react-redux';
import SwiperCore, { Autoplay, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react/swiper-react.js";
import './notableDrops.scss'
import NftCards from "../nftcards/nftCards";
import { collectionConstants } from "../../constants/collection.constants";


SwiperCore.use([Autoplay, Navigation]);

export default function NotableDrops() {

  const collections = useSelector(state => state.collection.collections);

  return (
    <div className="notable-drops section-padding bg-light triangle-top-light triangle-bottom-light">
      <div className="container">
        <div className="row">
          <div className="col-xl-12">
            <div className="section-title text-center d-flex justify-content-between mb-3">
              <h2>Notable Drops</h2>
              <div className="arrows">
                <span className="ndp_prev">
                  <i className="bi bi-arrow-left"></i>
                </span>
                <span className="ndp_next">
                  <i className="bi bi-arrow-right"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12 px-2">
            <div className="notable-drops-slider ">
              <Swiper
                slidesPerView={4}
                spaceBetween={30}
                loop={true}
                autoplay={{
                  delay: 2500,
                  disableOnInteraction: false,
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
                navigation={{
                  prevEl: ".ndp_prev",
                  nextEl: ".ndp_next",
                }}
              >
                {collections && collections.map((collection, index) => {
                  const item = collection.attributes
                  let image = undefined
                  if (item.nft_collections.length === 0)
                    return
                  else
                    image = item.nft_collections[0].onchain_metadata?.image

                  return (
                    <SwiperSlide key={index}>
                      <NftCards
                        metadata={item}
                        item={item}
                        cardType={collectionConstants.BUY}
                        buttonfunction={`/collections/${item.id}`}
                        imageUrl={image}
                        itemName={item.nft_collections[0].onchain_metadata?.name}
                        btnTitle="Explore"
                      />
                    </SwiperSlide>
                  )
                })}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

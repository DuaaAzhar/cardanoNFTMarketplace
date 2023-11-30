import React from "react";
import { Link } from "react-router-dom";
import SwiperCore, { Autoplay, Navigation } from "swiper";
import { useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from "swiper/react/swiper-react.js";
import "swiper/modules/navigation/navigation.scss"; // Navigation module
import "swiper/modules/pagination/pagination.scss"; // Pagination module
import "swiper/swiper.scss";                        // core Swiper

import NftImage from "../nftimage/nftImage";
import placeholder from "../../assets/branding/angryKongsLogoRed";

import './banner.scss'

SwiperCore.use([Autoplay, Navigation]);

export default function Banner() {
  const collections = useSelector(state => state.collection.collections)

  return (
    <div className=" position-relative p-y-80">
      <div className="container ">
        <div className="row justify-content-between align-items-center">
          <div className="col-xl-6 col-lg-5 col-sm-5 col-12 ">
            <div className="intro-content ">
              <h1>
                Discover, collect, and sell
                <span className="span text-danger"> extraordinary NFTs</span>
              </h1>
              <p>on cardano NFT marketplace</p>

              <div className="intro-btn ">
                <Link to="/collections" className="btn btn-danger">
                  Explore
                  <i className="bi bi-arrow-right "></i>
                </Link>
                <Link to="/minting" className="btn btn-warning">
                  Create
                </Link>
              </div>
            </div>
          </div>
          <div className="col-xl-5 col-lg-5 col-sm-6 col-12">
            <div className="intro-slider ">
              <Swiper
                slidesPerView={1}
                spaceBetween={30}
                loop={true}
                autoplay={{
                  delay: 2500,
                  disableOnInteraction: false,
                }}
                navigation={{
                  prevEl: ".intro_prev",
                  nextEl: ".intro_next",
                }}
              >
                {collections && collections.map((collection, index) => {
                  // TODO: Handle case if collection has no nft collection
                  const item = collection.attributes
                  const image = item.nft_collections[0]?.onchain_metadata?.image

                  return (
                    <SwiperSlide key={index}>
                      <div className="slider-item">
                        <div className="image d-flex  position-relative card-img-top justify-content-center align-items-center">
                          {
                            image ? <NftImage imageUrl={image} style="img-fluid  rounded card-img-top" /> :
                              <NftImage imageUrl={placeholder} style="img-fluid rounded card-img-top" />
                          }
                        </div>
                        <div className="slider-item-avatar py-4 pl-0 d-flex position-relative">
                          <div>
                            <h5>{item.name}</h5>
                            <p>{item.authors ? item.authors : ''}</p>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  )
                })}

                <div className="arrows">
                  <span className="intro_prev py-1 px-2">
                    <i className="bi bi-arrow-left"></i>
                  </span>
                  <span className="intro_next py-1 px-2">
                    <i className="bi bi-arrow-right"></i>
                  </span>
                </div>
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

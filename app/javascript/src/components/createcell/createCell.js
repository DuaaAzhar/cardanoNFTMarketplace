import React, { Fragment } from "react";
import { Link } from "react-router-dom";

import './createCell.scss'

export default function createCell() {
  return (
    <Fragment>
      <div className="create-sell section-padding">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-8">
              <div className="section-title text-center mb-4">
                <h2>Create and sell your NFTs</h2>
              </div>
            </div>
          </div>
          <div className="row align-items-center">
            <div className="col-xl-6 col-lg-6 col-md-6">
              <div className="create-sell-content mb-4">
                <div className="create-sell-content-icon">
                  <i className="bi bi-shield-check text-dark"></i>
                </div>
                <div>
                  <h4>Set up your wallet </h4>
                  <p>
                    Once you’ve set up your wallet of choice, connect it to
                    marketplace by clicking the wallet icon in the top right corner.
                    Learn about the wallets we support.
                  </p>
                  <Link to="/collections" className="link text-danger">
                    <strong>Explore</strong>
                    <i className="bi bi-arrow-right-short  "></i>
                  </Link>
                </div> 
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6">
              <div className="create-sell-content mb-4">
                <div className="create-sell-content-icon">
                  <i className="bi bi-x-diamond text-dark"></i>
                </div>
                <div>
                  <h4>Create your collection</h4>
                  <p>
                    Click My Collections and set up your collection. Add social
                    links, a description, profile & banner images, and set a
                    secondary sales fee.
                  </p>
                  <Link to="/collections" className="link text-danger">
                    <strong>Explore</strong>
                    <i className="bi bi-arrow-right-short"></i>
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6">
              <div className="create-sell-content mb-4">
                <div className="create-sell-content-icon">
                  <i className="bi bi-circle-half text-dark"></i>
                </div>
                <div> 
                  <h4>Add your NFTs</h4>
                  <p>
                    Upload your work (image, video, audio, or 3D art), add a
                    title and description, and customize your NFTs with
                    properties, stats, and unlockable content.
                  </p>
                  <Link to="/collections" className="link text-danger">
                    <strong>Explore</strong>
                    <i className="bi bi-arrow-right-short"></i>
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6">
              <div className="create-sell-content mb-4">
                <div className="create-sell-content-icon">
                  <i className="bi bi-circle-half text-dark"></i>
                </div>
                <div>
                  <h4>List them for sale</h4>
                  <p>
                    Choose between auctions, fixed-price listings, and
                    declining-price listings. You choose how you want to sell
                    your NFTs, and we help you sell them!
                  </p>
                  <Link to="/collections" className="link text-danger">
                    <strong>Explore</strong>
                    <i className="bi bi-arrow-right-short"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

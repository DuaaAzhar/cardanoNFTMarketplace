import React, { Fragment } from "react";
import { Link } from "react-router-dom";

import angryKongsLogoTextWhite from '../../assets/branding/angryKongsLogoTextWhite.png'
import threeKongs from '../../assets/branding/threeKongs.png'
import './footer.scss'

export default function Footer() {
  return (
    <Fragment>
      <div className="bottom ">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-12 mx-auto mt-5">
              <div className="bottom-logo">
                <img className="pb-3" src={angryKongsLogoTextWhite} alt="footer logo" width={280} />
                <p className="text-light">
                  Angry Kongs is a software house. It will create its products. Games, Mobile Applications, and Websites (e-commerce) are the specialties of the team we have gathered.
                </p>
              </div>
            </div>
            <div className="col-lg-6 col-md-12 threeKongs-style">
              <img src={threeKongs} loading="lazy" ></img>
            </div>
          </div>
        </div>
      </div>
      <div className="footer">
        <div className="container">
          <div className="row">
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
              <div className="copyright">
                <p className="text-light">
                  © Copyright 2022 <strong className="text-danger">Angry Kongs Studio</strong> All Rights Reserved
                </p>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
              <div className="footer-social">
                <ul>
                  <li>
                    <Link to="#">
                      <i className="bi bi-facebook text-light"></i>
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      <i className="bi bi-twitter text-light"></i>
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      <i className="bi bi-linkedin text-light"></i>
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      <i className="bi bi-youtube text-light"></i>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

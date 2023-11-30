import React, { Fragment } from 'react';
import Footer from '../../components/footer/footer';

import pageNotFound from '../../assets/pageNotFound.svg'
import './pageNotFound.scss'

export default function PageNotFound() {
  return (
    <Fragment>
      <div className='container-fluid'>

        <div className=" d-flex align-items-center page-not-found row  flex-column bg-light" id="main-wrapper">
          <img src={pageNotFound} className="img-fluid" alt="Page Not Found" />
        </div>

      </div>

    </Fragment>
  );
}

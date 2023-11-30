import React, {Fragment} from 'react'

import comingSoon from '../../../assets/comingSoon'

export default function Activity(){
  return (
    <Fragment>
      <div className='container front mt-5 mb-5'>
        <div className='row'>
          <div className='col col-sm col-md col-lg col-xl d-flex justify-content-center mb-5'>
            <img src={comingSoon} className="img-fluid mb-5" alt='Coming Soon'/>
          </div>
        </div>
      </div>
    </Fragment>
  )
}
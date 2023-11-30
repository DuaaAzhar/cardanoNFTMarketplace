import React from "react";

export default function introvideo() {
  return (
    <div className="intro-video section-padding bg-light triangle-top-light triangle-bottom-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-8">
            <div className="section-title text-center">
              <h2>Meet with Neftify</h2>
              <p>The NFT marketplace with everything for everyone</p>
            </div>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-xl-8">
            <div className="intro-video-play">
              <div className="play-btn">
                <a onClick={() => setOpen(true)}>
                  <i className="bi bi-play-fill"></i>
                </a>
              </div>
            </div>
            <div className="intro-video-content text-center mt-5">
              <a href="#" className="btn btn-primary px-4">
                Explore the marketplace
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { Fragment, useState} from "react";
import { Link, useHistory } from "react-router-dom";
import { FaHome, FaBriefcase, FaChartLine, FaCog, FaSignOutAlt } from "react-icons/fa";

import './sidebar.scss'

export default function Sidebar() {
  const history = useHistory()

const Signout = () => {
  window.localStorage.clear();
  history.push("/")
  window.location.reload(true);
}

  return (
    <Fragment>
      <div className="sidebar rounded-0 bg-white position-fixed top-0 bottom-0">
        <div className="menu">
          <ul>
            <li className={"active"}>
              <Link to="nfts">
                <FaHome /><span className="nav-text">NFT's</span>
              </Link>
            </li>
            <li className={"active"}>
              <Link to="onsale">
                <FaBriefcase /><span className="nav-text">On Sale</span>
              </Link>
            </li>
            <li className={"active"}>
              <Link to="activity">
                <FaChartLine /><span className="nav-text">Activity</span>
              </Link>
            </li>
            <li className={"active"}>
              <Link to="settings">
                <FaCog /><span className="nav-text">Settings</span>
              </Link>
            </li>
            <li className={"active logout"} >
              <Link to="/" onClick={Signout}>
                <FaSignOutAlt /><span className="nav-text">Signout</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </Fragment>
  );
}

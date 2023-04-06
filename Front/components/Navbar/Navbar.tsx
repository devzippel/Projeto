import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Navbar.module.css";
import Header from "../Header/header";
import { useState } from 'react';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
 config.autoAddCss = false;


/**
 * Navigation bar that shows up on all pages.
 * Rendered in _app.tsx file above the page content.
 */
export function Navbar() {
  const address = useAddress();
  const [showStakeSubMenu, setShowStakeSubMenu] = useState(false);
  const [showMarketSubMenu, setShowMarketSubMenu] = useState(false);

  const handleStakeMouseEnter = () => {
    setShowStakeSubMenu(true);
  };

  const handleStakeMouseLeave = () => {
    setShowStakeSubMenu(false);
  };

  const handleMarketMouseEnter = () => {
    setShowMarketSubMenu(true);
  };

  const handleMarketMouseLeave = () => {
    setShowMarketSubMenu(false);
  };
  return (
    <div className={styles.navContainer}>
      <nav className={styles.nav}>
        <div className={styles.navLeft}>
          <Link href="/" className={`${styles.homeLink} ${styles.navLeft}`}>
            <Image
              src="/logo.png"
              width={68}
              height={68}
              alt="Puppets Coin logo"
            />
          </Link>
          <Link href="/" className={styles.link} > 
         🏠 Home
          </Link>
          
          <div
            className={styles.link}
            onMouseEnter={handleStakeMouseEnter}
            onMouseLeave={handleStakeMouseLeave}
          > 🪙 Stake
            {showStakeSubMenu && (
              <div className={styles.submenu}>
                <Link href="/stake" className={styles.link}>
                🖼&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;NFT    &nbsp;&nbsp;               
                </Link>
                <Link href="/stakeToken" className={styles.link}>
                🪙&nbsp;&nbsp;&nbsp;&nbsp;Token 
                </Link>
              </div>
            )}
          </div>
          <Link href="/mint" className={styles.link}>
          🖼 Mint
          </Link>


          <div
            className={styles.link}
            onMouseEnter={ handleMarketMouseEnter}
            onMouseLeave={handleMarketMouseLeave}
          >🛒 Market
            {showMarketSubMenu && (
              <div className={styles.submenu}>
                <Link href="/buy" className={styles.link}>
                🖼&nbsp;&nbsp;&nbsp;&nbsp;  Buy  &nbsp;&nbsp;               
                </Link>
                <Link href="/sell" className={styles.link}>
                🪙&nbsp;&nbsp;&nbsp;&nbsp;  Sell &nbsp;&nbsp;
                </Link>
              </div>
            )}
          </div>



        </div>
        <div>
          <Header />
        </div>
        <div className={styles.navRight}>
          <div className={styles.navConnect}>
            <ConnectWallet />
          </div>
         
        </div>
      </nav>
    </div>
  );
}

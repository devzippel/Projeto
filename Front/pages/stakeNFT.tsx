import {
  ConnectWallet,
  ThirdwebNftMedia,
  useAddress,
  useContract,
  useContractRead,
  useOwnedNFTs,
  useTokenBalance,
  Web3Button,
} from "@thirdweb-dev/react";
import { BigNumber, ethers } from "ethers";
import Image from "next/image";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import NFTCard from "../components/NFTCard";
import {
  nftDropContractAddress,
  stakingContractAddress,
  tokenContractAddress,
} from "../const/contractAddresses";
import styles from "../styles/Home.module.css";



const Stake: NextPage = () => {
  const address = useAddress();
  const { contract: nftDropContract } = useContract(
    nftDropContractAddress,
    "nft-drop"
  );
  const { contract: tokenContract } = useContract(
    tokenContractAddress,
    "token"
  );
  const { contract, isLoading } = useContract(stakingContractAddress);
  const { data: ownedNfts } = useOwnedNFTs(nftDropContract, address);
  const { data: tokenBalance } = useTokenBalance(tokenContract, address);
  const [claimableRewards, setClaimableRewards] = useState<BigNumber>();
  const { data: stakedTokens } = useContractRead(
    contract,
    "getStakeInfo",
    address
  );

  useEffect(() => {
    if (!contract || !address) return;
    async function loadClaimableRewards() {
      const stakeInfo = await contract?.call("getStakeInfo", address);
      setClaimableRewards(stakeInfo[1]);
    }

    loadClaimableRewards();
  }, [address, contract]);

  async function stakeNft(id: string) {
    if (!address) return;

    const isApproved = await nftDropContract?.isApproved(
      address,
      stakingContractAddress
    );
    if (!isApproved) {
      await nftDropContract?.setApprovalForAll(stakingContractAddress, true);
    }
    await contract?.call("stake", [id]);
  }

  if (isLoading) {
    return <div>Loading</div>;
  }

  return (
    
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.heroBackground}>
          <div className={styles.heroBackgroundInner}>
            <Image
              src="/hero-gradient.png"
              width={1390}
              height={1390}
              alt="Background gradient from red to blue"
              quality={100}
              className={styles.gradient}
            />
          </div>
        </div>
        <div className={styles.containerStake}>
          <hr className={`${styles.divider} ${styles.spacerTop}`} />            
              <h2>Your Staked NFTs</h2>
              <div className={styles.nftBoxGrid}>
                {stakedTokens &&
                  stakedTokens[0]?.map((stakedToken: BigNumber) => (
                    <NFTCard
                      tokenId={stakedToken.toNumber()}
                      key={stakedToken.toString()}
                    />
                  ))}
              </div>
              <hr className={`${styles.divider} ${styles.spacerTop}`} />
            {!address ? (
            <ConnectWallet />
            
          ) : (
            <>             
              <h2>Your Tokens</h2>              
              <div className={styles.tokenGrid}>
                <div className={styles.tokenItem}>
                  <h3 className={styles.tokenLabel}>Claimable Rewards</h3>
                  <p className={styles.tokenValue}>
                    <b>
                      {!claimableRewards
                        ? "Loading..."
                        : ethers.utils.formatUnits(claimableRewards, 2)}
                    </b>{" "}
                    {tokenBalance?.symbol}
                  </p>
                
                  </div>
                  </div>         
              
                  {console.log((Number(tokenBalance?.displayValue)))}
                  <Web3Button
                    action={(contract) => contract.call("claimRewards")}
                    contractAddress={stakingContractAddress}
                  >
                    
                    Claim Rewards
                  </Web3Button>
                                  
              <hr className={`${styles.divider} ${styles.spacerTop}`} />
              
              <h2>Your Unstaked NFTs</h2>
              <div className={styles.nftBoxGrid}>
                {ownedNfts?.map((nft) => (
                  <div className={styles.nftBox} key={nft.metadata.id.toString()}>
                    <ThirdwebNftMedia
                      metadata={nft.metadata}
                      className={styles.nftMedia}
                    />
                    <h3>{nft.metadata.name}</h3>
                    <Web3Button
                      contractAddress={stakingContractAddress}
                      action={() => stakeNft(nft.metadata.id)}
                    >
                      Stake
                    </Web3Button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Stake;
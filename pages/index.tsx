import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import { AuctionListing, DirectListing } from "@thirdweb-dev/sdk";
import Link from "next/link";
import { MediaRenderer, useMarketplace } from "@thirdweb-dev/react";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const router = useRouter();

  // Loading flag to show a loading  state while we fetch the listings
  const [loadingListings, setLoadingListings] = useState<boolean>(true);
  // Here we'll store an array of listings once they come back from our request.
  const [listings, setListings] = useState<(AuctionListing | DirectListing)[]>(
    []
  );

  // Connect your marketplace smart contract here (replace this address)
  const marketplace = useMarketplace(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS // Your marketplace contract address here
  );

  useEffect(() => {
    (async () => {
      if (marketplace) {
        // Get all listings from the marketplace
        setListings(await marketplace?.getActiveListings());

        // Set loading to false when the listings are ready
        setLoadingListings(false);
      }
    })();
  }, [marketplace?.getActiveListings]);

  return (
    <>
      {/* Content */}
      <div className={styles.container}>
        {/* Top Section */}
        <h1 className={styles.h1}>NFT Marketplace w/ thirdweb + Next.JS</h1>
        <p className={styles.explain}>
          Build an NFT marketplace using{" "}
          <b>
            {" "}
            <a
              href="https://thirdweb.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.purple}
            >
              thirdweb
            </a>
          </b>{" "}
          to list your ERC721 and ERC1155 tokens for auction or for direct sale.
        </p>

        <hr className={styles.divider} />

        <div style={{ marginTop: 32, marginBottom: 32 }}>
          <Link href="/create">
            <a className={styles.mainButton} style={{ textDecoration: "none" }}>
              Create A Listing
            </a>
          </Link>
        </div>

        <div className="main">
          {
            // If the listings are loading, show a loading message
            loadingListings ? (
              <div>Loading listings...</div>
            ) : (
              // Otherwise, show the listings
              <div className={styles.listingGrid}>
                {listings.map((listing) => (
                  <div
                    key={listing.id}
                    className={styles.listingShortView}
                    onClick={() => router.push(`/listing/${listing.id}`)}
                  >
                    <MediaRenderer
                      src={listing.asset.image}
                      style={{
                        borderRadius: 16,
                        // Fit the image to the container
                        width: "100%",
                        height: "100%",
                      }}
                    />
                    <h2 className={styles.nameContainer}>
                      <Link href={`/listing/${listing.id}`}>
                        <a className={styles.name}>{listing.asset.name}</a>
                      </Link>
                    </h2>

                    <p>
                      <b>{listing.buyoutCurrencyValuePerToken.displayValue}</b>{" "}
                      {listing.buyoutCurrencyValuePerToken.symbol}
                    </p>
                  </div>
                ))}
              </div>
            )
          }
        </div>
      </div>
    </>
  );
};

export default Home;

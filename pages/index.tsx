import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import { AuctionListing, DirectListing } from "@thirdweb-dev/sdk";
import Link from "next/link";
import { useMarketplace } from "@thirdweb-dev/react";
import { ConnectWallet } from "../components/ConnectWallet";

const Home: NextPage = () => {
  // Loading flag to show a loading  state while we fetch the listings
  const [loadingListings, setLoadingListings] = useState<boolean>(true);
  // Here we'll store an array of listings once they come back from our request.
  const [listings, setListings] = useState<(AuctionListing | DirectListing)[]>(
    []
  );

  // Connect your marketplace smart contract here (replace this address)
  const marketplace = useMarketplace(
    "0x00Ae2A1b5E6dd2C69F7E9F08c777b74fe46b1ea6"
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
    <div className={styles.container}>
      <ConnectWallet />

      <div style={{ marginTop: 32, marginBottom: 32 }}>
        <Link href="/create">
          <a
            style={{ color: "blue", fontSize: 16, textDecoration: "underline" }}
          >
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
            <div>
              {listings.map((listing) => (
                <div
                  key={listing.id}
                  style={{
                    padding: 8,
                    border: "1px solid #ccc",
                    borderRadius: 16,
                    marginTop: 16,
                  }}
                >
                  <img src={listing.asset.image} style={{ maxHeight: 200 }} />
                  <h2>
                    <b>Name: </b>
                    <Link href={`/listing/${listing.id}`}>
                      <a
                        style={{
                          color: "blue",
                          fontSize: 16,
                          textDecoration: "underline",
                        }}
                      >
                        {listing.asset.name}
                      </a>
                    </Link>
                  </h2>
                  <p>
                    <b>Description: </b>
                    {listing.asset.description}
                  </p>
                  <p>
                    <b>Price Value: </b>
                    {listing.buyoutCurrencyValuePerToken.displayValue}{" "}
                    {listing.buyoutCurrencyValuePerToken.symbol}
                  </p>
                </div>
              ))}
            </div>
          )
        }
      </div>
    </div>
  );
};

export default Home;

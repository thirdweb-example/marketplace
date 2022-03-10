import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { ConnectWallet } from "@3rdweb/react";
import { useEffect, useMemo, useState } from "react";
import initMarketplace from "../lib/initMarketplace";
import { useWeb3 } from "@3rdweb/hooks";
import { AuctionListing, DirectListing } from "@thirdweb-dev/sdk";
import Link from "next/link";

const Home: NextPage = () => {
  const [loadingListings, setLoadingListings] = useState<boolean>(true);
  const [listings, setListings] = useState<(AuctionListing | DirectListing)[]>(
    []
  );
  const { provider } = useWeb3();

  // Call the initMarketplace function to initialize the marketplace
  const marketplace = useMemo(() => {
    return initMarketplace(provider);
  }, [provider]);

  useEffect(() => {
    (async () => {
      // Get all listings from the marketplace
      setListings(await marketplace.getAllListings());

      // Set loading to false when the listings are ready
      setLoadingListings(false);
    })();
  }, [marketplace]);

  console.log(listings);

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

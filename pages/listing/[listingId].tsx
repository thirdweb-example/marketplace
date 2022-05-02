import { MediaRenderer, useMarketplace } from "@thirdweb-dev/react";
import { AuctionListing, DirectListing, ListingType } from "@thirdweb-dev/sdk";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "../../styles/Home.module.css";

const ListingPage: NextPage = () => {
  // Next JS Router hook to redirect to other pages and to grab the query from the URL (listingId)
  const router = useRouter();

  // De-construct listingId out of the router.query.
  // This means that if the user visits /listing/0 then the listingId will be 0.
  // If the user visits /listing/1 then the listingId will be 1.
  const { listingId } = router.query as { listingId: string };

  // Loading flag for the UI, so we can show a loading state while we wait for the data to load.
  const [loadingListing, setLoadingListing] = useState<boolean>(true);

  // Store the bid amount the user entered into the bidding textbox
  const [bidAmount, setBidAmount] = useState<string>("");

  // Storing this listing in a state variable so we can use it in the UI once it's fetched.
  const [listing, setListing] = useState<
    undefined | DirectListing | AuctionListing
  >(undefined);

  // Initialize the marketplace contract
  const marketplace = useMarketplace(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS // Your marketplace contract address here
  );

  // When the component mounts, ask the marketplace for the listing with the given listingId
  // Using the listingid from the URL (via router.query)
  useEffect(() => {
    if (!listingId || !marketplace) {
      return;
    }
    (async () => {
      // Pass the listingId into the getListing function to get the listing with the given listingId
      const l = await marketplace.getListing(listingId);

      // Update state accordingly
      setLoadingListing(false);
      setListing(l);
    })();
  }, [listingId, marketplace]);

  if (loadingListing) {
    return <div className={styles.loadingOrError}>Loading...</div>;
  }

  if (!listing) {
    return <div className={styles.loadingOrError}>Listing not found</div>;
  }

  async function createBidOrOffer() {
    console.log("createBidOrOffer", bidAmount, listingId);
    try {
      // If the listing type is a direct listing, then we can create an offer.
      if (listing?.type === ListingType.Direct) {
        await marketplace?.direct.makeOffer(
          listingId, // The listingId of the listing we want to make an offer for
          1, // Quantity = 1
          "0xc778417E063141139Fce010982780140Aa0cD5Ab", // WETH address on Rinkeby network
          bidAmount // The offer amount the user entered
        );
      }

      // If the listing type is an auction listing, then we can create a bid.
      if (listing?.type === ListingType.Auction) {
        await marketplace?.auction.makeBid(listingId, bidAmount);
      }

      alert(
        `${
          listing?.type === ListingType.Auction ? "Bid" : "Offer"
        }created successfully!`
      );
    } catch (error) {
      console.error(error);
    }
  }

  async function buyNft() {
    try {
      // Simple one-liner for buying the NFT
      await marketplace?.buyoutListing(listingId, 1);
      alert("NFT bought successfully!");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className={styles.container} style={{}}>
      <div className={styles.listingContainer}>
        <div className={styles.leftListing}>
          <MediaRenderer
            src={listing.asset.image}
            className={styles.mainNftImage}
          />
        </div>

        <div className={styles.rightListing}>
          <h1>{listing.asset.name}</h1>
          <p>
            Owned by{" "}
            <b>
              {listing.sellerAddress?.slice(0, 6) +
                "..." +
                listing.sellerAddress?.slice(36, 40)}
            </b>
          </p>

          <h2>
            <b>{listing.buyoutCurrencyValuePerToken.displayValue}</b>{" "}
            {listing.buyoutCurrencyValuePerToken.symbol}
          </h2>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 20,
              alignItems: "center",
            }}
          >
            <button
              style={{ borderStyle: "none" }}
              className={styles.mainButton}
              onClick={buyNft}
            >
              Buy
            </button>
            <p style={{ color: "grey" }}>|</p>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
            >
              <input
                type="text"
                name="bidAmount"
                className={styles.textInput}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder="Amount"
                style={{ marginTop: 0, marginLeft: 0, width: 128 }}
              />
              <button
                className={styles.mainButton}
                onClick={createBidOrOffer}
                style={{
                  borderStyle: "none",
                  background: "transparent",
                  width: "fit-content",
                }}
              >
                Make Offer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingPage;

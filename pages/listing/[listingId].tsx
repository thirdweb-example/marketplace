import { useMarketplace } from "@thirdweb-dev/react";
import { AuctionListing, DirectListing } from "@thirdweb-dev/sdk";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "../../styles/Listing.module.css";

const ListingPage: NextPage = () => {
  // Next JS Router hook to redirect to other pages and to grab the query from the URL (listingId)
  const router = useRouter();

  // De-construct listingId out of the router.query.
  // This means that if the user visits /listing/0 then the listingId will be 0.
  // If the user visits /listing/1 then the listingId will be 1.
  // We do some weird TypeScript casting, because Next.JS thinks listingId can be an array for some reason.
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
    "0x00Ae2A1b5E6dd2C69F7E9F08c777b74fe46b1ea6" // Your address here
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
    return <div>Loading...</div>;
  }

  if (!listing) {
    return <div>Listing not found</div>;
  }

  async function createBidOrOffer() {
    try {
      // If the listing type is a direct listing, then we can create an offer.
      if (listing?.type === 0) {
        await marketplace?.direct.makeOffer(
          listingId, // The listingId of the listing we want to make an offer for
          1, // Quantity = 1
          "0xc778417E063141139Fce010982780140Aa0cD5Ab", // WETH address on Rinkeby network
          bidAmount // The offer amount the user entered
        );
      }

      // If the listing type is an auction listing, then we can create a bid.
      if (listing?.type === 1) {
        await marketplace?.auction.makeBid(listingId, bidAmount);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function buyNft() {
    try {
      // Simple one-liner for buying the NFT
      await marketplace?.buyoutListing(listingId, 1);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className={styles.container}>
      <img src={listing.asset.image} style={{ maxHeight: 400 }} />
      <h1 className={styles.title}>{listing.asset.name}</h1>
      <p className={styles.text}>
        <b>Description:</b> {listing.asset.description}
      </p>
      <p className={styles.text}>
        <b>Seller:</b> {listing.sellerAddress}
      </p>
      <p className={styles.text}>
        <b>Listing Type:</b>{" "}
        {listing.type === 0 ? "Direct Listing" : "Auction Listing"}
      </p>

      <p className={styles.text}>
        <b>Buyout Price</b> {listing.buyoutCurrencyValuePerToken.displayValue}{" "}
        {listing.buyoutCurrencyValuePerToken.symbol}
      </p>

      <div className={styles.buttonsContainer}>
        <div>
          <input
            type="text"
            placeholder="Enter bid amount"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            className={styles.textField}
          />

          <button
            className={styles.bidButton}
            onClick={() => createBidOrOffer()}
          >
            Make Bid
          </button>
        </div>

        <button className={styles.buyButton} onClick={() => buyNft()}>
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ListingPage;

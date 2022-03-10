import { useWeb3 } from "@3rdweb/hooks";
import { NATIVE_TOKEN_ADDRESS, TransactionResult } from "@thirdweb-dev/sdk";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useMemo } from "react";
import initMarketplace from "../lib/initMarketplace";
import styles from "../styles/Create.module.css";

const Home: NextPage = () => {
  // Next JS Router hook to redirect to other pages
  const router = useRouter();

  // A provider is used to "talk" to the blockchain. We use it to enable the user to perform write operations to the blockchain.
  const { provider } = useWeb3();

  // Call the initMarketplace function to initialize the marketplace
  const marketplace = useMemo(() => {
    const m = initMarketplace(provider);
    console.log("Marketplace changed:", m);
    return m;

    // Whenever provider changes (e.g. user connects wallet), re-initialize the marketplace.
  }, [provider]);

  // This function gets called when the form is submitted.
  async function handleCreateListing(e) {
    try {
      // Prevent page from refreshing
      e.preventDefault();

      // Store the result of either the direct listing creation or the auction listing creation
      let transactionResult: undefined | TransactionResult = undefined;

      // De-construct data from form submission
      const { listingType, contractAddress, tokenId, price } =
        e.target.elements;

      // Depending on the type of listing selected, call the appropriate function
      // For Direct Listings:
      if (listingType.value === "directListing") {
        transactionResult = await createDirectListing(
          contractAddress.value,
          tokenId.value,
          price.value
        );
      }

      // For Auction Listings:
      if (listingType.value === "auctionListing") {
        transactionResult = await createAuctionListing(
          contractAddress.value,
          tokenId.value,
          price.value
        );
      }

      // If the transaction succeeds, take the user back to the homepage to view their listing!
      if (transactionResult) {
        router.push(`/`);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function createAuctionListing(
    contractAddress: string,
    tokenId: string,
    price: string
  ) {
    try {
      const transaction = await marketplace.auction.createListing({
        assetContractAddress: contractAddress, // Contract Address of the NFT
        buyoutPricePerToken: price, // Maximum price, the auction will end immediately if a user pays this price.
        currencyContractAddress: NATIVE_TOKEN_ADDRESS, // NATIVE_TOKEN_ADDRESS is the crpyto curency that is native to the network. i.e. Rinkeby ETH.
        listingDurationInSeconds: 60 * 60 * 24 * 7, // When the auction will be closed and no longer accept bids (1 Week)
        quantity: 1, // How many of the NFTs are being listed (useful for ERC 1155 tokens)
        reservePricePerToken: 0, // Minimum price, users cannot bid below this amount
        startTimeInSeconds: Math.floor(Date.now() / 1000), // Start time of the auction (now)
        tokenId: tokenId, // Token ID of the NFT.
      });

      return transaction;
    } catch (error) {
      console.error(error);
    }
  }

  async function createDirectListing(
    contractAddress: string,
    tokenId: string,
    price: string
  ) {
    try {
      const transaction = await marketplace.direct.createListing({
        assetContractAddress: contractAddress, // Contract Address of the NFT
        buyoutPricePerToken: price, // Asking price, users can buy the NFT for this price.
        currencyContractAddress: NATIVE_TOKEN_ADDRESS, // NATIVE_TOKEN_ADDRESS is the crpyto curency that is native to the network. i.e. Rinkeby ETH.
        listingDurationInSeconds: 60 * 60 * 24 * 7, // When the auction will be closed and no longer accept bids (1 Week)
        quantity: 1, // How many of the NFTs are being listed (useful for ERC 1155 tokens)
        // reservePricePerToken: 0, : Direct Listings have no reserve price
        startTimeInSeconds: Math.floor(Date.now() / 1000), // Start time of the auction (now)
        tokenId: tokenId, // Token ID of the NFT.
      });

      return transaction;
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className={styles.container}>
      <form onSubmit={(e) => handleCreateListing(e)} className={styles.form}>
        <h1 className={styles.heading}>Create Listing</h1>

        {/* Toggle between direct listing and auction listing */}
        <div>
          <input
            type="radio"
            name="listingType"
            id="directListing"
            value="directListing"
            defaultChecked
          />
          <label htmlFor="directListing">Direct Listing</label>
          <input
            type="radio"
            name="listingType"
            id="auctionListing"
            value="auctionListing"
            style={{
              marginLeft: 16,
            }}
          />
          <label htmlFor="auctionListing">Auction Listing</label>
        </div>

        <label className={styles.label}>
          Contract Address
          <input type="text" name="contractAddress" className={styles.field} />
        </label>

        <label className={styles.label}>
          Token ID
          <input type="text" name="tokenId" className={styles.field} />
        </label>

        <label className={styles.label}>
          Price
          <input type="text" name="price" className={styles.field} />
        </label>

        <button type="submit" className={styles.submit}>
          Create Listing
        </button>
      </form>
    </div>
  );
};

export default Home;

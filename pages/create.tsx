import { useMarketplace } from "@thirdweb-dev/react";
import { NATIVE_TOKEN_ADDRESS, TransactionResult } from "@thirdweb-dev/sdk";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import styles from "../styles/Create.module.css";

const Create: NextPage = () => {
  // Next JS Router hook to redirect to other pages
  const router = useRouter();

  // Connect to our marketplace contract via the useMarketplace hook
  const marketplace = useMarketplace(
    "0x00Ae2A1b5E6dd2C69F7E9F08c777b74fe46b1ea6" // Your address here
  );

  // This function gets called when the form is submitted.
  async function handleCreateListing(e: any) {
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
      const transaction = await marketplace?.auction.createListing({
        assetContractAddress: contractAddress, // Contract Address of the NFT
        buyoutPricePerToken: price, // Maximum price, the auction will end immediately if a user pays this price.
        currencyContractAddress: NATIVE_TOKEN_ADDRESS, // NATIVE_TOKEN_ADDRESS is the crpyto curency that is native to the network. i.e. Rinkeby ETH.
        listingDurationInSeconds: 60 * 60 * 24 * 7, // When the auction will be closed and no longer accept bids (1 Week)
        quantity: 1, // How many of the NFTs are being listed (useful for ERC 1155 tokens)
        reservePricePerToken: 0, // Minimum price, users cannot bid below this amount
        startTimestamp: new Date(), // When the listing will start
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
      const transaction = await marketplace?.direct.createListing({
        assetContractAddress: contractAddress, // Contract Address of the NFT
        buyoutPricePerToken: price, // Maximum price, the auction will end immediately if a user pays this price.
        currencyContractAddress: NATIVE_TOKEN_ADDRESS, // NATIVE_TOKEN_ADDRESS is the crpyto curency that is native to the network. i.e. Rinkeby ETH.
        listingDurationInSeconds: 60 * 60 * 24 * 7, // When the auction will be closed and no longer accept bids (1 Week)
        quantity: 1, // How many of the NFTs are being listed (useful for ERC 1155 tokens)
        startTimestamp: new Date(0), // When the listing will start
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

export default Create;

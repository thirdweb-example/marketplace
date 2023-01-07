import {
  useContract,
  useNetwork,
  useNetworkMismatch,
} from "@thirdweb-dev/react";
import {
  ChainId,
  NATIVE_TOKEN_ADDRESS,
  TransactionResult,
} from "@thirdweb-dev/sdk";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { marketplaceContractAddress } from "../addresses";
import styles from "../styles/Home.module.css";

const Create: NextPage = () => {
  // Next JS Router hook to redirect to other pages
  const router = useRouter();
  const networkMismatch = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();

  // Connect to our marketplace contract via the useContract hook
  const { contract: marketplace } = useContract(marketplaceContractAddress, "marketplace");

  // This function gets called when the form is submitted.
  async function handleCreateListing(e: any) {
    try {
      // Ensure user is on the correct network
      if (networkMismatch) {
        switchNetwork && switchNetwork(ChainId.Goerli);
        return;
      }

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
        currencyContractAddress: NATIVE_TOKEN_ADDRESS, // NATIVE_TOKEN_ADDRESS is the crpyto curency that is native to the network. i.e. Goerli ETH.
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
        currencyContractAddress: NATIVE_TOKEN_ADDRESS, // NATIVE_TOKEN_ADDRESS is the crpyto curency that is native to the network. i.e. Goerli ETH.
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
    <form onSubmit={(e) => handleCreateListing(e)}>
      <div className={styles.container}>
        {/* Form Section */}
        <div className={styles.collectionContainer}>
          <h1 className={styles.ourCollection}>
            Upload your NFT to the marketplace:
          </h1>

          {/* Toggle between direct listing and auction listing */}
          <div className={styles.listingTypeContainer}>
            <input
              type="radio"
              name="listingType"
              id="directListing"
              value="directListing"
              defaultChecked
              className={styles.listingType}
            />
            <label htmlFor="directListing" className={styles.listingTypeLabel}>
              Direct Listing
            </label>
            <input
              type="radio"
              name="listingType"
              id="auctionListing"
              value="auctionListing"
              className={styles.listingType}
            />
            <label htmlFor="auctionListing" className={styles.listingTypeLabel}>
              Auction Listing
            </label>
          </div>

          {/* NFT Contract Address Field */}
          <input
            type="text"
            name="contractAddress"
            className={styles.textInput}
            placeholder="NFT Contract Address"
          />

          {/* NFT Token ID Field */}
          <input
            type="text"
            name="tokenId"
            className={styles.textInput}
            placeholder="NFT Token ID"
          />

          {/* Sale Price For Listing Field */}
          <input
            type="text"
            name="price"
            className={styles.textInput}
            placeholder="Sale Price"
          />

          <button
            type="submit"
            className={styles.mainButton}
            style={{ marginTop: 32, borderStyle: "none" }}
          >
            List NFT
          </button>
        </div>
      </div>
    </form>
  );
};

export default Create;

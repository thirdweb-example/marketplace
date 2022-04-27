# Marketplace With Next.JS

## Introduction

In this guide, you will learn how to create a marketplace like [OpenSea](https://opensea.io/) on the Ethereum test network!

We'll implement the following features:

- A marketplace where we can sell our NFTs!
- List NFTs for **direct sale** or for **auction** onto the marketplace.
- Allow users to **make bids** and **buy** our NFTs.

## Tools

- [**thirdweb Marketplace**](https://portal.thirdweb.com/contracts/marketplace): to facilitate the listing of NFTs and enabling users to offer, buy, and sell NFTs on the marketplace.
- [**thirdweb NFT Collection**](https://portal.thirdweb.com/contracts/nft-collection): to create an ERC721 NFT Collection that we can list onto the marketplace.
- [**thirdweb React SDK**](https://docs.thirdweb.com/react): to enable users to connect and disconnect their wallets with our website, and prompt them to approve transactions with MetaMask.
- [**thirdweb TypeScript SDK**](https://docs.thirdweb.com/typescript): to connect to our NFT Collection Smart contract via TypeScript & React hooks, mint new NFTs, create new listings, and view all of the listings for sale!
- [**Next JS Dynamic Routes**](https://nextjs.org/docs/routing/dynamic-routes): so we can have a dynamic route for each listing. eg. `listing/1` will show listing 1.

## Using This Repo

- Click on the **Use this template** button to create your own copy of this repo:

![use this template.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1651048077489/WeMVOeg6W.png)

- Create your own Marketplace contract via the thirdweb dashboard. (follow the steps in the guide below if you need extra help here)

- Replace any instances of our marketplace contract (`0x00Ae2A1b5E6dd2C69F7E9F08c777b74fe46b1ea6`) with your own contract address.

- Install the required dependencies:

```bash
npm install
# or
yarn install
```

- Run the development server:

```bash
npm run dev
# or
yarn dev
```

- Visit http://localhost:3000/ to view the demo.

Need More help? Want to understand the code a bit more? Want to set the project up yourself? Follow the guide below! 👇

---

## Creating A Marketplace

To create a marketplace contract:

- Head to the [thirdweb dashboard](https://thirdweb.com/dashboard).
- Click **Create a new contract**.
- Click **Setup Marketplace**.

Here, you can define the configuration of your marketplace contract, including the name of the marketplace, an image, and a description.

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1646703740373/e11E6ZSXc.png)

When you're ready, click **Deploy Now** ([you'll need some Testnet ETH for this](https://rinkebyfaucet.com/)).

Behind the scenes, you're actually deploying your very own smart contract. By the way, did we mention those are open source? You can check them out [here](https://github.com/thirdweb-dev/contracts/tree/main/contracts).

Once it has successfully deployed, it should look like this:

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1646703929832/2pmcP9TOQ.png)

#### About the Marketplace Module

The Thirdweb marketplace module supports any [ERC 1155](https://eips.ethereum.org/EIPS/eip-1155) and [ERC 721](https://eips.ethereum.org/EIPS/eip-721) token. If you don't know what those are, you can just think of them as two different types of NFTs.

This is important because it means the marketplace can list any NFT, from any NFT collection. For example, this [NFT of our CEO's beautiful face](https://opensea.io/assets/0xc1d4b2e088084beac62a55ac4f956601e0a60dbf/2) could go onto the marketplace.

There are a few conditions that need to be met in order for someone to list an NFT onto the marketplace:

- They must **own **the NFT they're trying to list.
- They must have **permission** to list onto the marketplace (you control this).
- They also need a little bit of ETH to cover the **gas fees** of interacting with the contract.

Alright, enough talking! Let's write some code!

## Initializing the project

To create your marketplace project, lets head to the command line and run:

```bash
npx create-next-app@latest --ts my-marketplace
```

Next, (no pun intended), change directory into your newly created Next App.

```bash
cd .\my-marketplace\
```

### Dependencies

Thirdweb comes jam-packed with features and libraries that help you build in the languages you know and love.

Let's install them by running:

```bash
npm install @thirdweb-dev/react @thirdweb-dev/sdk ethers
```

Cool! Now, lets jump into the code by running:

```bash
code .
```

This will open your project up in **Visual Studio Code**. Cool little trick right? 😉

To get your local environment setup, run:

```bash
npm run dev
```

And visit http://localhost:3000/

## Add the Thirdweb Provider To Your App

Whenever you work with the blockchain and interact with tokens or contracts on a website, you need to use a web wallet. The thirdweb React provider makes it straightforward to let your users connect their wallets to your website, and it abstracts away all the boilerplate you would usually have to write.

Open `pages/_app.tsx` and replace everything in this file with the following code:

```ts
// pages/_app.tsx
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChainId } from "@thirdweb-dev/sdk";
import { ThirdwebProvider } from "@thirdweb-dev/react";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    // Wrap our app in the 3rdweb provider context.
    // This allows us to access thirdweb hooks anywhere in our application.
    <ThirdwebProvider desiredChainId={ChainId.Rinkeby}>
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
};

export default MyApp;
```

If you are curious about the ThirdwebProvider and how its magic works behind the scenes, [we have another great tutorial here](https://portal.thirdweb.com/guides/add-connectwallet-to-your-website) that goes into more depth.

## Signing Users In With Their Wallets

The first thing we'll want users to do is to sign in with their wallets.

For this application, we'll ask users to connect their wallets on the homepage.

Let's create a component that enables user's to connect with [Metamask](https://metamask.io/).

Create a new folder called `components`, and a file called `ConnectWallet.tsx` within our new folder.

Here's the code for our user's to connect their wallets:

```ts
import { useAddress, useMetamask } from "@thirdweb-dev/react";

export const ConnectWallet = () => {
  // A hook to enable users to connect with MetaMask
  const connectWithMetamask = useMetamask();
  // Once connected, you can get the connected wallet information from anywhere (address, signer)
  const address = useAddress();
  return (
    <div>
      {address ? (
        <h4>Connected as {address}</h4>
      ) : (
        <button onClick={connectWithMetamask}>Connect Metamask Wallet</button>
      )}
    </div>
  );
};
```

Awesome! Now, let's change the `pages/index.tsx` file to look like this:

```ts
// pages/index.tsx
import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { ConnectWallet } from "../components/ConnectWallet";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <ConnectWallet />
    </div>
  );
};

export default Home;
```

Now you have a button that connects users to the correct network, and displays their balance once they're connected!

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1647477154244/dWy5I0zBr.png)

That's a basic homepage already. It doesn't let a user do much besides connecting their wallet, but it's a good base for any other project you might have in mind. Before we continue, we need to have another word, though.

## Displaying Listings On The Marketplace

Now we can sign users in, let's show them what we have for sale.

To do that, we'll use another hook, called `useMarketplace`.

We'll call `getActiveListings` from the marketplace, which grabs all of the listings on the smart contract that haven't expired or already sold. We'll go ahead and store them in state when they're ready, and display it to our users.

Here's how that looks in code:

### Grabbing all listings via the marketplace.getAllListings method\*\*

```ts
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
    "0x0000000000000000000000000000" // Your address here
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

  return <div></div>;
};

export default Home;
```

Cool, now that we have all of the active listings, let show them in the UI:

**Displaying listings:**

```ts
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
```

## Creating Listings

Now we are done with the home page, lets create some listings to display!

In this guide, we'll also quickly go through the process of creating an NFT Collection, so that we can play around with some NFTs on the marketplace!

If you already have NFTs that you can play around with on the Rinkeby network, feel free to use those instead and skip this optional step.

## (Optional) Creating An NFT Module

Head back to the [dashboard](https://thirdweb.com/dashboard) and create a new contract.

To create an NFT Collection, go to **Create NFTs and Tokens** > **NFT Collection**

Configure your NFT Collection to your liking, and it should look something like this:

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1646715956076/hXQm1CtM7.png)

Great job! You just deployed another [smart contract](https://github.com/thirdweb-dev/contracts/blob/main/contracts/token/TokenERC721.sol) behind the scenes.

Now, let's go ahead and mint our very own NFT via the UI!

To do that, while you're in the NFT Collection, click the **Mint** button.

Create your awesome NFT and click **Mint NFT**!

Here's how it should look:

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1646716254389/oMV5AEfkL.png)

Great work, now let's head back to the marketplace guide.

## Listing Items on the marketplace

Head back to your code and create a page in the `pages` folder called `create.tsx`.

There's a few bits of code to unpack here that we'll go through step by step.

Firstly, let's import all of the stuff we'll need to use on this page:

```ts
import { useMarketplace } from "@thirdweb-dev/react";
import { NATIVE_TOKEN_ADDRESS, TransactionResult } from "@thirdweb-dev/sdk";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import styles from "../styles/Create.module.css";
```

Next, let's create a function that handles creating a listing.

Before we dive into the code for that, it's important to know that there are two different types of listings in thirdweb.

1. Auction Listings
2. Direct Listings

**Auction Listings**: listings that have a set time period that users can bid. At the end of the time period, the auction will end, and the winning bid will win the auction.

**Direct Listings**: listings that only finish if the seller decides to accept an offer, or if somebody pays the full price of the listing.

Both listing types allow potential buyers to place bids or buyout the listing by paying the full asking price (AKA Buyout Price).

Alright, with that background information, lets create some functions to list an item onto the marketplace, plus a little extra within the `create.tsx` page.

It maye be intimidating, but we've done our best to comment on what's going on at every step of the way.

**Declaring our functional page and adding some useful hooks**

```ts
const Create: NextPage = () => {
  // Next JS Router hook to redirect to other pages
  const router = useRouter();

  // Connect to our marketplace contract via the useMarketplace hook
  const marketplace = useMarketplace(
    "0x0000000000000000000000000000" // Your address here
  );

  return <div></div>;
};

export default Create;
```

**Function that gets run when the form is submitted**

```ts
// This function gets called when the form is submitted.
// The user has provided:
// - contract address
// - token id
// - type of listing (either auction or direct)
// - price of the NFT
async function handleCreateListing(e) {
  try {
    // Prevent page from refreshing
    e.preventDefault();

    // Store the result of either the direct listing creation or the auction listing creation
    let transactionResult: undefined | TransactionResult = undefined;

    // De-construct data from form submission
    const { listingType, contractAddress, tokenId, price } = e.target.elements;

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
```

**Create Auction Type Listing**

```ts
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
      startTimestamp: new Date(), // When the listing will start (now)
      tokenId: tokenId, // Token ID of the NFT.
    });

    return transaction;
  } catch (error) {
    console.error(error);
  }
}
```

**Create Direct Type Listing**

```ts
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
      startTimestamp: new Date(0), // When the listing will start (now)
      tokenId: tokenId, // Token ID of the NFT.
    });

    return transaction;
  } catch (error) {
    console.error(error);
  }
}
```

**Render a form where users can write the NFT they want to list into**

```ts
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
```

**Some styles for our form** in `/styles/Create.module.css`

```css
.container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 2rem;
}

.form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.label {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  margin-top: 16px;
  margin-bottom: 8px;
}

.heading {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.field {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.submit {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  background: #0070f3;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 16px;
}
```

Please feel free to refer to the source code if you find that easier! 😅

Now, let's go ahead and list our NFT that we created inside our NFT Collection.

First, let's copy the NFT's contract address via the thirdweb dashboard and also note it's tokenId (which should be `0` assuming its the first one you made in the collection).

Sweet! Let's fill out our form with the NFT information, like so:

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1646720063106/PcdFevw_R.png)

Click **Create Listing**!

Boom!

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1646740239466/V51q2-kGl.png)

You'll be asked for two transactions:

1. Approve the marketplace to sell your NFTs while the NFT still lives in your wallet. (`setApprovalForAll`)
2. Create the listing on the marketplace.

If everything worked as planned, after you approve these two transactions, you should now see the listing you just created on the home page!

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1646741013827/J-BXaIIc4.png)

Nice 😎

## Viewing A Listing

On the home page, we provide a `Link` on each listing's name to a URL that looks like: `/listing/${listing.id}`.

This is using [Next JS's Dynamic Routes](https://nextjs.org/docs/routing/dynamic-routes).

This route will be used to display any listing in detail, and we'll use this page to show some buttons where users can **buy **or **place a bid ** on the listing.

_Side Note: If you're familiar with Next.JS, we could use `getStaticProps` and `getStaticPaths` to statically generate each listing page at build time for super fast performance. But, that's out of scope for this guide!_

The way that dynamic routes work in Next.JS is that you create a folder inside the pages folder, called `listing`, and within that folder, create a `[listingId].tsx` file.

Now, whenever a user visits the route `/listing/<listing id here>`, we show them the appropriate listing page, by performing some logic inside this component to fetch the listing by it's `id`. Let's see how that looks in code.

```ts
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

  return <></>;
};

export default ListingPage;
```

Alright now lets add some code to fetch the listing, and some basic UI to show the listing in detail!

There's a few parts to it, so let's break it down again. Here's the source code.

**Fetching The Listing**

```ts
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
  "0x90AC8dFF76C1692dD494e261dac5D0f6684B0674"
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
```

**Displaying Listing Information on the UI**

```ts
  if (loadingListing) {
    return <div>Loading...</div>;
  }

  if (!listing) {
    return <div>Listing not found</div>;
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

          <button className={styles.bidButton}>Make Bid</button>
        </div>

        <button className={styles.buyButton}>Buy Now</button>
      </div>
    </div>
  );
};

export default ListingPage;
```

**Add some styles, in a new file called at `styles/Listing.module.css`**

```css
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  height: 100vh;
  margin-top: 10%;
}

.title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  margin-top: 1rem;
}

.text {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.buttonsContainer {
  margin-top: 2rem;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin-bottom: 1rem;
  gap: 1rem;
}

.bidButton {
  border: 1px solid #0070f3;
  border-radius: 5px;
  padding: 0.5rem;
  font-size: 1rem;
}

.buyButton {
  background-color: #0070f3;
  border-radius: 5px;
  padding: 0.5rem;
  font-size: 1rem;
  color: white;
}

.textField {
  border: 1px solid #0070f3;
  border-radius: 5px;
  padding: 0.5rem;
  font-size: 1rem;
}
```

And voilà! You've got yourself a listing, that should look like this:

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1646800967890/51O25gjjr.png)

Now let's get users bidding and buying! 😎

## Making Bids / Making Offers

In thirdweb, making offers below the asking price of a listing has different behaviour, depending on whether the listing is an **auction **or a **direct **listing.

### Bids

**Bids** are made on **Auction Listings**. Bids have a few unique characteristics, they:

- Automatically get refunded when somebody makes a higher bid on the same listing.
- Bids must be made in the currency that the listing was created with. On ETH marketplaces, bids are placed in wETH. (Wrapped ETH)

### Offers

**Offers** are made on **Direct Listings**. Offers are different from bids in a few ways:

- Offers can be made in any currency.
- Multiple offers can exist at the same time on one listing, unlike bids.

Hopefully that clarifies the difference between the two.

Now let's start writing some code to enable users to make bids and make offers!

### The Code

**Creating A Bid / Offer**

```ts
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
```

**Buying the NFT**

```ts
async function buyNft() {
  try {
    // Simple one-liner for buying the NFT
    await marketplace?.buyoutListing(listingId, 1);
  } catch (error) {
    console.error(error);
  }
}
```

Now let's attach these functions to their respective buttons that we created:

```ts
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
```

Great work! Now let's try it out!

To test that it works as you expect, feel free to create a new wallet, so that you know for sure that the funds and NFTs are being exchanged between the two wallets.

As we mentioned briefly, in order to make bids, we'll need some Rinkeby wETH, which is the ERC20 token Wrapped Ether.

## Getting Wrapped ETH

To add WETH to MetaMask, click the `Import tokens` button down the bottom.
![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1646804883944/52c-N9meM.png)

The `Token Contract Address` is `0xc778417E063141139Fce010982780140Aa0cD5Ab`.

The process of getting WETH on Rinkeby is a little strange, you send any amount of Rinkeby ETH to the Rinkeby WETH contract address: `0xc778417E063141139Fce010982780140Aa0cD5Ab`, and it sends the same amount back to you in Wrapped Eth.

You can send the Rinkeby ETH via your MetaMask wallet.

**PLEASE ENSURE YOU ARE ON THE RINKEBY TEST NETWORK. DO NOT DO THIS ON MAINNET!**

Once you've got your wETH showing up in Metamask, you're good to start bidding.

It should look like this:

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1646805077152/OXmnNF0c3.png)

Awesome. Back to the testing!

Let's try it out, and click on our `Buy` button! This will pay the full price for the NFT, and once you accept the transaction request, head back to the homepage, and you'll notice the listing is no longer displayed!

**Magic!**

The wallet that bought the NFT now owns the token, the listing has been closed, and the funds have been transferred to the seller.

If you check out the NFT Module you created (if you created one), you can see that it is now owned by the buyer in there!

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1646871519785/P__kxB-cA.png)

## Conclusion

The thirdweb marketplace takes the heavy lifting out of your full stack development process. Our engineering experts have designed the smart contracts with security and safety in mind, enabling you to focus on shipping 🚢!

In this guide, we've successfully:

- Built a full-stack NFT marketplace project.
- Created direct and auction listings with NFTs we minted.
- Received bids and sold our NFTs via the marketplace!

## Join our Discord!

For any questions, suggestions, join our discord at [https://discord.gg/thirdweb](https://discord.gg/thirdweb).

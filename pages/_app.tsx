import React from "react";
import type { AppProps } from "next/app";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import "../styles/globals.css";
import Head from "next/head";
import ThirdwebGuideFooter from "../components/ThirdwebGuideFooter";
import ThirdwebGuideOverlay from "../components/ThirdwebGuideOverlay";
import Header from "../components/Header";

// This is the chainId your dApp will work on.
const activeChainId = ChainId.Rinkeby;

function MyApp({ Component, pageProps }: AppProps) {
  const [showGuideOverlay, setShowGuideOverlay] = React.useState(false);
  return (
    <ThirdwebProvider desiredChainId={activeChainId}>
      <ThirdwebGuideOverlay
        show={showGuideOverlay}
        setShow={setShowGuideOverlay}
      />
      <Head>
        <title>thirdweb Marketplace with Next.JS</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Learn How To Use Thirdweb's Marketplace with Next.JS To List Your NFTs For Sale, Accept Bids, and Buy NFTs"
        />
        <meta
          name="keywords"
          content="Thirdweb, Marketplace, NFT Marketplace Tutorial, NFT Auction Tutorial, How To Make OpenSea"
        />
      </Head>
      <Header />
      <Component {...pageProps} />
      <ThirdwebGuideFooter onLearnMore={() => setShowGuideOverlay(true)} />
    </ThirdwebProvider>
  );
}

export default MyApp;

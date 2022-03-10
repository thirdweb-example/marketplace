import "../styles/globals.css";
import { ThirdwebProvider } from "@3rdweb/react";
import type { AppProps } from "next/app";

const MyApp = ({ Component, pageProps }: AppProps) => {
  // Which networks do you want to support?
  // Rinkeby has the chainId of 4, so that's why that's in here.
  const supportedChainIds = [4];

  // Which wallet providers do you want to support?
  //  injected - MetaMask
  //  magic - Magic Link
  //  walletconnect - Wallet Connect
  //  walletlink - Coinbase Wallet
  const connectors = {
    injected: {},
    walletconnect: {},
    walletlink: {
      appName: "thirdweb - demo",
      url: "https://thirdweb.com",
      darkMode: false,
    },
  };

  return (
    // Wrap our app in the 3rdweb provider context.
    // This allows us to access thirdweb hooks anywhere in our application.
    <ThirdwebProvider
      connectors={connectors}
      supportedChainIds={supportedChainIds}
    >
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
};

export default MyApp;

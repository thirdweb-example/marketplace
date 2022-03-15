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

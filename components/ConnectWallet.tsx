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

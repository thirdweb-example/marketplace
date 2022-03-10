import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { Web3Provider } from "@ethersproject/providers";

/**
 * This is how we initialize the marketplace SDK.
 * If a provider is passed in that is not undefined, it allows us to perform write operations for the current user.
 * If the provider is undefined, it will use a public RPC connection, which only enables read operations.
 */
export default function initMarketplace(provider: Web3Provider | undefined) {
  console.log(provider, " in initMarketplace");

  const sdk = new ThirdwebSDK(
    provider === undefined
      ? // Put your RPC URL here (or use this public one (not recommended)):
        // This is a public read-only access to the marketplace contract.
        "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
      : // If a provider is provided, use it to gain write-access on behalf of the user.
        provider.getSigner()
  );

  const marketplaceContract = sdk.getMarketplace(
    // Your marketplace contract address here
    "0x926aC8963419Bd4811640Ae8124e0e9b2734cb45"
  );

  return marketplaceContract;
}

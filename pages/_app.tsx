import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";

import {
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
  wallet,
} from '@rainbow-me/rainbowkit';
import { Chain, chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

const ALCHEMY_ID = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || "";

const anvilLocalChain: Chain = {
  id: 0x7a69,
  name: 'LocalHost',
  network: 'ethereum',
  nativeCurrency: {
    decimals: 18,
    name: 'LocalHost',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: 'http://localhost:8545',
  },
  testnet: false,
}

const { chains, provider, webSocketProvider } = configureChains(
  [chain.goerli, anvilLocalChain],
  [
    alchemyProvider({ alchemyId: ALCHEMY_ID }),
    jsonRpcProvider({
      rpc: (chain) => {
        if (chain.id !== anvilLocalChain.id) return null
        return { http: chain.rpcUrls.default }
      },
    }),
  ]
);

const { wallets } = getDefaultWallets({
  appName: 'NFT Dapp Demo',
  chains,
});

const demoAppInfo = {
  appName: 'NFT Dapp Demo',
};

const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: 'Other',
    wallets: [
      wallet.argent({ chains }),
      wallet.trust({ chains }),
      wallet.ledger({ chains }),
    ],
  },
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  // @ts-ignore
  webSocketProvider,
});

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider appInfo={demoAppInfo} chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default App;

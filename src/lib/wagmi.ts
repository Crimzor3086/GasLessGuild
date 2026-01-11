import { createConfig, http } from 'wagmi'
import { arbitrum, arbitrumSepolia } from 'wagmi/chains'
import { injected, metaMask, walletConnect } from '@wagmi/connectors'

// Get Reown (formerly WalletConnect) project ID from environment
// Get your project ID from https://cloud.reown.com
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'default-project-id'

export const config = createConfig({
  chains: [arbitrum, arbitrumSepolia],
  connectors: [
    metaMask(), // MetaMask first - primary connector
    injected(), // Fallback for other injected wallets
    walletConnect({ projectId }), // Mobile wallet support
  ],
  transports: {
    [arbitrum.id]: http(),
    [arbitrumSepolia.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}


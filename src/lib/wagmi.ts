import { createConfig, http } from 'wagmi'
import { arbitrum, arbitrumSepolia } from 'wagmi/chains'
import { injected, metaMask, walletConnect } from '@wagmi/connectors'

// Get project ID from environment or use a default for development
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'default-project-id'

export const config = createConfig({
  chains: [arbitrum, arbitrumSepolia],
  connectors: [
    injected(),
    metaMask(),
    walletConnect({ projectId }),
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


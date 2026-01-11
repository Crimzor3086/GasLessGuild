import { createConfig, http } from 'wagmi'
import { arbitrum, arbitrumSepolia } from 'wagmi/chains'
import { injected, walletConnect } from '@wagmi/connectors'

// Get Reown (formerly WalletConnect) project ID from environment
// Get your project ID from https://cloud.reown.com
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'default-project-id'

// Build connectors array - use injected first to avoid constructor issues
const connectors = [
  injected({
    target: 'metaMask',
  }),
  injected(),
]

// Only add walletConnect if projectId is valid
if (projectId && projectId !== 'default-project-id') {
  connectors.push(
    walletConnect({ 
      projectId,
    })
  )
}

export const config = createConfig({
  chains: [arbitrum, arbitrumSepolia],
  connectors,
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


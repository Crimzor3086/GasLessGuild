import { useReadContract } from 'wagmi'
import { useAccount } from 'wagmi'
import { REWARD_TOKEN_ADDRESS, REWARD_TOKEN_ABI, REWARD_NFT_ADDRESS, REWARD_NFT_ABI } from '@/lib/contracts'
import { Address } from 'viem'

export function useRewardTokenBalance(address?: Address) {
  const { address: accountAddress } = useAccount()
  const targetAddress = address || accountAddress

  const { data, isLoading, error } = useReadContract({
    address: REWARD_TOKEN_ADDRESS as Address,
    abi: REWARD_TOKEN_ABI,
    functionName: 'balanceOf',
    args: targetAddress ? [targetAddress] : undefined,
    query: {
      enabled: !!targetAddress,
    },
  })

  return {
    balance: data ? Number(data as bigint) : 0,
    isLoading,
    error,
  }
}

export function useRewardNFTs(address?: Address) {
  const { address: accountAddress } = useAccount()
  const targetAddress = address || accountAddress

  const { data, isLoading, error } = useReadContract({
    address: REWARD_NFT_ADDRESS as Address,
    abi: REWARD_NFT_ABI,
    functionName: 'tokensOfOwner',
    args: targetAddress ? [targetAddress] : undefined,
    query: {
      enabled: !!targetAddress,
    },
  })

  return {
    tokenIds: (data as bigint[])?.map((id) => Number(id)) || [],
    isLoading,
    error,
  }
}


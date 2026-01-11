import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { GUILD_FACTORY_ADDRESS, GUILD_FACTORY_ABI, GUILD_ABI } from '@/lib/contracts'
import { Address } from 'viem'

export function useGuildFactory() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed, error: receiptError } = useWaitForTransactionReceipt({
    hash,
  })

  const createGuild = async (name: string, description: string, category: string) => {
    try {
      const txHash = await writeContract({
        address: GUILD_FACTORY_ADDRESS as Address,
        abi: GUILD_FACTORY_ABI,
        functionName: 'createGuild',
        args: [name, description, category],
      })
      return txHash
    } catch (err) {
      // Re-throw to let the component handle it
      throw err
    }
  }

  const removeGuild = async (guildAddress: Address) => {
    try {
      const txHash = await writeContract({
        address: GUILD_FACTORY_ADDRESS as Address,
        abi: GUILD_FACTORY_ABI,
        functionName: 'removeGuild',
        args: [guildAddress],
        // Add gas estimation override to prevent issues
        gas: undefined, // Let wagmi estimate, but we'll catch errors
      })
      return txHash
    } catch (err: any) {
      // Provide more helpful error messages
      const errorMessage = err?.message || err?.toString() || 'Unknown error'
      if (errorMessage.includes('execution reverted') || errorMessage.includes('revert')) {
        // Try to extract the revert reason
        if (errorMessage.includes('Only the guild master')) {
          throw new Error('Only the guild master can remove this guild')
        }
        if (errorMessage.includes('Invalid guild address')) {
          throw new Error('Invalid guild address')
        }
        if (errorMessage.includes('Not authorized')) {
          throw new Error('Contract authorization error. The contracts may need to be re-deployed with updated permissions.')
        }
        throw new Error('Transaction would revert. Please verify you are the guild master and the contracts are properly configured.')
      }
      throw err
    }
  }

  return {
    createGuild,
    removeGuild,
    isPending: isPending || isConfirming,
    isSuccess: isConfirmed,
    error: error || receiptError,
    hash,
  }
}

export function useAllGuilds() {
  const { data: guildAddresses, isLoading, error } = useReadContract({
    address: GUILD_FACTORY_ADDRESS as Address,
    abi: GUILD_FACTORY_ABI,
    functionName: 'getAllGuilds',
  })

  return {
    guildAddresses: (guildAddresses as Address[]) || [],
    isLoading,
    error,
  }
}

export function useGuildInfo(guildAddress: Address | undefined) {
  const { data, isLoading, error } = useReadContract({
    address: GUILD_FACTORY_ADDRESS as Address,
    abi: GUILD_FACTORY_ABI,
    functionName: 'getGuildInfo',
    args: guildAddress ? [guildAddress] : undefined,
    query: {
      enabled: !!guildAddress,
    },
  })

  if (!data) return { guildInfo: null, isLoading, error }

  const [name, description, category, master, memberCount] = data as [string, string, string, Address, bigint]

  return {
    guildInfo: {
      name,
      description,
      category,
      master,
      memberCount: Number(memberCount),
      address: guildAddress!,
    },
    isLoading,
    error,
  }
}

export function useGuild(guildAddress: Address | undefined) {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const joinGuild = async () => {
    if (!guildAddress) return
    return writeContract({
      address: guildAddress,
      abi: GUILD_ABI,
      functionName: 'joinGuild',
    })
  }

  const createTask = async (title: string, description: string, rewardPoints: bigint, rewardNFT: boolean) => {
    if (!guildAddress) return
    return writeContract({
      address: guildAddress,
      abi: GUILD_ABI,
      functionName: 'createTask',
      args: [title, description, rewardPoints, rewardNFT],
    })
  }

  const completeTask = async (taskId: bigint) => {
    if (!guildAddress) return
    return writeContract({
      address: guildAddress,
      abi: GUILD_ABI,
      functionName: 'completeTask',
      args: [taskId],
    })
  }

  return {
    joinGuild,
    createTask,
    completeTask,
    isPending: isPending || isConfirming,
    isSuccess: isConfirmed,
    error,
    hash,
  }
}

export function useGuildTasks(guildAddress: Address | undefined) {
  const { data: taskCount, isLoading: isLoadingCount } = useReadContract({
    address: guildAddress,
    abi: GUILD_ABI,
    functionName: 'getTaskCount',
    query: {
      enabled: !!guildAddress,
    },
  })

  // Note: In a real implementation, you'd want to fetch all tasks
  // This is a simplified version that assumes tasks are indexed 0 to taskCount-1
  return {
    taskCount: taskCount ? Number(taskCount) : 0,
    isLoading: isLoadingCount,
  }
}

export function useTask(guildAddress: Address | undefined, taskId: number) {
  const { data, isLoading, error } = useReadContract({
    address: guildAddress,
    abi: GUILD_ABI,
    functionName: 'getTask',
    args: [BigInt(taskId)],
    query: {
      enabled: !!guildAddress && taskId >= 0,
    },
  })

  if (!data) return { task: null, isLoading, error }

  const [title, description, rewardPoints, rewardNFT, completed, creator] = data as [
    string,
    string,
    bigint,
    boolean,
    boolean,
    Address,
  ]

  return {
    task: {
      id: taskId,
      title,
      description,
      rewardPoints: Number(rewardPoints),
      rewardNFT,
      completed,
      creator,
    },
    isLoading,
    error,
  }
}

export function useMemberReputation(guildAddress: Address | undefined, memberAddress: Address | undefined) {
  const { data, isLoading, error } = useReadContract({
    address: guildAddress,
    abi: GUILD_ABI,
    functionName: 'getMemberReputation',
    args: memberAddress ? [memberAddress] : undefined,
    query: {
      enabled: !!guildAddress && !!memberAddress,
    },
  })

  return {
    reputation: data ? Number(data as bigint) : 0,
    isLoading,
    error,
  }
}


import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { GUILD_FACTORY_ADDRESS, GUILD_FACTORY_ABI, GUILD_ABI } from '@/lib/contracts'
import { Address } from 'viem'

export function useGuildFactory() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const createGuild = async (name: string, description: string, category: string) => {
    return writeContract({
      address: GUILD_FACTORY_ADDRESS as Address,
      abi: GUILD_FACTORY_ABI,
      functionName: 'createGuild',
      args: [name, description, category],
    })
  }

  return {
    createGuild,
    isPending: isPending || isConfirming,
    isSuccess: isConfirmed,
    error,
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


/**
 * Utility functions for handling blockchain/wallet errors
 */

export interface BlockchainError {
  code?: number;
  message?: string;
  data?: any;
}

/**
 * Checks if an error is a user cancellation (should be handled silently)
 */
export function isUserCancellation(error: BlockchainError | Error | any): boolean {
  const errorCode = error?.code;
  const errorMessage = (error?.message || error?.toString() || '').toLowerCase();
  
  return (
    errorCode === 4001 || // User rejection code
    errorMessage.includes('user rejected') ||
    errorMessage.includes('user denied') ||
    errorMessage.includes('user cancelled')
  );
}

/**
 * Checks if an error is an authorization error (needs user action)
 */
export function isAuthorizationError(error: BlockchainError | Error | any): boolean {
  const errorMessage = (error?.message || error?.toString() || '').toLowerCase();
  
  return (
    errorMessage.includes('not been authorized') ||
    errorMessage.includes('unauthorized') ||
    errorMessage.includes('not authorized')
  );
}

/**
 * Checks if an error is a network error
 */
export function isNetworkError(error: BlockchainError | Error | any): boolean {
  const errorCode = error?.code;
  const errorMessage = (error?.message || error?.toString() || '').toLowerCase();
  
  return (
    errorCode === -32603 || // Internal JSON-RPC error
    errorMessage.includes('failed to fetch') ||
    errorMessage.includes('network error') ||
    errorMessage.includes('timeout')
  );
}

/**
 * Gets a user-friendly error message for blockchain errors
 */
export function getErrorMessage(error: BlockchainError | Error | any): {
  title: string;
  description: string;
  variant?: 'default' | 'destructive';
} {
  if (isUserCancellation(error)) {
    return {
      title: '',
      description: '',
      variant: 'default',
    };
  }
  
  if (isAuthorizationError(error)) {
    return {
      title: 'MetaMask Authorization Required',
      description: 'Please click the MetaMask extension icon and approve the connection request to authorize this site.',
      variant: 'default',
    };
  }
  
  if (isNetworkError(error)) {
    return {
      title: 'Network Error',
      description: 'Unable to connect to the network. Please check your internet connection and try again.',
      variant: 'destructive',
    };
  }
  
  return {
    title: 'Error',
    description: error?.message || 'An unexpected error occurred. Please try again.',
    variant: 'destructive',
  };
}


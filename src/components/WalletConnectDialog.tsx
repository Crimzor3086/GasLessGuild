import { useState } from "react";
import { useAccount, useDisconnect, useConnect, useChainId, useSwitchChain } from "wagmi";
import { arbitrum, arbitrumSepolia } from "wagmi/chains";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Wallet, Copy, Check, ExternalLink, Loader2, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface WalletConnectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Wallet connector icons mapping
const getWalletIcon = (name: string) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes("metamask")) {
    return "🦊";
  } else if (lowerName.includes("walletconnect") || lowerName.includes("reown")) {
    return "🔗";
  } else if (lowerName.includes("injected") || lowerName.includes("browser")) {
    return "🌐";
  }
  return "💼";
};

export function WalletConnectDialog({ open, onOpenChange }: WalletConnectDialogProps) {
  const { address, isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect, connectors, isPending, error, isSuccess } = useConnect();
  const chainId = useChainId();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const [copied, setCopied] = useState(false);
  const [connectingConnectorId, setConnectingConnectorId] = useState<string | null>(null);

  const isArbitrumNetwork = chainId === arbitrum.id || chainId === arbitrumSepolia.id;

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Address copied!",
        description: "Wallet address copied to clipboard.",
      });
    }
  };

  const getExplorerUrl = (addr: string) => {
    const explorerBase = chainId === arbitrum.id 
      ? "https://arbiscan.io" 
      : "https://sepolia.arbiscan.io";
    return `${explorerBase}/address/${addr}`;
  };

  const handleConnect = async (connector: any) => {
    setConnectingConnectorId(connector.uid);
    try {
      await connect({ connector });
    } catch (error: any) {
      console.error('Connection error:', error);
      toast({
        title: "Connection Failed",
        description: error?.message || "Failed to connect wallet. Please make sure MetaMask is unlocked and try again.",
        variant: "destructive",
      });
    }
  };

  // Close dialog when connection succeeds
  if (isSuccess && isConnected && open) {
    setTimeout(() => {
      onOpenChange(false);
      setConnectingConnectorId(null);
    }, 500);
  }

  const handleSwitchNetwork = async () => {
    try {
      await switchChain({ chainId: arbitrumSepolia.id });
      toast({
        title: "Network switched",
        description: "Switched to Arbitrum Sepolia.",
      });
    } catch (err: any) {
      toast({
        title: "Network switch failed",
        description: err?.message || "Please switch to Arbitrum Sepolia manually in your wallet.",
        variant: "destructive",
      });
    }
  };

  // Check if MetaMask is installed
  const isMetaMaskInstalled = typeof window !== "undefined" && 
    (window.ethereum?.isMetaMask || (window as any).ethereum?.providers?.some((p: any) => p.isMetaMask));

  // Filter and prioritize connectors
  const availableConnectors = connectors.filter((c) => c.ready || c.id === "io.metamask");
  const metaMaskConnector = availableConnectors.find((c) => 
    c.name.toLowerCase().includes("metamask")
  );
  const otherConnectors = availableConnectors.filter((c) => 
    !c.name.toLowerCase().includes("metamask")
  );

  // Prioritize MetaMask if available
  const sortedConnectors = metaMaskConnector 
    ? [metaMaskConnector, ...otherConnectors]
    : otherConnectors;

  if (isConnected && address) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Wallet Connected</DialogTitle>
            <DialogDescription>
              Your wallet is connected to GasLess Guilds
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Wallet Address */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Connected Wallet</p>
                  <p className="text-sm text-muted-foreground font-mono">
                    {formatAddress(address)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyAddress}
                  className="h-8 w-8 p-0"
                >
                  {copied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="h-8 w-8 p-0"
                >
                  <a
                    href={getExplorerUrl(address)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>

            {/* Network Status */}
            {!isArbitrumNetwork && (
              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-amber-500 mb-1">
                      Wrong Network
                    </p>
                    <p className="text-sm text-muted-foreground mb-3">
                      Please switch to Arbitrum Sepolia to use GasLess Guilds.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSwitchNetwork}
                      disabled={isSwitching}
                      className="w-full"
                    >
                      {isSwitching ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Switching...
                        </>
                      ) : (
                        "Switch to Arbitrum Sepolia"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Current Network */}
            {isArbitrumNetwork && (
              <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <div>
                    <p className="text-sm font-medium text-emerald-500">
                      Connected to {chain?.name || "Arbitrum"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Network ID: {chainId}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Disconnect Button */}
            <Button
              variant="destructive"
              onClick={() => {
                disconnect();
                onOpenChange(false);
              }}
              className="w-full"
            >
              Disconnect Wallet
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Connect Wallet</DialogTitle>
          <DialogDescription>
            Connect your wallet to start using GasLess Guilds on Arbitrum
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-4">
          {/* MetaMask Installation Prompt */}
          {!isMetaMaskInstalled && (
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🦊</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-500 mb-1">
                    MetaMask Not Detected
                  </p>
                  <p className="text-sm text-muted-foreground mb-3">
                    Install MetaMask browser extension to connect your wallet securely.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="w-full"
                  >
                    <a
                      href="https://metamask.io/download"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      <span>🦊</span>
                      Install MetaMask
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* MetaMask Recommended Banner */}
          {isMetaMaskInstalled && metaMaskConnector && (
            <div className="p-3 rounded-lg bg-gradient-to-r from-orange-500/10 to-blue-500/10 border border-orange-500/20">
              <div className="flex items-center gap-2">
                <span className="text-xl">🦊</span>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">MetaMask detected!</span> Recommended for best experience.
                </p>
              </div>
            </div>
          )}

          {/* Primary MetaMask Button */}
          {isMetaMaskInstalled && metaMaskConnector && metaMaskConnector.ready && (
            <Button
              variant="default"
              size="lg"
              className="w-full h-auto py-4 px-4 bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600"
              onClick={() => handleConnect(metaMaskConnector)}
              disabled={isPending}
            >
              <div className="flex items-center justify-center gap-3 w-full">
                <span className="text-2xl">🦊</span>
                <div className="text-left">
                  <p className="font-semibold">Connect with MetaMask</p>
                  <p className="text-xs opacity-90">Recommended wallet</p>
                </div>
                {isPending && connectingConnectorId === metaMaskConnector.uid && (
                  <Loader2 className="w-4 h-4 animate-spin ml-auto" />
                )}
              </div>
            </Button>
          )}

          {/* Other Wallet Options */}
          {sortedConnectors.length > 0 ? (
            <>
              {metaMaskConnector && sortedConnectors.length > 1 && (
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or connect with
                    </span>
                  </div>
                </div>
              )}
              <div className="space-y-2">
                {sortedConnectors
                  .filter((c) => !(c.name.toLowerCase().includes("metamask") && isMetaMaskInstalled))
                  .map((connector) => {
                    const isConnecting = isPending && connectingConnectorId === connector.uid;
                    
                    return (
                      <Button
                        key={connector.uid}
                        variant="outline"
                        className="w-full justify-start h-auto py-4 px-4 hover:bg-primary/5 transition-colors"
                        onClick={() => handleConnect(connector)}
                        disabled={isPending || !connector.ready}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{getWalletIcon(connector.name)}</span>
                            <div className="text-left">
                              <p className="font-medium">{connector.name}</p>
                              {!connector.ready && (
                                <p className="text-xs text-amber-500">
                                  Not available
                                </p>
                              )}
                            </div>
                          </div>
                          {isConnecting && (
                            <Loader2 className="w-4 h-4 animate-spin text-primary" />
                          )}
                        </div>
                      </Button>
                    );
                  })}
              </div>
            </>
          ) : (
            <div className="p-4 rounded-lg bg-muted/50 text-center">
              <p className="text-sm text-muted-foreground">
                No wallets available. Please install a wallet extension.
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-destructive mb-1">
                    Connection Error
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {error.message}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Network Info */}
          <div className="p-3 rounded-lg bg-muted/30 border border-border">
            <p className="text-xs text-muted-foreground text-center">
              Supported networks: Arbitrum One & Arbitrum Sepolia
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


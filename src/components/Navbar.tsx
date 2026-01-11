import { Wallet, Copy, Check, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAccount, useDisconnect, useChainId, useConnect } from "wagmi";
import { arbitrum, arbitrumSepolia } from "wagmi/chains";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Logo } from "./Logo";
import { WalletConnectDialog } from "./WalletConnectDialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Navbar = ({ onNavigate, currentPage }: NavbarProps) => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect, connectors, isPending, error: connectError } = useConnect();
  const chainId = useChainId();
  const [copied, setCopied] = useState(false);
  const [walletDialogOpen, setWalletDialogOpen] = useState(false);

  // Handle connection errors - filter out expected errors
  useEffect(() => {
    if (connectError) {
      const errorMessage = connectError.message.toLowerCase();
      const errorCode = (connectError as any)?.code;
      
      // Ignore user cancellations (code 4001) - silent
      if (errorCode === 4001 || errorMessage.includes('user rejected') || errorMessage.includes('user denied')) {
        return; // User intentionally cancelled - no need to show error
      }
      
      // Handle authorization errors - show helpful message
      if (errorMessage.includes('not been authorized') || errorMessage.includes('unauthorized') || errorMessage.includes('not authorized')) {
        toast({
          title: "MetaMask Authorization Required",
          description: "Please click the MetaMask extension icon and approve the connection request to authorize this site.",
          variant: "default",
        });
        return;
      }
      
      // Handle network errors
      if (errorMessage.includes('failed to fetch') || errorCode === -32603) {
        toast({
          title: "Network Error",
          description: "Unable to connect to the network. Please check your internet connection and try again.",
          variant: "destructive",
        });
        return;
      }
      
      // Only show other unexpected errors
      if (!errorMessage.includes('user') && !errorMessage.includes('authorized')) {
        toast({
          title: "Connection Error",
          description: connectError.message || "Failed to connect wallet. Please try again.",
          variant: "destructive",
        });
      }
    }
  }, [connectError]);

  // Get MetaMask connector - check multiple possible IDs
  const metaMaskConnector = connectors.find((c) => 
    c.id === "io.metamask" ||
    c.id === "metaMaskSDK" ||
    (c.name && c.name.toLowerCase().includes("metamask"))
  );

  // Check if MetaMask is installed
  const isMetaMaskInstalled = typeof window !== "undefined" && 
    (window.ethereum?.isMetaMask || (window as any).ethereum?.providers?.some((p: any) => p.isMetaMask));

  // Direct MetaMask connection handler
  const handleMetaMaskConnect = async () => {
    if (!isMetaMaskInstalled) {
      toast({
        title: "MetaMask Not Found",
        description: "Please install MetaMask to connect your wallet.",
        variant: "destructive",
      });
      window.open("https://metamask.io/download", "_blank");
      return;
    }

    try {
      // Find MetaMask connector (could be injected with target: 'metaMask' or metaMask())
      const connector = metaMaskConnector || connectors.find((c) => 
        c.id === 'io.metamask' || 
        (c.name && c.name.toLowerCase().includes('metamask'))
      );

      if (connector) {
        await connect({ connector });
      } else {
        // Fallback: try to connect with injected connector
        const injectedConnector = connectors.find((c) => c.id === 'injected');
        if (injectedConnector) {
          await connect({ connector: injectedConnector });
        } else {
          setWalletDialogOpen(true);
        }
      }
    } catch (error: any) {
      console.error('Connection error:', error);
      toast({
        title: "Connection Failed",
        description: error?.message || "Failed to connect to MetaMask. Please try again or check if MetaMask is unlocked.",
        variant: "destructive",
      });
    }
  };

  const navItems = [
    { id: "home", label: "Home" },
    { id: "dashboard", label: "Dashboard" },
    { id: "tasks", label: "Tasks" },
    { id: "profile", label: "Profile" },
  ];

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Show success toast when connected
  useEffect(() => {
    if (isConnected && address) {
      toast({
        title: "Wallet Connected! 🎉",
        description: `Successfully connected to ${formatAddress(address)}`,
      });
    }
  }, [isConnected, address]);

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getExplorerUrl = (addr: string) => {
    const explorerBase = chainId === arbitrum.id 
      ? "https://arbiscan.io" 
      : "https://sepolia.arbiscan.io";
    return `${explorerBase}/address/${addr}`;
  };

  const isArbitrumNetwork = chainId === arbitrum.id || chainId === arbitrumSepolia.id;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-glass-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate("home")}>
            <Logo size={40} className="drop-shadow-lg" />
            <span className="text-xl font-bold gradient-text">GasLess Guilds</span>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  currentPage === item.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {isConnected && address && !isArbitrumNetwork && (
              <Badge variant="destructive" className="hidden sm:flex">
                Wrong Network
              </Badge>
            )}
            {isConnected && address ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="default" className="gap-2">
                    <Wallet className="w-4 h-4" />
                    <span className="hidden sm:inline">{formatAddress(address)}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={copyAddress} className="cursor-pointer">
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Address
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a
                      href={getExplorerUrl(address)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center cursor-pointer"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View on Arbiscan
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => {
                      disconnect();
                      toast({
                        title: "Wallet disconnected",
                        description: "You have been disconnected from GasLess Guilds.",
                      });
                    }} 
                    className="cursor-pointer text-destructive"
                  >
                    Disconnect
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="default"
                  size="default"
                  className="gap-2"
                  onClick={handleMetaMaskConnect}
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="hidden sm:inline">Connecting...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-lg">🦊</span>
                      <span className="hidden sm:inline">
                        {isMetaMaskInstalled ? "Connect MetaMask" : "Connect Wallet"}
                      </span>
                    </>
                  )}
                </Button>
                {isMetaMaskInstalled && (
                  <Button
                    variant="ghost"
                    size="default"
                    className="gap-2"
                    onClick={() => setWalletDialogOpen(true)}
                  >
                    <span className="text-xs">⋯</span>
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Show dialog for other wallet options or if MetaMask connection fails */}
          <WalletConnectDialog
            open={walletDialogOpen}
            onOpenChange={setWalletDialogOpen}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

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
  const { connect, connectors, isPending } = useConnect();
  const chainId = useChainId();
  const [copied, setCopied] = useState(false);
  const [walletDialogOpen, setWalletDialogOpen] = useState(false);

  // Get MetaMask connector
  const metaMaskConnector = connectors.find((c) => 
    c.name.toLowerCase().includes("metamask") || c.id === "io.metamask"
  );

  // Check if MetaMask is installed
  const isMetaMaskInstalled = typeof window !== "undefined" && 
    (window.ethereum?.isMetaMask || (window as any).ethereum?.providers?.some((p: any) => p.isMetaMask));

  // Direct MetaMask connection handler
  const handleMetaMaskConnect = () => {
    if (!isMetaMaskInstalled) {
      toast({
        title: "MetaMask Not Found",
        description: "Please install MetaMask to connect your wallet.",
        variant: "destructive",
      });
      window.open("https://metamask.io/download", "_blank");
      return;
    }

    if (metaMaskConnector && metaMaskConnector.ready) {
      connect({ connector: metaMaskConnector });
    } else {
      // Fallback to dialog if MetaMask connector not found or not ready
      setWalletDialogOpen(true);
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

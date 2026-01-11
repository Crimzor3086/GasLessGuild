import { Wallet, Copy, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAccount, useDisconnect, useChainId } from "wagmi";
import { arbitrum, arbitrumSepolia } from "wagmi/chains";
import { useState } from "react";
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

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Navbar = ({ onNavigate, currentPage }: NavbarProps) => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const [copied, setCopied] = useState(false);
  const [walletDialogOpen, setWalletDialogOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "dashboard", label: "Dashboard" },
    { id: "tasks", label: "Tasks" },
    { id: "profile", label: "Profile" },
  ];

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

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
            <Button
              variant="outline"
              size="default"
              className="gap-2"
              onClick={() => setWalletDialogOpen(true)}
            >
              <Wallet className="w-4 h-4" />
              {isConnected && address ? (
                <span className="hidden sm:inline">{formatAddress(address)}</span>
              ) : (
                <span className="hidden sm:inline">Connect Wallet</span>
              )}
            </Button>
          </div>

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

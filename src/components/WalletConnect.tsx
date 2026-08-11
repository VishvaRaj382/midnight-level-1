import React from 'react';
import { Wallet, LogOut, Loader2, ExternalLink } from 'lucide-react';
import type { MidnightWalletState } from '../hooks/useMidnight.js';

interface WalletConnectProps {
  wallet: MidnightWalletState;
  onConnect: () => void;
  onDisconnect: () => void;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({
  wallet,
  onConnect,
  onDisconnect,
}) => {
  return (
    <div className="flex items-center gap-3">
      {wallet.isConnected ? (
        <div className="flex items-center gap-3 glass-panel px-4 py-2">
          <div className="flex flex-col text-right text-xs">
            <span className="font-semibold text-cyan-400 flex items-center gap-1 justify-end">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {wallet.network}
            </span>
            <span className="text-slate-400 mono">{wallet.balance}</span>
          </div>

          <div className="h-6 w-px bg-slate-700 mx-1"></div>

          <div className="flex items-center gap-2">
            <div className="bg-cyan-950/60 text-cyan-300 px-3 py-1.5 rounded-lg border border-cyan-800/40 text-sm mono font-medium">
              {wallet.address?.slice(0, 14)}...{wallet.address?.slice(-6)}
            </div>
            <button
              type="button"
              onClick={onDisconnect}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
              title="Disconnect Wallet"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={onConnect}
          disabled={wallet.isConnecting}
          className="btn-primary cursor-pointer"
        >
          {wallet.isConnecting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Connecting Lace...
            </>
          ) : (
            <>
              <Wallet className="w-4 h-4" />
              Connect Midnight Wallet
            </>
          )}
        </button>
      )}

      <a
        href="https://faucet.preprod.midnight.network"
        target="_blank"
        rel="noopener noreferrer"
        className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 glass-panel px-3 py-2 transition-colors"
      >
        <span>tNight Faucet</span>
        <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
};

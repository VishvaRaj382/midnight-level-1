import React from 'react';
import { Layout } from './components/Layout.js';
import { WalletConnect } from './components/WalletConnect.js';
import { AIShieldGuard } from './components/AIShieldGuard.js';
import { useMidnight } from './hooks/useMidnight.js';

export function App() {
  const {
    wallet,
    verification,
    isProcessing,
    activeStep,
    connectWallet,
    disconnectWallet,
    proveIncomeEligibility,
  } = useMidnight();

  return (
    <Layout
      headerRight={
        <WalletConnect
          wallet={wallet}
          onConnect={connectWallet}
          onDisconnect={disconnectWallet}
        />
      }
    >
      <AIShieldGuard
        wallet={wallet}
        verification={verification}
        isProcessing={isProcessing}
        activeStep={activeStep}
        onVerify={proveIncomeEligibility}
        onRevoke={() => {}}
        onConnectWallet={connectWallet}
      />
    </Layout>
  );
}

export default App;

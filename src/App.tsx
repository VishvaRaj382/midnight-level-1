import React from 'react';
import { Layout } from './components/Layout.js';
import { WalletConnect } from './components/WalletConnect.js';
import { PrivAIGuard } from './components/PrivAIGuard.js';
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
      <PrivAIGuard
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

import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter as Router} from 'react-router-dom'
//import { Sepolia } from "@thirdweb-dev/chains";
import { ChainId, ThirdwebProvider} from '@thirdweb-dev/react';
import App from './App.jsx';
import './index.css'
import { StateContextProvider } from './context/index.jsx';
import {
    metamaskWallet,
    coinbaseWallet,
    walletConnect,
  } from "@thirdweb-dev/react";
const root = ReactDOM.createRoot(document.getElementById('root'));


root.render(
    <ThirdwebProvider 
        activeChain='sepolia' 
        clientId='290806d64bcafabb8cdf9025b4bd5c39' 
        supportedWallets={[
            metamaskWallet({
            recommended: true,
            }),
            coinbaseWallet(),
            walletConnect(),
        ]}>
        <Router>
            <StateContextProvider>
                <App/>
            </StateContextProvider>
        </Router>
    </ThirdwebProvider>
)
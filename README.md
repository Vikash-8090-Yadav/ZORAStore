# ZORAStore

A decentralized marketplace built on Zora Protocol, enabling users to create, buy, and sell digital assets.

## Overview

ZORAStore is a web3 marketplace that leverages the Zora Protocol to provide a seamless experience for digital asset trading. The platform allows users to:

- Create and mint NFTs
- Buy and sell digital assets
- Create and manage custom coins using Zora's Coins Protocol
- Trade coins on Uniswap V3 pools
- Manage their digital collections

## Features

- Integration with Zora Protocol
- Zora Coins Protocol integration with full SDK support
- NFT minting and trading
- Wallet integration (MetaMask, WalletConnect, etc.)
- User-friendly interface
- Uniswap V3 pool integration for coin trading

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Web3 wallet (MetaMask, WalletConnect, etc.)
- RPC URL for the desired network (Base, Ethereum, etc.)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ZORAStore.git
cd ZORAStore
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

## Zora's Coins Protocol Integration

The project integrates with Zora's Coins Protocol to enable:

### Coin Creation
Create custom coins with the following parameters:
- Name and symbol
- Metadata URI (IPFS recommended)
- Owner addresses
- Payout recipient
- Platform referrer (optional)
- Initial purchase amount (optional)

### Trading Features
- Trade coins on Uniswap V3 pools
- Support for WETH/ETH pairs
- Customizable tick ranges for liquidity pools
- Initial liquidity provision

### Example Usage

```typescript
import { createCoin } from "@zoralabs/coins-sdk";
import { createWalletClient, createPublicClient, http } from "viem";
import { base } from "viem/chains";

// Set up clients
const publicClient = createPublicClient({
  chain: base,
  transport: http("<RPC_URL>"),
});

const walletClient = createWalletClient({
  account: "0x<YOUR_ACCOUNT>",
  chain: base,
  transport: http("<RPC_URL>"),
});

// Create coin parameters
const coinParams = {
  name: "My Awesome Coin",
  symbol: "MAC",
  uri: "ipfs://<YOUR_METADATA_URI>",
  payoutRecipient: "0xYourAddress",
  platformReferrer: "0xOptionalPlatformReferrerAddress",
  initialPurchaseWei: 0n,
};

// Create the coin
const result = await createCoin(coinParams, walletClient, publicClient);
```

## Development

### Environment Setup

1. Create a `.env` file in the root directory:
```env
RPC_URL=your_rpc_url_here
```

2. Configure your wallet provider in the application.

### Testing

Run the test suite:
```bash
npm test
# or
yarn test
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. When contributing:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any questions or suggestions, please open an issue in the repository.

## Resources

- [Zora Coins SDK Documentation](https://docs.zora.co/coins/sdk/create-coin)
- [Zora Protocol Documentation](https://docs.zora.co)
- [Uniswap V3 Documentation](https://docs.uniswap.org/contracts/v3/overview)
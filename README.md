## 🚀 Github Copilot Crypto Extension

The Crypto Extension is a GitHub Copilot-based extension designed to give developers easy access to real-time cryptocurrency data directly within their VS Code environment.

Built as part of the **Next-Gen Software Development with GitHub Copilot Agents workshop** by **GeekAcademy** and **Microsoft**, this extension integrates tools and practices taught in the workshop. The extension uses the GitHub Copilot Preview SDK to fetch live crypto prices and historical data for popular cryptocurrencies like Bitcoin (BTC) and Ethereum (ETH).

The extension responds with accurate, real-time data, which makes it ideal for developers working with cryptocurrency data.

**Features**

- **Real-Time Cryptocurrency Prices:** Fetch and display the current price of Bitcoin (BTC), Ethereum (ETH), and other cryptocurrencies. -**Historical Price Changes:** Users can request price changes for the last 24 hours, 7 days, or 30 days for supported cryptocurrencies. -**GitHub Copilot Integration:** The extension interacts seamlessly with GitHub Copilot chat in VS Code, providing developers with quick and actionable insights directly within their coding environment. -**Inspired by Industry-Leading Knowledge:** Created using concepts and tools learned from the Next-Gen Software Development with GitHub Copilot Agents workshop, designed for experienced developers with 3+ years of development experience.

**Technologies Used**

-**Node.js & Express:** Backend server to handle API requests and process user input. -**CoinGecko API:** Used for fetching real-time cryptocurrency prices and historical data. -**GitHub Copilot Preview SDK:** SDK used to integrate the extension with GitHub Copilot, allowing natural language interaction for cryptocurrency price queries. -**axios** Used for making HTTP requests to CoinGecko API.

**Installation**

Run the following commands to install and start the application locally

```bash
npm install
npm run dev
open http://localhost:3000
```

Open VS Code and make sure GitHub Copilot is enabled to start interacting with the extension.

**Possible Queries**

- Current Price: "What is the current price of Bitcoin?"

- Price Change (24h): "What was the price change for Bitcoin in the last 24 hours?"

- Price Change (7d): "What was the price change for Bitcoin in the last 7 days?"

- Price Change (30d): "What was the price change for Bitcoin in the last 30 days?"

- What is the current price for Ethereum?

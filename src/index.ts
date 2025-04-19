import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import {
  parseRequestBody,
  getUserMessage,
  createAckEvent,
  createTextEvent,
  createDoneEvent,
  createErrorsEvent,
} from "@copilot-extensions/preview-sdk";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors());

app.use((req, res, next) => {
  let data = "";
  req.setEncoding("utf8");
  req.on("data", (chunk) => {
    data += chunk;
  });
  req.on("end", () => {
    (req as any).rawBody = data;
    next();
  });
});

app.get("/", (_req, res) => {
  res.send("Welcome to Crypto Copilot Extension!");
});

const currencyNames = {
  bitcoin: "Bitcoin (BTC)",
  ethereum: "Ethereum (ETH)",
};

const fetchCurrentPrice = async (currency: string) => {
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${currency}&vs_currencies=usd`
    );
    return response.data[currency]?.usd || null;
  } catch (error) {
    throw new Error("Unable to retrieve the current price");
  }
};

const fetchHistoricalData = async (currency: string, days: number) => {
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${currency}/market_chart?vs_currency=usd&days=${days}`
    );
    return response.data.prices;
  } catch (error) {
    throw new Error("Unable to retrieve the historical data");
  }
};

const calculatePriceChange = (historicalData: any[]) => {
  if (historicalData.length > 0) {
    const firstPrice = historicalData[0][1];
    const lastPrice = historicalData[historicalData.length - 1][1];
    const change = ((lastPrice - firstPrice) / firstPrice) * 100;
    return change.toFixed(2);
  }
  return null;
};

app.post("/", async (req, res) => {
  const tokenForUser = req.header("x-github-token") ?? "";
  const rawBody = (req as any).rawBody;

  if (!rawBody || rawBody.length === 0) {
    res
      .status(400)
      .send("No data received. Please provide the necessary information.");
    return;
  }

  if (!tokenForUser) {
    console.error("Missing GitHub token");
    res.status(401).send("Missing GitHub token");
    return;
  }

  try {
    const payload = parseRequestBody(rawBody);
    const userPrompt = getUserMessage(payload);

    res.setHeader("Content-Type", "text/html");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.write(createAckEvent());

    let currency = "bitcoin";
    if (
      userPrompt.toLowerCase().includes("bitcoin") ||
      userPrompt.toLowerCase().includes("btc")
    ) {
      currency = "bitcoin";
    } else if (
      userPrompt.toLowerCase().includes("ethereum") ||
      userPrompt.toLowerCase().includes("eth")
    ) {
      currency = "ethereum";
    }

    const currencyFullName =
      currencyNames[currency as keyof typeof currencyNames] || currency;

    if (
      userPrompt.toLowerCase().includes("24h") ||
      userPrompt.toLowerCase().includes("24 hours")
    ) {
      const historicalData = await fetchHistoricalData(currency, 1);
      const priceChange = calculatePriceChange(historicalData);
      res.write(
        createTextEvent(
          `The price of ${currencyFullName} has changed by ${priceChange}% in the last 24 hours.`
        )
      );
    } else if (
      userPrompt.toLowerCase().includes("7d") ||
      userPrompt.toLowerCase().includes("7 days")
    ) {
      const historicalData = await fetchHistoricalData(currency, 7);
      const priceChange = calculatePriceChange(historicalData);
      res.write(
        createTextEvent(
          `The price of ${currencyFullName} has changed by ${priceChange}% in the last 7 days.`
        )
      );
    } else if (
      userPrompt.toLowerCase().includes("30d") ||
      userPrompt.toLowerCase().includes("30 days")
    ) {
      const historicalData = await fetchHistoricalData(currency, 30);
      const priceChange = calculatePriceChange(historicalData);
      res.write(
        createTextEvent(
          `The price of ${currencyFullName} has changed by ${priceChange}% in the last 30 days.`
        )
      );
    } else {
      const price = await fetchCurrentPrice(currency);
      if (price !== null) {
        const formattedPrice = price.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        res.write(
          createTextEvent(
            `The current price of ${currencyFullName} is $${formattedPrice}.`
          )
        );
      } else {
        res.write(
          createTextEvent(
            `Sorry, I couldn't fetch the current price of ${currencyFullName} at the moment.`
          )
        );
      }
    }

    res.write(createDoneEvent());
    res.end();
  } catch (error) {
    const errorEvent = createErrorsEvent([
      {
        type: "agent",
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again later.",
        code: "PROCESSING_ERROR",
        identifier: "processing_error",
      },
    ]);
    res.status(500).send(errorEvent);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

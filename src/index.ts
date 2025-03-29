import express from "express";
import dotenv from "dotenv";
import {
  verifyAndParseRequest,
  getUserMessage,
  createAckEvent,
  createTextEvent,
  createDoneEvent,
  createErrorsEvent,
} from "@copilot-extensions/preview-sdk";

dotenv.config();

const app = express();
app.use(express.text());

app.get("/", (_req, res) => {
  res.send("Welcome to Crypto Copilot Extension!");
});

app.post("/", async (req, res) => {
  const tokenForUser = (req.headers["x-github-token"] as string) ?? "";
  const signature =
    (req.headers["github-public-key-signature"] as string) ?? "";
  const keyID = (req.headers["github-public-key-identifier"] as string) ?? "";
  const body = req.body;

  try {
    const { isValidRequest, payload } = await verifyAndParseRequest(
      body,
      signature,
      keyID,
      { token: tokenForUser }
    );

    if (!isValidRequest) {
      console.error("Request verification failed");
      res.status(401).send("Request could not be verified");
      return;
    }

    const userPrompt = getUserMessage(payload);

    console.log("User Prompt:", userPrompt);

    const responseText =
      createAckEvent() +
      createTextEvent(`Got your request: "${userPrompt}". Processing data...`) +
      createDoneEvent();

    res.setHeader("Content-Type", "text/html");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.send(responseText);
  } catch (error: any) {
    console.error("Error handling request:", error.message);
    const errorEvent = createErrorsEvent([
      {
        type: "agent",
        message: error.message || "Unknown error",
        code: "PROCESSING_ERROR",
        identifier: "processing_error",
      },
    ]);
    res.status(500).send(errorEvent);
  }
});

app.listen(3000, () => {
  console.log("🚀 Server is running on http://localhost:3000");
});

// Import the Genkit core libraries and plugins.
import {genkit, z} from "genkit";

// Cloud Functions for Firebase supports Genkit natively. The onCallGenkit
// function creates a callable function from a Genkit action. It automatically
// implements streaming if your flow does.
import {onCallGenkit} from "firebase-functions/v2/https";

// Import models from the Vertex AI plugin. The Vertex AI API provides access to
// several generative models. Here, we import Gemini 2.0 Flash and the Vertex
// AI plugin itself.
import {vertexAI, gemini20Flash} from "@genkit-ai/vertexai";

// Genkit models generally depend on an API key. APIs should be stored in Cloud
// Secret Manager so that
// access to these sensitive values can be controlled. defineSecret does this
// for you automatically.
// If you are using Google generative AI you can get an API key at
// https://aistudio.google.com/app/apikey
import {defineSecret} from "firebase-functions/params";
const apiKey = defineSecret("GOOGLE_GENAI_API_KEY");

// The Firebase telemetry plugin exports a combination of metrics, traces, and
// logs to Google Cloud Observability. See
// https://firebase.google.com/docs/genkit/observability/telemetry-collection.
import {firebase} from "@genkit-ai/firebase";

genkit({
  plugins: [
    // Load the Vertex AI plugin. You can optionally specify your project ID
    // by passing in a config object; if you don't, the Vertex AI plugin uses
    // the value from the GCLOUD_PROJECT environment variable.
    vertexAI({location: "us-central1"}),
    firebase(),
  ],
});

// Define a simple flow that prompts an LLM to generate menu suggestions.
const menuSuggestionFlow = genkit.defineFlow(
  {
    name: "menuSuggestionFlow",
    inputSchema: z.string().describe("A restaurant theme").default("seafood"),
    outputSchema: z.string(),
    streamSchema: z.string(),
  },
  async (subject, {stream}) => {
    // Construct a request and send it to the model API.
    const llmResponse = await genkit.generate({
      model: gemini20Flash,
      prompt: `Suggest a menu for a restaurant with a ${subject} theme.`,
      config: {temperature: 1},
      stream: true,
    });

    for await (const chunk of llmResponse.stream()) {
      stream.write(chunk.text());
    }

    // Handle the response from the model API. In this sample, we just
    // convert it to a string, but more complicated flows might coerce the
    // response into structured output or chain the response into another
    // LLM call, etc.
    return (await llmResponse.response()).text();
  }
);

export const menuSuggestion = onCallGenkit(
  {
    // Uncomment to enable AppCheck. This can reduce costs by ensuring only your
    // Verified app users can use your API.
    // Read more at https://firebase.google.com/docs/app-check/cloud-functions
    // enforceAppCheck: true,

    // Grant access to the API key to this function:
    secrets: [apiKey],
  },
  menuSuggestionFlow
);

export const pixelDescriptionFlow = genkit.defineFlow(
  {
    name: "pixelDescriptionFlow",
    inputSchema: z.string().describe("A description of a pixel art"),
    outputSchema: z.string(),
  },
  async (subject) => {
    const prompt = `Generate a creative and engaging description for a pixel art image based on the following input: ${subject}`;
    const response = await genkit.generate({
      model: gemini20Flash,
      prompt: prompt,
    });
    return response.text();
  }
);

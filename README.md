# Streaming GPT Backend

This project is an example of how to stream data from the OpenAI API and forwarding it to a client using Server-Sent Events (SSE). It's built with Node.js, Express, and the OpenAI SDK.
This is more of code playground for how you can set up streaming for your project, and not a complete application.

## Prerequisites

- Node.js >= 14.x
- An OpenAI API key

## Installation

1. Clone the repository

2. Navigate into the project directory:
```bash
cd streaming-gpt-backend
```

3. Install the dependencies:
```bash
npm install
```

4. Create a `.env` file in the root of your project and insert your key/value pairs in the following format of `KEY=VALUE`:
```bash
PORT=3500
OPENAI_API_KEY=your_openai_api_key
```

## Usage

Start the server:
```bash
npm start
```

Once the server is running, you can make GET requests to `/ask` endpoint with a `prompt` query parameter. The server will then stream the responses back to the client. Please see [streaming-gpt-frontend](https://github.com/Dervisevic/streaming-gpt-frontend) for how to recieve the stream in the frontend.

## Code Overview

The main file is `index.js` where the Express server is set up. This server includes a single endpoint `/ask`, which accepts GET requests. When a request is received, it uses the OpenAI SDK to create a chat with the GPT-3.5 Turbo model and the given prompt. The resulting chat messages are then streamed back to the client as Server-Sent Events.

## License

[MIT](https://choosealicense.com/licenses/mit/)

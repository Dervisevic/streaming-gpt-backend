const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const app = express();
app.use(express.json());
app.use(cors());

app.get('/ask', async (req, res) => {
  const prompt = req.query.prompt || '';

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  askGPT(prompt, res);
});


async function askGPT(prompt, res) {

  const response = await openai.createChatCompletion(
    {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      stream: true,
    },
    { responseType: 'stream' }
  );

  const stream = response.data;

  stream.on('data', (chunk) => {
    // Messages in the event stream are separated by a pair of newline characters.
    const payloads = chunk.toString().split('\n\n');
    for (const payload of payloads) {
      if (payload.includes('[DONE]')) {
        console.log('Stream ended via [DONE] command');
        return;
      }

      if (payload.startsWith('data:')) {
        const data = payload.replaceAll(/(\n)?^data:\s*/g, ''); // in case there's multiline data event
        try {
          const delta = JSON.parse(data.trim());

          if (typeof delta.choices[0].delta?.content !== 'undefined') {

            // This is to preserve newlines in the output
            const transformedText = delta.choices[0].delta?.content.replace(
              /\n/g,
              '-%nl%-'
            );
            res.write(`data: ${transformedText}\n\n`);
          }
        } catch (error) {
          console.log(`Error with JSON.parse and ${payload}.\n${error}`);
        }
      }
    }
  });

  stream.on('end', () => {
    res.write(`data: %%STRIMDONE%%\n\n`);
    console.log(`stream done for ${prompt}`)
  });
  stream.on('error', (e) => {
    res.write(`data: %%STRIMERROR%%\n\n`);
    console.log(`${prompt}: Stream ERROR,`, e);
  });
}

const PORT = process.env.PORT || 3500;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

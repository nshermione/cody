import {CodeAgent} from './agents/code.agent.js';

async function createAgent({ apiKey, apiUrl }) {
  const configuration = {
    apiKey: apiKey,
    baseURL: apiUrl,
  };
  if (!configuration.apiKey) {
    throw new Error('API_KEY is required in .env file');
  }
  if (!configuration.baseURL) {
    throw new Error('API_URL is required in .env file');
  }

  const agent = new CodeAgent();
  await agent.initialize(configuration);
  return agent;
}

export {createAgent};

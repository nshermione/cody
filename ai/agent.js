import {CodeAgent} from './agents/code.agent.js';

async function createAgent({ apiKey, apiUrl }) {
  const configuration = {
    apiKey: apiKey,
    baseURL: apiUrl,
  };
  const agent = new CodeAgent();
  await agent.initialize(configuration);
  return agent;
}

export {createAgent};

import {createAgent} from './agent.js';
import {config} from './config.js';

const agent = await createAgent(config);

agent.start();

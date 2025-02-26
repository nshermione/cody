import OpenAI from 'openai';
import inquirer from 'inquirer';
import {MODEL} from '../constant.js';

/**
 * Using Deepseek AI
 */
export class CodeAgent {
  async initialize(configuration) {
    this.openai = new OpenAI({
      apiKey: configuration.apiKey,
      baseURL: configuration.baseURL,
    });
    this.agentRole = {
      role: 'system',
      content: 'You are a Code AI expert who analyzes project requirements, suggests solutions, and provides code changes for implementation.',
    }
    this.conversationHistory = [];
  }

  async start() {
    console.log('CodeAgent started');
    this.userInput();
  }

  async userInput() {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'question',
          message: 'Ask me anything:',
        },
      ])
      .then(async (answers) => {
        await this.askAI(answers.question);
        await this.checkSummary();
        this.userInput();
      });
  }

  getConversationTokenLength() {
    return JSON.stringify(this.conversationHistory).length;
  }

  async checkSummary() {
    if (this.getConversationTokenLength() > 4096) {
      console.log("Summary required");
      const summary = await this.summaryHistory();
      console.log("Summary: ", summary);
      this.conversationHistory = [{
        role: 'system',
        content: summary,
      }];
    }
  }

  async summaryHistory() {
    const summaryPrompt = "Summarize this conversation in a concise manner:\n\n" +
      this.conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join("\n");

    const response = await this.openai.createChatCompletion({
      model: MODEL.DEEPSEEK_CHAT,
      messages: [
        {
          role: 'system',
          content: 'You are a Code AI expert',
        },
        {
          role: "user", content: summaryPrompt
        }
      ]
    });

    return response.data.choices[0].message.content;
  }

  async askAI(question) {
    this.conversationHistory.push({
      role: 'user',
      content: question,
    });

    const completion = await this.openai.chat.completions.create({
      model: MODEL.DEEPSEEK_CHAT,
      messages: [
        this.agentRole,
        ...this.conversationHistory
      ],
      stream: true,
    });
    let fullResponse = '';
    for await (const part of completion) {
      process.stdout.write(part.choices[0].delta.content);
      fullResponse += part.choices[0].delta.content;
    }
    process.stdout.write('\n');
    return fullResponse;
  }
}

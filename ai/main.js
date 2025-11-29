import dotenv from 'dotenv';
import { OpenRouter } from "@openrouter/sdk";
import { getAiPromptsTxt } from './utils.js';
import fs from 'fs';
dotenv.config();

const AI_KEY = process.env.AI_KEY;


// creating a parallel ai using promises;





async function runAiTask(aiModel, prompts, AI_KEY) {
    console.log('Model --> ', aiModel);
    // const outputStream = fs.createWriteStream('output.txt')
    const openrouter = new OpenRouter({
        apiKey: AI_KEY
    });
    const stream = await openrouter.chat.send({
        model: aiModel,
        messages: [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": prompts
                    }
                ]
            }
        ],
        stream: true
    });

    for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
            return content
        }
    }
}


const prompts = await getAiPromptsTxt('test-prompts.txt')

// AI_key & input prompts --> all
// model -> different

const models = ['tngtech/deepseek-r1t2-chimera:free', 'tngtech/deepseek-r1t2-chimera:free'];
// same models same api key, -> many request
// diff models sampe api key -> cant many request 


function startAiList(models, prompts, AI_KEY) {
    // runAiTask(model, prompts, AI_KEY)

    const aiList = Array.from({length : models.length}, (_, i) => runAiTask(models[i], prompts, AI_KEY));

    Promise.all(aiList)
        .then(results => {
            console.log('Done ', results.length);
        }).catch(err => console.error(err));
}


startAiList(models, prompts, AI_KEY);
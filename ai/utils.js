import fs from 'fs';

export function getAiPromptsTxt(filename) {
    const aiPromptStream = fs.createReadStream(filename);

    return new Promise((acc, rej) => {
        let body = ''
        aiPromptStream.on('data', ch => {
            body += ch.toString();
        })

        aiPromptStream.on('end', () => acc(body));
        aiPromptStream.on('error', err => rej(err));
    })
}


import fs from 'node:fs';
import path from 'node:path';

// 读取 .env 文件
const envPath = path.resolve(process.cwd(), '.env');
let apiKey = '';
let apiBase = 'https://api.deepseek.com';
let apiModel = 'deepseek-chat';

try {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const lines = envContent.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('AI_API_KEY=')) {
      apiKey = trimmed.split('=')[1].trim();
    } else if (trimmed.startsWith('AI_API_BASE=')) {
      apiBase = trimmed.split('=')[1].trim();
    } else if (trimmed.startsWith('AI_MODEL=')) {
      apiModel = trimmed.split('=')[1].trim();
    }
  }
} catch (e) {
  console.error('Error reading .env file:', e.message);
  process.exit(1);
}

if (!apiKey) {
  console.error('Error: AI_API_KEY is missing in .env file.');
  console.log('Please add AI_API_KEY=your_key_here to .env');
  process.exit(1);
}

console.log('Testing connection to AI API...');
console.log(`Base URL: ${apiBase}`);
console.log(`Model: ${apiModel}`);

async function testConnection() {
  try {
    const response = await fetch(`${apiBase}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: apiModel,
        messages: [{ role: 'user', content: 'Hello' }],
        max_tokens: 5
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Request Failed: ${response.status} ${response.statusText}`);
      console.error('Response:', errorText);
    } else {
      const data = await response.json();
      console.log('Connection Successful!');
      console.log('Response:', JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error('Network Error:', error.message);
  }
}

testConnection();

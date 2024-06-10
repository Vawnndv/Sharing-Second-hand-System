import axios from 'axios';

interface ImageUrl {
  url: string;
  detail: string;
}

interface MessageContent {
  type: 'text' | 'image_url';
  text?: string;
  image_url?: ImageUrl;
}

interface Message {
  role: 'user';
  content: MessageContent[];
}

interface GPTRequest {
  model: string;
  messages: Message[];
}

async function getGPTDescription(imageUrls: string[]): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  const apiUrl = 'https://api.openai.com/v1/chat/completions';

  const messageContent: MessageContent[] = [
    {
      type: 'text',
      text: 'Hãy xem xét những tấm ảnh sau, từ đó cho ra 1 đoạn mô tả ngắn khoảng 30 từ (Dùng để điền trong bài đăng mô tả về sản phẩm đó trong ứng dụng của tôi)'
    },
    ...imageUrls.map(url => ({
      type: 'image_url' as const,
      image_url: {
        url,
        detail: 'low'
      }
    }))
  ];

  const requestData: GPTRequest = {
    model: 'gpt-4o',
    messages: [
      {
        role: 'user',
        content: messageContent,
      }
    ]
  };

  try {
    const response = await axios.post(apiUrl, requestData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    });
    
    const description = response.data.choices[0].message.content;
    return description;
  } catch (error) {
    console.error('Error fetching description from GPT-4:', error);
    throw error;
  }
}

export default getGPTDescription;
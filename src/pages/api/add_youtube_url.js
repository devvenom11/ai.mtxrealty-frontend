import { API_PATH } from '@/utils/constants';
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { topic, url } = req.body;
    try {
      const response = await axios.post(
        `${API_PATH}/add_youtube_url/`,
        null, // No body for this request
        {
          params: {
            topic: topic || 'Default', 
            url: url,               
          },
          headers: {
            'accept': 'application/json',
          },
        }
      );

      return res.status(200).json(response.data);
    } catch (error) {
      return res.status(500).json({ error: error.response.data.detail });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

import { API_PATH } from "@/utils/constants";
import axios from "axios";

export default async function handler(req, res) {

    if (req.method === "POST") {
    const { question, answer } = req.body;
    try {
     
      const response = await axios.post(
        `${API_PATH}/add_question_answers/`,
        null, // No body for this request
        {
          params: {
            question: question || 'Default', 
            answer: answer,               
          },
          headers: {
            'accept': 'application/json',
          },
        }
      );

      return res.status(200).json(response.data);
    } catch (error) {
      console.log("error response", error.response);
      return res.status(500).json({ error: error.response.data.detail });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

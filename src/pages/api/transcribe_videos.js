import { API_PATH } from "@/utils/constants";
import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "POST") {

    try {
      const response = await axios.post(
        `${API_PATH}/transcribe_all_videos/`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ error: "Something went wrong" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

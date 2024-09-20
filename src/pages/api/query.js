import { API_PATH } from "@/utils/constants";
import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { query, session_id } = req.body;

    try {
      const response = await axios.get(
        `${API_PATH}/query/?query=${query}&session_id=${
          session_id.length > 0 ? session_id : 0
        }`,
        {
          params: {
            query: query,
            session_id: session_id,
          },
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

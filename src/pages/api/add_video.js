import { API_PATH } from "@/utils/constants";
import axios from "axios";
import formidable from "formidable";
import fs from "fs";
import path from 'path';
import FormData from 'form-data';

export const config = {
  api: {
    bodyParser: false, // We need to disable Next.js body parser to handle multipart form data
  },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const uploadDir = "/tmp";;

    // Ensure the upload directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const form = formidable({
      multiples: false, // Set to false to ensure we only receive one file
      uploadDir, // Ensure uploadDir is being set correctly
      keepExtensions: true,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Error parsing form data:", err);
        return res.status(500).json({ error: "Error parsing form data" });
      }

      // Access the first file if it's an array
      const videoFile = Array.isArray(files.file) ? files.file[0] : files.file;

      // Check if file exists and log the fields for debugging
      if (!videoFile) {
        console.error("No file provided.");
        return res.status(400).json({ error: "No file provided" });
      }

      // Log the parsed file information
      console.log("Parsed file data:", videoFile.filepath, videoFile.newFilename);

      const filePath = videoFile.filepath || path.join(uploadDir, videoFile.newFilename);

      if (!filePath) {
        console.error("File path is undefined.");
        return res.status(500).json({ error: "File path is undefined" });
      }

      try {
        // Create a form data object for sending to the external API
        const formData = new FormData();
        formData.append("file", fs.createReadStream(filePath), videoFile.originalFilename || "video.mp4");

        // Make the POST request to the external API
        const response = await axios.post(`${API_PATH}/add_video`, formData, {
          headers: {
            accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        });
        if (response.status === 200) {
            // Delete the file after successful API call
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error("Failed to delete file:", err);
              } else {
                console.log("File deleted successfully");
              }
            });
          }

        // Send the successful response back to the client
        res.status(200).json(response.data);
      } catch (error) {
        console.error("Error uploading video:", error);
        res.status(500).json({ error: "Error uploading video" });
      }
    });
  } else {
    // Handle any other HTTP method
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

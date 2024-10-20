"use client";
import { API_PATH } from "@/utils/constants";
import { apiCall } from "@/utils/helpers";
import React, { useState } from "react";
import { toast } from "react-toastify";

const Admin = () => {
  const [transcribing, setTranscribing] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const loadData = async () => {
    setLoadingData(true);
    apiCall("POST", "/api/load_data")
      .then(({ data, success, error }) => {
        if (!success) throw error;
        toast.success(`${data.message}. Documents: ${data.docx_count}, PDFs: ${data.pdf_count}, Videos:${data.transcription_count}`);
      })
      .catch(() => toast.error("Failed to load data. Please try again."))
      .finally(() => {
        setLoadingData(false);
      });
  };

  const transcribeVideos = async () => {
    setTranscribing(true);
    apiCall("POST", `${API_PATH}/transcribe_all_videos`)
      .then(({ data, success, error }) => {
        if (!success) throw error;
        toast.success(`${data.message}.`);
      })
      .catch(() => toast.error("Failed to transcribe videos. Please try again."))
      .finally(() => {
        setTranscribing(false);
      });
  };

  return (
    <div className="bg-gray-50 dark:bg-[#212121] min-h-screen py-12">
      <div className="flex items-start justify-center gap-6 mx-auto container my-6">
        <LoadOrTranscribe transcribing={transcribing} loadingData={loadingData} loadData={loadData} transcribeVideos={transcribeVideos} />
        <AddYoutubeUrl loadData={loadData} />
      </div>

      <div className="flex items-start justify-center gap-6 mx-auto container">
        <AddPDF loadData={loadData} />
        <AddVideo transcribeVideos={transcribeVideos} />
      </div>

      <div className="flex items-start justify-center gap-6 mx-auto container mt-6">
        <AddQuestionAnswer />
        <DeleteFiles />
      </div>
    </div>
  );
};

export default Admin;

const DeleteFiles = () => {
  const handleDelete = (e) => {
    e.preventDefault();
    apiCall("DELETE", "/api/reset_data")
      .then(({ success, data, error }) => {
        if (!success) throw error;
        toast.success(`${data.message || "Files deleted successfully."}.`);
      })
      .catch((err) => {
        toast.error(err); // Directly use err for better clarity
      })
      .finally(() => {
        // setLoading(false);
      });
  };

  return (
    <div className="bg-white dark:bg-[#2f2f2f] p-6 rounded-lg shadow-md mr-auto max-w-lg w-[450px]">
      <h2 className="text-xl font-bold mb-4 dark:text-white">Delete files</h2>

      <div className="flex items-center gap-4 mt-36">
        <button className="px-6 py-2 bg-[#4d4d4d] text-white rounded-md hover:bg-[#3c3c3c] disabled:bg-gray-600 disabled:hover:bg-gray-600 text-sm" onClick={handleDelete}>
          Delete Files
        </button>
      </div>
    </div>
  );
};

const AddQuestionAnswer = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleQuestionAnswer = (e) => {
    e.preventDefault();
    setLoading(true);
    apiCall("POST", "/api/add_question_answers", { question, answer })
      .then(({ data, success, error }) => {
        if (!success) throw error;
        toast.success(`${data.message}.`);
        setQuestion("");
        setAnswer("");
        loadData();
      })
      .catch((err) => {
        toast.error(err.error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <form onSubmit={handleQuestionAnswer} className="bg-white dark:bg-[#2f2f2f] p-6 rounded-lg shadow-md ml-auto w-[450px]">
      <h2 className="text-xl font-bold mb-4 dark:text-white">Add Question Answer</h2>

      <label className="block">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full px-4 py-2 text-[#2f2f2f] dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded !bg-white dark:!bg-[#4d4d4d]"
          placeholder="Question"
          required
        />
      </label>

      <label className="block mt-3">
        <input
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full px-4 py-2 text-[#2f2f2f] dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded !bg-white dark:!bg-[#4d4d4d]"
          placeholder="Answer"
          required
        />
      </label>

      <button
        className="mt-8 px-6 py-2 bg-[#4d4d4d] text-white rounded-md hover:bg-[#3c3c3c] disabled:bg-gray-600 disabled:hover:bg-gray-600 text-sm"
        disabled={loading || answer.length < 2}
        type="submit"
      >
        Add Questions
      </button>
    </form>
  );
};

const LoadOrTranscribe = ({ loadingData, transcribing, loadData, transcribeVideos }) => {
  return (
    <div className="bg-white dark:bg-[#2f2f2f] p-6 rounded-lg shadow-md ml-auto max-w-lg w-[450px]">
      <h2 className="text-xl font-bold mb-4 dark:text-white">Load data</h2>

      <p className="dark:text-gray-300">Please use the buttons below to perform specific operations</p>

      <div className="mb-2.5 mt-8">
        <p className="text-[16px] font-[500] dark:text-gray-300">Choose type</p>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <button
          disabled={transcribing || loadingData}
          className="px-6 py-2 bg-[#4d4d4d] text-white rounded-md hover:bg-[#3c3c3c] disabled:bg-gray-600 disabled:hover:bg-gray-600 text-sm"
          onClick={loadData}
        >
          {loadingData ? "Loading data..." : "Load data"}
        </button>

        <button
          disabled={transcribing || loadingData}
          className="px-6 py-2 bg-[#4d4d4d] text-white rounded-md hover:bg-[#3c3c3c] disabled:bg-gray-600 disabled:hover:bg-gray-600 text-sm"
          onClick={transcribeVideos}
        >
          {transcribing ? "Transcribing videos..." : "Transcribe Videos"}
        </button>
      </div>
    </div>
  );
};

const AddYoutubeUrl = ({ loadData }) => {
  const [url, setUrl] = useState("");
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);

  const handleYoutubeURL = (e) => {
    e.preventDefault();
    setLoading(true);
    apiCall("POST", "/api/add_youtube_url", { url, topic })
      .then(({ data, success, error }) => {
        if (!success) throw error;
        toast.success(`${data.message}.`);
        setTopic("");
        setUrl("");
        loadData();
      })
      .catch((err) => {
        toast.error(err.error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <form onSubmit={handleYoutubeURL} className="bg-white dark:bg-[#2f2f2f] p-6 rounded-lg shadow-md mr-auto max-w-lg w-[450px]">
      <h2 className="text-xl font-bold mb-4 dark:text-white">Add Youtube link</h2>

      <label className="block">
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full px-4 py-2 text-[#2f2f2f] dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded !bg-white dark:!bg-[#4d4d4d]"
          placeholder="Title"
          required
        />
      </label>

      <label className="block mt-3">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full px-4 py-2 text-[#2f2f2f] dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded !bg-white dark:!bg-[#4d4d4d]"
          placeholder="Youtube URL"
          required
        />
      </label>

      <button
        className="mt-8 px-6 py-2 bg-[#4d4d4d] text-white rounded-md hover:bg-[#3c3c3c] disabled:bg-gray-600 disabled:hover:bg-gray-600 text-sm"
        disabled={loading || !url || topic.length < 2}
        type="submit"
      >
        {loading ? "Adding youtube URL.." : "Add youtube URL"}
      </button>
    </form>
  );
};

const AddPDF = ({ loadData }) => {
  const [file, setFile] = useState();
  const [loading, setLoading] = useState(false);

  const handleAddFile = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/add_document", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        setFile(null);
        loadData();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error(error || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleAddFile} className="bg-white dark:bg-[#2f2f2f] p-6 rounded-lg shadow-md ml-auto max-w-lg w-[450px]">
      <h2 className="text-xl font-bold mb-4 dark:text-white">Add PDF document</h2>

      <label className="block mt-3">
        <p className="mb-1 dark:text-gray-300">
          Document <sup className="text-red-500 font-bold">*</sup>
        </p>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="px-4 py-2 text-[#2f2f2f] dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded !bg-white dark:!bg-[#4d4d4d]"
          required
        />
      </label>

      <button className="mt-8 px-6 py-2 bg-[#4d4d4d] text-white rounded-md hover:bg-[#3c3c3c] disabled:bg-gray-600 disabled:hover:bg-gray-600 text-sm" disabled={loading || !file} type="submit">
        {loading ? "Adding PDF document.." : "Add PDF document"}
      </button>
    </form>
  );
};

const AddVideo = ({ transcribeVideos }) => {
  const [file, setFile] = useState();
  const [loading, setLoading] = useState(false);

  const handleAddFile = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/add_video", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        setFile(null);
        transcribeVideos();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error(error || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleAddFile} className="bg-white dark:bg-[#2f2f2f] p-6 rounded-lg shadow-md mr-auto max-w-lg w-[450px]">
      <h2 className="text-xl font-bold mb-4 dark:text-white">Add video</h2>

      <label className="block mt-3">
        <p className="mb-1 dark:text-gray-300">
          Video <sup className="text-red-500 font-bold">*</sup>
        </p>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="px-4 py-2 text-[#2f2f2f] dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded !bg-white dark:!bg-[#4d4d4d]"
          required
        />
      </label>

      <button className="mt-8 px-6 py-2 bg-[#4d4d4d] text-white rounded-md hover:bg-[#3c3c3c] disabled:bg-gray-600 disabled:hover:bg-gray-600 text-sm" disabled={loading || !file} type="submit">
        {loading ? "Adding video.." : "Add video"}
      </button>
    </form>
  );
};

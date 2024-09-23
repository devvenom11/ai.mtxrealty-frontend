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
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="flex items-start justify-center gap-6 mx-auto container my-6">
        <LoadOrTranscribe transcribing={transcribing} loadingData={loadingData} loadData={loadData} transcribeVideos={transcribeVideos} />
        <AddYoutubeUrl loadData={loadData} />
      </div>
      <div className="flex items-start justify-center gap-6 mx-auto container">
        <AddPDF loadData={loadData} />
        <AddVideo transcribeVideos={transcribeVideos} />
      </div>
    </div>
  );
};

export default Admin;

const LoadOrTranscribe = ({ loadingData, transcribing, loadData, transcribeVideos }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md ml-auto max-w-lg w-[450px]">
      <h2 className="text-xl font-bold mb-4">Load data</h2>

      <p>Please use the buttons below to perform specific operations</p>

      <div className="mb-2.5 mt-8">
        <p className="text-[16px] font-[500]">Choose type</p>
      </div>
      <div className="flex items-center gap-4 mb-4">
        <button
          disabled={transcribing || loadingData}
          className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-600 disabled:hover:bg-gray-600 text-sm"
          onClick={loadData}
        >
          {loadingData ? "Loading data..." : "Load data"}
        </button>
        <button
          disabled={transcribing || loadingData}
          className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-600 disabled:hover:bg-gray-600 text-sm"
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
    <form onSubmit={handleYoutubeURL} className="bg-white p-6 rounded-lg shadow-md mr-auto max-w-lg w-[450px]">
      <h2 className="text-xl font-bold mb-4">Add Youtube link </h2>
      <label className="block">
        <input value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full px-4 py-2 text-gray-800 border border-gray-300 rounded !bg-white" placeholder="Title" required />
      </label>
      <label className="block mt-3">
        <input value={url} onChange={(e) => setUrl(e.target.value)} className="w-full px-4 py-2 text-gray-800 border border-gray-300 rounded !bg-white" placeholder="Youtube URL" required />
      </label>
      <button
        className="mt-8 px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-600 disabled:hover:bg-gray-600 text-sm"
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
    <form onSubmit={handleAddFile} className="bg-white p-6 rounded-lg shadow-md ml-auto max-w-lg w-[450px]">
      <h2 className="text-xl font-bold mb-4">Add PDF document </h2>

      <label className="block mt-3">
        <p className="mb-1">
          Document <sup className="text-red-500 font-bold">*</sup>
        </p>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="px-4 py-2 text-gray-800 border border-gray-300 rounded !bg-white"
          placeholder="Youtube URL"
          required
        />
      </label>
      <button className="mt-8 px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-600 disabled:hover:bg-gray-600 text-sm" disabled={loading || !file} type="submit">
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
    <form onSubmit={handleAddFile} className="bg-white p-6 rounded-lg shadow-md mr-auto max-w-lg w-[450px]">
      <h2 className="text-xl font-bold mb-4">Add video </h2>

      <label className="block mt-3">
        <p className="mb-1">
          Video <sup className="text-red-500 font-bold">*</sup>
        </p>
        <input type="file" accept="video/*" onChange={(e) => setFile(e.target.files[0])} className="px-4 py-2 text-gray-800 border border-gray-300 rounded !bg-white" required />
      </label>
      <button className="mt-8 px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-600 disabled:hover:bg-gray-600 text-sm" disabled={loading || !file} type="submit">
        {loading ? "Adding video.." : "Add video"}
      </button>
    </form>
  );
};

import { useEffect, useState } from "react";
import "./App.css";
import Compressor from "compressorjs";

let statusTimeout: number;

function App() {
  const [file, setFile] = useState<File | undefined>(undefined);
  const [status, setStatus] = useState<
    "loading" | "success" | "failure" | undefined
  >(undefined);

  async function compressImage(
    fileInput: File | Blob,
    quality: number
  ): Promise<File | Blob | void> {
    return new Promise((resolve, reject) => {
      const options = {
        quality: quality || 0.8,
        success(result: File | Blob) {
          resolve(result);
        },
        error(err: Error) {
          reject(err.message || err);
        },
      };

      new Compressor(fileInput, options);
    });
  }

  // const compressFile = async (file: File): Promise<void> => {
  //   new Compressor(file, {
  //     quality: 0.6,

  //     // The compression process is asynchronous,
  //     // which means you have to access the `result` in the `success` hook function.
  //     success(result) {
  //       setFileToUpload(result);
  //     },
  //     error(err) {
  //       console.log(err.message);
  //     },
  //   });
  // };

  async function uploadFile(fileToUpload: File | Blob, signedUrl: string) {
    try {
      // Use the signed URL to upload the file to S3
      const response = await fetch(signedUrl, {
        method: "PUT",
        body: fileToUpload,
        headers: {
          "Content-Type": fileToUpload.type,
        },
      });

      if (response.ok) {
        console.log("File uploaded successfully!");
        // Handle success, update UI, etc.
      } else {
        console.error(
          "File upload failed:",
          response.status,
          response.statusText
        );
        // Handle error, update UI, etc.
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  }

  // Make fetch request to backend - send the fileExtension and receive the request URL.
  const fetchSignedUrl = async (): Promise<string | void> => {
    try {
      if (!file) throw new Error("no file selected");

      const fileExtension =
        file.name.substring(file.name.lastIndexOf(".") + 1, file.name.length) ||
        file.name;

      const { secureUploadUrl } = await fetch(
        "http://localhost:8000?" +
          new URLSearchParams({
            fileExtension,
          })
      ).then((response) => {
        // Check if the request was successful (status code 2xx)
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response.json();
      });

      if (!secureUploadUrl || typeof secureUploadUrl !== "string") {
        throw new Error("missing secure upload url");
      }

      return secureUploadUrl;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!status || status === "loading") return;

    if (statusTimeout) clearTimeout(statusTimeout);

    statusTimeout = setTimeout(() => {
      setStatus(undefined);
    }, 4000);
  }, [status]);

  const handleFetchSignedUrl = async (): Promise<void> => {
    setStatus("loading");
    try {
      const signedUrl = await fetchSignedUrl();
      if (!signedUrl || !file) {
        throw new Error("missing signedUrl");
      }

      let imageData: File | Blob = file;
      if (true && file) {
        const compressedData = await compressImage(file, 0.1);
        if (!compressedData) throw new Error("Failed to compress image");

        imageData = compressedData;
      }
      await uploadFile(imageData, signedUrl);
      setStatus("success");
    } catch (error) {
      setStatus("failure");
    }
  };

  return (
    <div>
      {status && (
        <div className={`status ${status ? `status-${status}` : ""}`}>
          {status}
        </div>
      )}

      <div className="flex-down">
        <h1>Get signed url</h1>
        <input
          type="file"
          name="image-upload"
          id="image-upload"
          accept="image/jpeg"
          onChange={(e) => setFile(e.target.files?.[0])}
        />
        <button disabled={!file} onClick={handleFetchSignedUrl}>
          Upload File
        </button>
      </div>
    </div>
  );
}

export default App;

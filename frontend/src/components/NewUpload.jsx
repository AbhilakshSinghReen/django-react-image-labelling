import React, { useState } from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { detectNew } from "../api/apiServices";

const NewUpload = () => {
  const navigate = useNavigate();

  const [filename, setFilename] = useState(null);
  const [file, setFile] = useState(null);
  const [filepath, setFilepath] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile && uploadedFile.type === "image/jpeg") {
      setFilename(uploadedFile.name);
      setFilepath(uploadedFile);
      const reader = new FileReader();
      reader.onload = (e) => {
        const f = e.target.result;
        const blob = new Blob([f], { type: f.type });
        setFile(f);
      };
      reader.readAsDataURL(uploadedFile);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "image/jpeg") {
      setFilename(droppedFile.name);
      setFilepath(droppedFile);
      const reader = new FileReader();
      reader.onload = (e) => {
        const f = e.target.result;
        const blob = new Blob([f], { type: f.type });
        setFile(f);
      };
      reader.readAsDataURL(droppedFile);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const goButtonOnClick = async () => {
    setIsUploading(true);
    const detectionId = await detectNew(filepath);

    if (detectionId === -1) {
      setIsUploading(false);
      alert("An error occurred while uploading the image.");
      return;
    }

    setIsUploading(false);
    navigate(`/labelling/${detectionId}`);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: "5vh",
      }}
    >
      {file ? (
        <img
          style={{
            display: "block",
            maxWidth: "50vw",
            maxHeight: "50vh",
            width: "auto",
            height: "auto",
            marginBottom: "5vh",
          }}
          src={file}
          alt="uploaded image"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        />
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          style={{
            width: "50vw",
            height: "50vh",
            borderWidth: "5px",
            borderColor: "#000000",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Drag and drop image file here
        </div>
      )}
      <input
        id="image-upload-input"
        type="file"
        accept=".jpg"
        onChange={handleFileUpload}
        // style="display:none;"
        style={{ display: "none" }}
      />
      <label
        for="image-upload-input"
        style={{
          backgroundColor: "#EDEDED",
          padding: 10,
          borderRadius: 5,
          marginBottom: 15,
        }}
      >
        {filename ? filename : "No file chosen"}
      </label>
      {isUploading ? (
        <ClipLoader color={"#0000EE"} loading={true} size={35} />
      ) : (
        <Button
          variant="contained"
          disabled={file === null}
          onClick={goButtonOnClick}
        >
          Go!
        </Button>
      )}
    </div>
  );
};

export default NewUpload;

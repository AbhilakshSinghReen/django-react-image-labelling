import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getAllSavedDetections } from "../api/apiServices";
import { Button } from "@mui/material";

export default function History() {
  const navigate = useNavigate();

  const [savedDetections, setSavedDetections] = useState([]);

  const getAllSavedDetectionsFromApi = async () => {
    const responseData = await getAllSavedDetections();

    responseData.sort((a, b) => b.timestamp - a.timestamp);

    setSavedDetections(responseData);
  };

  useEffect(() => {
    getAllSavedDetectionsFromApi();
  }, []);

  return (
    <div>
      <h1
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        History
      </h1>

      <div
        style={{
          width: "80%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
        }}
      >
        {savedDetections.map((detection, index) => (
          <Button
            key={index}
            onClick={() => {
              navigate(`/labelling/${detection.id}`);
            }}
          >
            {new Date(detection.timestamp).toString().slice(0, 24)}
          </Button>
        ))}
      </div>
    </div>
  );
}

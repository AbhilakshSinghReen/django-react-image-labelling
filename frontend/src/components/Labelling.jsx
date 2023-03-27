import React, { useState, useEffect } from "react";
import { json, useParams } from "react-router-dom";
import Canvas from "./Canvas";

import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import { IconButton } from "@mui/material";

import { Delete } from "@mui/icons-material";

import { getDetectionDetail, updateDetectionDetails } from "../api/apiServices";
import ClipLoader from "react-spinners/ClipLoader";

export default function Labelling() {
  const { id: detectionId } = useParams();

  const [detectionDetails, setDetectionDetails] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedDetectionClassLabel, setSelectedDetectionClassLabel] =
    useState("");
  const [
    selectedDetectionClassConfidence,
    setSelectedDetectionClassConfidence,
  ] = useState("");
  const [newBboxLabel, setNewBboxLabel] = useState("");
  const [hasChanged, setHasChanged] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const getDetectionDetailsFromApi = async () => {
    const responseData = await getDetectionDetail(detectionId);

    if (responseData === null) {
      alert("Failed to fetch.");
      return;
    }

    const data = {
      image_filename: responseData.image_filename,
      id: responseData.id,
      detections: JSON.parse(responseData.detections),
      original_detections: JSON.parse(responseData.original_detections),
    };

    data.detections = data.detections.map((detection, index) => ({
      ...detection,
      x: detection.x_min,
      y: detection.y_min,
      width: detection.x_max - detection.x_min,
      height: detection.y_max - detection.y_min,
      stroke: detection.class_confidence === -1 ? "#FF0000" : "#00FF00",
      id: index.toString(),
    }));

    setDetectionDetails(data);
    // setOriginalDetectionDetails(data);
  };

  const removeSelectedBbox = () => {
    setDetectionDetails({
      ...detectionDetails,
      detections: detectionDetails.detections.filter(
        (detection) => detection.id !== selectedId
      ),
    });
    setSelectedId(null);
  };

  const saveDetections = async () => {
    // only send id and detections
    setIsSaving(true);

    const updatedDetections = detectionDetails.detections.map((detection) => ({
      class_name: detection.class_name,
      class_confidence: detection.class_confidence,
      x_min: detection.x,
      y_min: detection.y,
      x_max: detection.x + detection.width,
      y_max: detection.y + detection.height,
    }));

    const responseData = await updateDetectionDetails(
      detectionDetails.id,
      JSON.stringify(updatedDetections)
    );

    if (responseData === null) {
      alert("Failed to save.");
      setIsSaving(false);
      return;
    }

    const data = {
      image_filename: responseData.image_filename,
      id: responseData.id,
      detections: JSON.parse(responseData.detections),
      original_detections: JSON.parse(responseData.original_detections),
    };

    data.detections = data.detections.map((detection, index) => ({
      ...detection,
      x: detection.x_min,
      y: detection.y_min,
      width: detection.x_max - detection.x_min,
      height: detection.y_max - detection.y_min,
      stroke: detection.class_confidence === -1 ? "#FF0000" : "#00FF00",
      id: index.toString(),
    }));

    setDetectionDetails(data);
    // setOriginalDetectionDetails(data);
    setIsSaving(false);
  };

  const addBbox = () => {
    setIsSaving(true);

    // console.log("Adding new bbox");

    const data = detectionDetails;
    const newBboxId = data.detections.length;
    data.detections.push({
      class_name: newBboxLabel,
      class_confidence: -1,
      x_min: 10,
      y_min: 10,
      x_max: 110,
      y_max: 110,
      x: 10,
      y: 10,
      width: 100,
      height: 100,
      stroke: "#FF0000",
      id: newBboxId.toString(),
    });

    setDetectionDetails(data);

    console.log("bbox added ", newBboxId);

    setIsSaving(false);
    setNewBboxLabel("");
  };

  useEffect(() => {
    getDetectionDetailsFromApi();
  }, []);

  useEffect(() => {
    if (selectedId === null) {
      setSelectedDetectionClassLabel("");
      setSelectedDetectionClassConfidence("");
      return;
    }
    setSelectedDetectionClassLabel(
      detectionDetails?.detections[parseInt(selectedId)].class_name
    );
    setSelectedDetectionClassConfidence(
      detectionDetails?.detections[parseInt(selectedId)].class_confidence
    );
  }, [selectedId]);

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
      {detectionDetails != null ? (
        <Canvas
          detectionDetails={detectionDetails}
          setDetectionDetails={setDetectionDetails}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          hasChanged={hasChanged}
          setHasChanged={setHasChanged}
        />
      ) : (
        <h1>Loading</h1>
      )}

      <div style={{ display: "flex", flexDirection: "row" }}>
        <h3>
          {selectedDetectionClassLabel
            ? `${selectedDetectionClassLabel}: ${selectedDetectionClassConfidence}%`
            : "Select a bounding box to display label and confidence."}
        </h3>
        {selectedDetectionClassLabel ? (
          <IconButton
            variant="contained"
            color="error"
            style={{ marginLeft: 25 }}
            onClick={() => removeSelectedBbox()}
          >
            <Delete />
          </IconButton>
        ) : null}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 25,
        }}
      >
        <TextField
          variant="outlined"
          value={newBboxLabel}
          onChange={(event) => setNewBboxLabel(event.target.value)}
          style={{ marginRight: 25 }}
        />
        <Button
          variant="contained"
          style={{ marginRight: 25 }}
          onClick={() => addBbox()}
          disabled={newBboxLabel === ""}
        >
          Add Bbox
        </Button>
      </div>

      <div style={{ display: "flex", flexDirection: "row" }}>
        {isSaving ? (
          <ClipLoader color={"#0000EE"} loading={true} size={35} />
        ) : (
          <Button
            variant="contained"
            style={{ marginRight: 25 }}
            onClick={() => saveDetections()}
            disabled={!hasChanged}
          >
            Save
          </Button>
        )}

        <Button
          variant="contained"
          color="error"
          onClick={() => {
            console.log("resetting");
            const data = detectionDetails;

            data.detections = data.original_detections;

            data.detections = data.detections.map((detection, index) => ({
              ...detection,
              x: detection.x_min,
              y: detection.y_min,
              width: detection.x_max - detection.x_min,
              height: detection.y_max - detection.y_min,
              stroke: "#00FF00",
              id: index.toString(),
            }));

            setDetectionDetails(data);
            setSelectedId("1");
            setSelectedId(null);
            setHasChanged(true);

            setNewBboxLabel("");
          }}
        >
          Reset Detections
        </Button>
      </div>
    </div>
  );
}

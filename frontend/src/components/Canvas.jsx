import React, { useEffect } from "react";
import { Stage, Layer, Rect } from "react-konva";
import useImage from "use-image";

import Rectangle from "./Rectangle";

export default function Canvas({
  detectionDetails,
  setDetectionDetails,
  selectedId,
  setSelectedId,
  hasChanged,
  setHasChanged,
}) {
  // console.log(detectionDetails);

  const [image] = useImage(detectionDetails.image_filename);

  const checkDeselect = (e) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedId(null);
    }
  };

  return (
    <Stage
      width={image?.width}
      height={image?.height}
      onMouseDown={checkDeselect}
      onTouchStart={checkDeselect}
    >
      <Layer>
        <Rect
          x={0}
          y={0}
          width={image?.width}
          height={image?.height}
          fillPatternImage={image}
          draggable={false}
          listening={false}
        />

        {detectionDetails.detections.map((detection, index) => (
          <Rectangle
            shapeProps={detection}
            isSelected={detection.id === selectedId}
            onSelect={() => {
              setSelectedId(detection.id);
            }}
            onChange={(newAttrs) => {
              setHasChanged(true);
              const rects = detectionDetails.detections.slice();
              rects[index] = newAttrs;
              setDetectionDetails({
                ...detectionDetails,
                detections: rects,
              });
            }}
            key={index}
          />
        ))}
      </Layer>
    </Stage>
  );
}

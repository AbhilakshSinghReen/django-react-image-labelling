// import apiClient from "./axiosInstance";

const apiBaseUrl = "http://127.0.0.1:8000";
const mediaUrl = "http://127.0.0.1:8000/media";
const apiEndpoints = {
  detectNew: "/detector/detect-new/",
  getDetectionDetail: "/detector/get-detail?id={{id}}",
  updateDetectionDetails: "/detector/update-saved/",
  getAllSavedDetections: "/detector/get-saved-detections",
};

async function detectNew(image) {
  try {
    const formData = new FormData();
    formData.append("image", image);

    const response = await fetch(apiBaseUrl + apiEndpoints.detectNew, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    return data.id;
  } catch (error) {
    console.log(error);
    return -1;
  }
}

async function getDetectionDetail(detectionId) {
  try {
    const response = await fetch(
      apiBaseUrl +
        apiEndpoints.getDetectionDetail.replace("{{id}}", detectionId)
    );
    const data = await response.json();
    data.image_filename =
      mediaUrl + "/detection_images" + "/" + data.image_filename;

    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

async function updateDetectionDetails(id, stringifiedUpdatedDetections) {
  try {
    const response = await fetch(
      apiBaseUrl + apiEndpoints.updateDetectionDetails,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, detections: stringifiedUpdatedDetections }),
      }
    );

    const data = await response.json();
    data.image_filename =
      mediaUrl + "/detection_images" + "/" + data.image_filename;

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getAllSavedDetections() {
  try {
    const response = await fetch(
      apiBaseUrl + apiEndpoints.getAllSavedDetections
    );
    const data = await response.json();

    const detectionDetails = [];
    data.forEach((element) => {
      let timestamp = element.image_filename.split("_")[1];
      timestamp = timestamp.split(".")[0];
      timestamp = parseInt(timestamp);

      detectionDetails.push({
        timestamp: timestamp,
        id: element.id,
      });
    });

    return detectionDetails;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

export {
  detectNew,
  getDetectionDetail,
  updateDetectionDetails,
  getAllSavedDetections,
};

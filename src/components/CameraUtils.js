import { useState, useRef } from "react";
import { Camera } from "expo-camera";
import * as FileSystem from "expo-file-system";

const useCamera = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const cameraRef = useRef(null);

  const checkCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === "granted");
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        const savedPhoto = await savePhoto(photo);
        console.log("Photo saved:", savedPhoto.uri);
        return savedPhoto;
      } catch (error) {
        console.error("Error taking or saving picture:", error);
        throw error;
      }
    } else {
      throw new Error("Camera ref is not initialized");
    }
  };

  const savePhoto = async (photo) => {
    try {
      // Create a FormData object to send the photo as a file
      const formData = new FormData();
      formData.append("file", {
        uri: photo.uri,
        name: `${Date.now()}.jpg`,
        type: "image/jpeg",
      });

      const bucketName = "color_harmony";
      const uploadUrl = `https://storage.googleapis.com/upload/storage/v1/b/${bucketName}/o?uploadType=media`;

      // Make a POST request to upload the photo to the GCS bucket
      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "image/jpeg",
        },
      });

      // Check if the upload was successful
      if (!response.ok) {
        throw new Error("Failed to upload photo to Google Cloud Storage");
      }

      // Return the GCS URL of the uploaded photo
      const gcsUrl = `https://storage.googleapis.com/${bucketName}/${Date.now()}.jpg`;
      return { uri: gcsUrl };
    } catch (error) {
      console.error("Error uploading photo to Google Cloud Storage:", error);
      throw error;
    }
  };

  return { hasPermission, checkCameraPermission, cameraRef, takePicture };
};

export default useCamera;

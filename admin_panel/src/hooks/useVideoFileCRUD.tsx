import { useCallback, useEffect, useState } from "react";
import { storage } from "../firebase";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

export const useVideoFileCRUD = () => {
  const [currentVideoFileId, setCurrentVideoFileId] = useState<string>("");
  const [videoFileUrl, setVideoFileUrl] = useState<string>("");

  useEffect(() => {
    if (currentVideoFileId) {
      getDownloadURL(ref(storage, `Videos/${currentVideoFileId}`))
        .then((url) => {
          setVideoFileUrl(url);
        })
        .catch((_) => {
          setVideoFileUrl("");
        });
    }
  }, [currentVideoFileId]);

  const uploadVideoFile = useCallback(
    async (file: File, video_file_id: string) => {
      try {
        const buffer = await file.arrayBuffer();
        await uploadBytes(ref(storage, `Videos/${video_file_id}`), buffer);
      } catch (_) {}
    },
    []
  );

  const deleteVideoFile = useCallback(async (video_file_id: string) => {
    try {
      await deleteObject(ref(storage, `Videos/${video_file_id}`));
    } catch (_) {}
  }, []);
  return {
    videoFileUrl,
    setCurrentVideoFileId,
    uploadVideoFile,
    deleteVideoFile,
  };
};

import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { useCallback, useEffect, useState } from "react";
import { storage } from "../firebase";

export const useCategoryImageCRUD = () => {
  const [currentImgId, setCurrentImgId] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    if (currentImgId) {
      getDownloadURL(ref(storage, `Images/Categories/${currentImgId}`))
        .then((url) => {
          setImageUrl(url);
        })
        .catch(() => {
          setImageUrl("");
        });
    }
  }, [currentImgId]);

  const uploadCategoryImage = useCallback(
    async (file: File, img_id: string) => {
      try {
        const buffer = await file.arrayBuffer();
        await uploadBytes(ref(storage, `Images/Categories/${img_id}`), buffer);
      } catch (_) {}
    },
    []
  );

  const deleteCategoryImage = useCallback(async (img_id: string) => {
    try {
      await deleteObject(ref(storage, `Images/Categories/${img_id}`));
    } catch (_) {}
  }, []);

  return {
    uploadCategoryImage,
    imageUrl,
    setCurrentImgId,
    deleteCategoryImage,
  };
};

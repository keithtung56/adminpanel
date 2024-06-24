import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { useCallback, useEffect, useState } from "react";
import { storage } from "../firebase";

export const useProductImageCRUD = () => {
  const [currentImgId, setCurrentImgId] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    if (currentImgId) {
      getDownloadURL(ref(storage, `Images/Products/${currentImgId}`))
        .then((url) => {
          setImageUrl(url);
        })
        .catch((_) => {
          setImageUrl("");
        });
    }
  }, [currentImgId]);

  const uploadProductImage = useCallback(async (file: File, img_id: string) => {
    try {
      const buffer = await file.arrayBuffer();
      await uploadBytes(ref(storage, `Images/Products/${img_id}`), buffer);
    } catch (e) {
      console.log(e);
    }
  }, []);

  const deleteProductImage = useCallback(async (img_id: string) => {
    try {
      await deleteObject(ref(storage, `Images/Products/${img_id}`));
    } catch (_) {}
  }, []);

  return { uploadProductImage, imageUrl, setCurrentImgId, deleteProductImage };
};

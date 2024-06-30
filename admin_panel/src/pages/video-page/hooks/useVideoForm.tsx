import { useCallback, useEffect, useMemo, useState } from "react";
import { Video, useVideoCRUD, useVideoFileCRUD } from "../../../hooks";
import { FormikForm, FormikFormFields } from "../../../components";
import { useTranslation } from "react-i18next";
import { VideoFormActions } from "../enum";

export const useVideoForm = (
  action: VideoFormActions,
  selectedVideo: Video | undefined
) => {
  const { t } = useTranslation();
  const [videoFile, setVideoFile] = useState<File | undefined>(undefined);
  const { createVideo } = useVideoCRUD();
  const { videoFileUrl, setCurrentVideoFileId } = useVideoFileCRUD();

  console.log(videoFile);

  useEffect(() => {
    setCurrentVideoFileId(selectedVideo?.video_file_id ?? "");
  }, [selectedVideo, setCurrentVideoFileId]);

  const fields: FormikForm[] = useMemo(
    () => [
      {
        label: t("video.title"),
        name: "title",
        disabled: [VideoFormActions.View].includes(action),
        fieldType: FormikFormFields.TextField,
      },
    ],
    [action, t]
  );

  const title = useMemo(() => {
    if (action === VideoFormActions.Add) {
      return t("form.addVideo.title");
    }
    if (action === VideoFormActions.View) {
      return t("form.viewVideo.title");
    }
  }, [action, t]);
  const initValues = useMemo(() => {
    if (action === VideoFormActions.Edit || action === VideoFormActions.View) {
      return {
        title: selectedVideo?.title,
      };
    }
    if (action === VideoFormActions.Add) {
      return {
        title: "",
      };
    }
    return {};
  }, [selectedVideo, action]);

  const schema = useMemo(() => {
    return undefined;
  }, []);

  const formOnSubmit = useCallback(
    async (values: any) => {
      if (action === VideoFormActions.Add) {
        await createVideo(values.title, videoFile, true);
      }
      return () => {};
    },
    [action, videoFile, createVideo]
  );

  return {
    fields,
    initValues,
    schema,
    formOnSubmit,
    setVideoFile,
    videoFileUrl,
    videoFile,
    title,
  };
};

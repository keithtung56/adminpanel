import { get, onValue, ref, remove, update } from "firebase/database";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { DATE_DB_FORMAT } from "../constants";
import { auth, database } from "../firebase";
import uuid from "react-uuid";
import { useVideoFileCRUD } from "./useVideoFileCRUD";

export type Video = {
  title: string;
  id: string;
  upload_user_id: string;
  created_time: moment.Moment;
  modified_time: moment.Moment;
  video_file_id: string;
};
export const useVideoCRUD = () => {
  const [videoList, setVideoList] = useState<Video[]>([]);
  const { deleteVideoFile, uploadVideoFile } = useVideoFileCRUD();
  useEffect(() => {
    const unsubscribe = onValue(ref(database, "/Videos"), (snapshot) => {
      const res = snapshot.val();
      if (res) {
        setVideoList(
          //@ts-ignore
          Object.entries(res).reduce(
            (acc: Video[], [id, attr]: [string, any]) => {
              const {
                created_time,
                modified_time,
                title,
                upload_user_id,
                video_file_id,
                ...other
              } = attr;
              return [
                ...acc,
                {
                  ...other,
                  id,
                  title,
                  video_file_id,
                  upload_user_id,
                  created_time: moment(created_time, DATE_DB_FORMAT),
                  modified_time: moment(modified_time, DATE_DB_FORMAT),
                },
              ];
            },
            []
          )
        );
      } else {
        setVideoList([]);
      }
    });
    return unsubscribe;
  }, [setVideoList]);

  const createVideo = useCallback(
    async (
      title: string,
      video_file: File | undefined,
      video_need_update: boolean
    ) => {
      const video_random_id = uuid();
      let video_file_random_id;
      if (video_need_update && video_file) {
        video_file_random_id = uuid();
        await uploadVideoFile(video_file, video_file_random_id);
      }
      await update(ref(database, `/Videos/${video_random_id}`), {
        title,
        upload_user_id: auth.currentUser?.uid,
        created_time: moment().format(DATE_DB_FORMAT),
        modified_time: moment().format(DATE_DB_FORMAT),
        video_file_id: video_file_random_id ? video_file_random_id : {},
      });
    },
    [uploadVideoFile]
  );

  const deleteVideo = useCallback(
    async (video_id: string) => {
      const snapshot = await get(
        ref(database, `/Videos/${video_id}/video_file_id`)
      );
      const video_file_id = snapshot.val();
      if (video_file_id) {
        deleteVideoFile(video_file_id);
      }
      await remove(ref(database, `/Videos/${video_id}`));
    },
    [deleteVideoFile]
  );

  return { videoList, deleteVideo, createVideo };
};

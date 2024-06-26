import { ref, onValue, update, remove } from "firebase/database";
import { database } from "../firebase";
import { useCallback, useEffect, useState } from "react";
import uuid from "react-uuid";
import moment from "moment";
import { DATE_DB_FORMAT } from "../constants";

export type Message = {
  message_id: string;
  content: string;
  created_time: moment.Moment;
  modified_time: moment.Moment;
};
export const useMessageCRUD = () => {
  const [messageList, setMessageList] = useState<Message[]>([]);
  useEffect(() => {
    const unsubscribe = onValue(ref(database, "/Messages"), (snapshot) => {
      const res = snapshot.val();
      if (res) {
        setMessageList(
          //@ts-ignore
          Object.entries(res).reduce(
            (acc: Message[], [message_id, attr]: [string, any]) => {
              const { created_time, modified_time, content } = attr;
              return [
                ...acc,
                {
                  content,
                  message_id,
                  created_time: moment(created_time, DATE_DB_FORMAT),
                  modified_time: moment(modified_time, DATE_DB_FORMAT),
                },
              ];
            },
            []
          )
        );
      } else {
        setMessageList([]);
      }
    });
    return unsubscribe;
  }, [setMessageList]);

  const createMessage = useCallback(async (content: string) => {
    const message_random_id = uuid();
    await update(ref(database, `/Messages/${message_random_id}`), {
      content,
      created_time: moment().format(DATE_DB_FORMAT),
      modified_time: moment().format(DATE_DB_FORMAT),
    });
  }, []);

  const deleteMessage = useCallback(async (message_id: string) => {
    await remove(ref(database, `/Messages/${message_id}`));
  }, []);

  const updateMessage = useCallback(
    async (message_id: string, content: string) => {
      await update(ref(database, `/Messages/${message_id}`), { content });
    },
    []
  );

  return { messageList, createMessage, deleteMessage, updateMessage };
};

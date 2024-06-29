import { ref, onValue, update, remove } from "firebase/database";
import { database, secondaryAuth } from "../firebase";
import { useCallback, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { DATE_DB_FORMAT } from "../constants";
import moment from "moment";

export type User = {
  uid: string;
  username: string;
  password: string;
  phone: string;
  email: string;
  age: number;
  gender: string;
  created_time: moment.Moment;
  modified_time: moment.Moment;
};
export const useUserCRUD = () => {
  const [userList, setuserList] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = onValue(ref(database, "/Users"), (snapshot) => {
      const res = snapshot.val();
      if (res) {
        setuserList(
          //@ts-ignore
          Object.entries(res).reduce(
            (acc: string[], [uid, attr]: [string, any]) => {
              const { created_time, modified_time, ...other } = attr;
              return [
                ...acc,
                {
                  ...other,
                  uid,
                  created_time: moment(created_time, DATE_DB_FORMAT),
                  modified_time: moment(modified_time, DATE_DB_FORMAT),
                },
              ];
            },
            []
          )
        );
      } else {
        setuserList([]);
      }
      setIsLoading(false);
    });
    return unsubscribe;
  }, [setuserList, setIsLoading]);

  const createUser = useCallback(
    async (
      username: string,
      email: string,
      password: string,
      phone: string,
      age: number,
      gender: string,
      uid: string
    ) => {
      const newUser = {
        username,
        email,
        password,
        phone,
        age,
        gender,
        created_time: moment().format(DATE_DB_FORMAT),
        modified_time: moment().format(DATE_DB_FORMAT),
      };
      await update(ref(database, `Users/${uid}`), newUser);
    },
    []
  );

  const createAuthUser = useCallback(
    async (email: string, password: string) => {
      const res = await createUserWithEmailAndPassword(
        secondaryAuth,
        email,
        password
      );
      await signOut(secondaryAuth);
      return res;
    },
    []
  );

  const deleteAuthUser = useCallback(
    async (uid: string) => {
      const user = userList.find((user) => user.uid === uid);
      if (user) {
        await signInWithEmailAndPassword(
          secondaryAuth,
          user.email,
          user.password
        );
        if (secondaryAuth.currentUser) {
          await deleteUser(secondaryAuth.currentUser);
        }
      }
    },
    [userList]
  );
  const deleteUserFromDb = useCallback(async (uid: string) => {
    await remove(ref(database, `Users/${uid}`));
  }, []);

  const updateUser = useCallback(
    async (
      uid: string,
      username: string,
      gender: string,
      age: number,
      phone: string
    ) => {
      await update(ref(database, `Users/${uid}`), {
        username,
        gender,
        age,
        phone,
        modified_time: moment().format(DATE_DB_FORMAT),
      });
    },
    []
  );
  return {
    userList,
    createUser,
    createAuthUser,
    deleteUserFromDb,
    deleteAuthUser,
    updateUser,
    isLoading,
  };
};

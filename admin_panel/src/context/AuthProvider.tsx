import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  User,
  UserCredential,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";

export const AuthContext = React.createContext<AuthContext | null>(null);

type AuthContext = {
  user: User | null;
  loading: boolean;
  UserLogin: (email: string, password: string) => Promise<UserCredential>;
  logOut: () => Promise<void>;
};
export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const UserLogin = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      return signInWithEmailAndPassword(auth, email, password);
    },
    [setLoading]
  );

  const logOut = useCallback(async () => {
    setLoading(true);
    return signOut(auth);
  }, [setLoading]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, [setUser]);

  const result = {
    user,
    loading,
    UserLogin,
    logOut,
  };
  return <AuthContext.Provider value={result}>{children}</AuthContext.Provider>;
};

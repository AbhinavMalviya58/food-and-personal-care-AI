"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { db, firebaseAuth } from "@/firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { createSession, getSession, removeSession } from "@/actions/auth-actions";
import { HOME_ROUTE } from "@/lib/constants/constants";
import { redirect, useRouter } from "next/navigation";
import { signInWithGoogle } from "@/firebase/auth";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signUp: (
    userData: {
      name: string,
      email: string,
      password: string,
    }
  ) => Promise<void>;
  signIn: (
    userData: {
      email: string,
      password: string,
    }
  ) => Promise<void>;
  signInUserWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  getUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({
  children,
}: {
  children: ReactNode,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (userFb) => {
      if (userFb) {
        await createSession(userFb.uid);
        await getUser();
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signUp = async (
    userData: {
      name: string,
      email: string,
      password: string,
    }
  ) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        firebaseAuth,
        userData.email,
        userData.password,
      );
      await setDoc(doc(db, "users", userCredential.user.uid), {
        name: userData.name,
        email: userData.email,
      });
      await createSession(userCredential.user.uid);
      router.push("/dashboard");
    } catch (error) {
      console.error("Sign-up failed", error);
    } finally {
      setLoading(false);
    }
  }

  const signIn = async (
    userData: {
      email: string,
      password: string,
    }
  ) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        firebaseAuth,
        userData.email,
        userData.password,
      );
      await createSession(userCredential.user.uid);
      router.push("/dashboard");
    } catch (error) {
      console.error("Sign-in failed", error);
    } finally {
      setLoading(false);
    }
  };

  const signInUserWithGoogle = async () => {
    const userId = await signInWithGoogle();
    if (userId) {
      await createSession(userId);
      redirect(HOME_ROUTE[0]);
    }
  }

  const signOutUser = async () => {
    setLoading(true);
    try {
      await signOut(firebaseAuth);
      await removeSession();
      setUser(null);
      router.push("/signin");
    } catch (error) {
      console.error("Sign-out failed", error);
    } finally {
      setLoading(false);
    }
  };

  const getUser = async () => {
    const userId = await getSession();
    if (!userId) return;

    try {
      const userDoc = await getDoc(doc(db, "users", userId.value));
      if (userDoc.exists()) {
        setUser(userDoc.data() as User);
      }
    } catch (error) {
      console.error("Error fetching user details", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signInUserWithGoogle,
        signOut: signOutUser,
        signUp,
        getUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthContextProvider");
  }
  return context;
};

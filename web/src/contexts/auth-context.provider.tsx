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
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import { db, firebaseAuth } from "@/firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { createSession, getSession, removeSession } from "@/actions/auth-actions";
import {
  AUTH_ROUTES,
  HOME_ROUTE,
} from "@/lib/constants/constants";
import { redirect, useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

type AuthContextType = {
  getUser: () => Promise<void>;
  loading: boolean;
  signInUserWithGoogle: () => Promise<void>;
  signIn: (
    userData: {
      email: string,
      password: string,
    }
  ) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (
    userData: {
      name: string,
      email: string,
      password: string,
    }
  ) => Promise<void>;
  user: User | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({
  children,
}: {
  children: ReactNode,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [fetchUserPending, setFetchUserPending] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setFetchUserPending(true);
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (userFb) => {
      if (userFb) {
        await getUser();
      }
      setFetchUserPending(false);
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
      router.push(HOME_ROUTE);
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error?.message,
        variant: "destructive"
      })
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
      router.push(HOME_ROUTE);
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error?.message,
        variant: "destructive"
      })
      console.error("Sign-in failed", error);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(firebaseAuth, provider);

      return result.user;
    } catch (error: any) {
      toast({
        title: "Google sign in failed",
        description: error?.message,
        variant: "destructive"
      })
      console.error("Google sign-in failed", error);
      throw error;
    }
  };

  const signInUserWithGoogle = async () => {
    const userCredential = await signInWithGoogle();

    if (userCredential) {
      const userId = userCredential.uid;
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        const { displayName, email } = userCredential;
        await setDoc(userRef, {
          name: displayName || "",
          email: email,
        });
      }

      await createSession(userId);
      redirect(HOME_ROUTE);
    }
  }

  const signOutUser = async () => {
    setLoading(true);
    try {
      await signOut(firebaseAuth);
      await removeSession();
      setUser(null);
      router.push(AUTH_ROUTES[0]);
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error?.message,
        variant: "destructive"
      })
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
    } catch (error: any) {
      toast({
        title: "Fetching user details failed",
        description: error?.message,
        variant: "destructive"
      })
      console.error("Error fetching user details", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        getUser,
        loading,
        signIn,
        signInUserWithGoogle,
        signOut: signOutUser,
        signUp,
        user,
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

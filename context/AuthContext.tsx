"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "@/firebase";
import {
  CourseDatabaseInterface,
  TaskDatabaseInterface,
  UserDatabaseInterface,
} from "@/types";
import { Spinner } from "@heroui/react";
import { Logo } from "@/components/icons";

interface AuthContextType {
  user: User | null;
  users: UserDatabaseInterface[];
  courses: CourseDatabaseInterface[];
  tasks: TaskDatabaseInterface[];
  loading: boolean;
  refreshData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<UserDatabaseInterface[]>([]);
  const [tasks, setTasks] = useState<TaskDatabaseInterface[]>([]);

  const [courses, setCourses] = useState<CourseDatabaseInterface[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        refreshData();
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const refreshData = async () => {
    setLoading(true);
    try {
      const usersSnapshot = await getDocs(collection(db, "users"));
      const usersDataList = usersSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
        } as UserDatabaseInterface;
      });

      const coursesSnapshot = await getDocs(collection(db, "courses"));
      const coursesDataList = coursesSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
        } as CourseDatabaseInterface;
      });

      const tasksSnapshot = await getDocs(collection(db, "tasks"));
      const tasksDataList = tasksSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
        } as TaskDatabaseInterface;
      });

      setCourses(coursesDataList);
      setTasks(tasksDataList);
      setUsers(usersDataList);
    } catch (error) {
      console.error("Fehler beim Abrufen der Benutzerdaten:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, users, courses, tasks, loading, refreshData }}
    >
      {loading ? (
        <section className="flex flex-col w-full gap-10 justify-center items-center h-screen">
          <Logo className="h-8" />
          <Spinner />
        </section>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuth muss innerhalb eines AuthProviders verwendet werden"
    );
  }
  return context;
};

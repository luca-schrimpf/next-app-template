import { Timestamp } from "firebase/firestore";
import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface UserDatabaseInterface {
  id: string;
  name: string;
  email: string;
  photoURL: string;
  role: "member" | "manager" | "admin";
  createdAt: Timestamp;
  updatedAt: Timestamp;
  status: "active" | "disabled";
  solvedCourses: string[];
  solvedTasks: string[];
}

export interface CourseDatabaseInterface {
  id?: string;
  createdBy: string;
  thumbnail: string;
  title: string;
  description: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  status: "draft" | "published";
  frameworkID: string;
  difficulty: number;
}

export interface TaskDatabaseInterface {
  id: string;
  courseId: string;
  order: number;
  title: string;
  description: string;
  hint: string;
  question: string;
  questionCode?: string;
  answers: string[];
  wrongAnswers?: string[];
  answerType: "text" | "code" | "multiple-choice" | "single-choice";
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface FrameworkInterface {
  id: string;
  name: string;
  description: string;
  logo: React.FC<IconSvgProps>;
}

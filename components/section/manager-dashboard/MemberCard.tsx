"use client";
import { useAuth } from "@/context/AuthContext";
import { FrameworksList } from "@/data/frameworks";
import { FrameworkInterface, UserDatabaseInterface } from "@/types";
import { CheckIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import {
  Avatar,
  Card,
  CardHeader,
  Chip,
  Divider,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
} from "@heroui/react";
import React from "react";

interface MemberCardProps {
  user: UserDatabaseInterface;
}

const MemberCard: React.FC<MemberCardProps> = ({ user }) => {
  const { courses } = useAuth();
  // Get courses completed by the user
  const completedCourses = courses.filter((course) =>
    user.solvedCourses.includes(course.id as string)
  );

  // Get unique frameworks from completed courses
  const frameworks = completedCourses
    .map((course) => FrameworksList.find((fw) => fw.id === course.frameworkID))
    .filter(
      (framework): framework is FrameworkInterface => framework !== undefined
    );

  const uniqueFrameworks = Array.from(new Set(frameworks.map((fw) => fw.id)))
    .map((id) => frameworks.find((fw) => fw.id === id))
    .filter((fw): fw is FrameworkInterface => fw !== undefined);

  const getDifficultyLabel = (difficulty: number) => {
    switch (difficulty) {
      case 1:
        return { label: "Beginner", color: "bg-green-500" };
      case 2:
        return { label: "Intermediate", color: "bg-yellow-500" };
      case 3:
        return { label: "Advanced", color: "bg-orange-500" };
      case 4:
        return { label: "Expert", color: "bg-red-500" };
      case 5:
        return { label: "Master", color: "bg-purple-500" };
      default:
        return { label: "Unknown", color: "bg-gray-500" };
    }
  };

  return (
    <Card className="overflow-hidden border-2 border-white/20 hover:shadow-md transition-shadow duration-300">
      <CardHeader className="p-4 flex flex-row items-center space-y-0 gap-4 bg-gradient-to-r from-white shadow-md  to-white">
        <Avatar
          radius="lg"
          isBordered
          color="primary"
          className="h-12 w-12   shadow-sm"
          src={user.photoURL}
        />

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-lg text-background">{user.name}</h3>
            <Chip
              variant={user.status === "active" ? "bordered" : "flat"}
              className={
                user.status === "active"
                  ? "bg-green-100 text-green-800 hover:bg-green-100 border-green-500/50"
                  : undefined
              }
            >
              {user.status === "active" ? "Verfügbar" : "Nicht Verfügbar"}
            </Chip>
          </div>
          <p className="text-sm text-background/75">{user.email}</p>
        </div>
      </CardHeader>
      <div className=" bg-foreground p-4">
        <div className="flex items-center justify-between ">
          <h4 className="text-sm font-medium text-muted">
            Abgeschlossene Kurse
          </h4>
          <Chip
            variant="bordered"
            className="bg-blue-50 text-blue-700  border-blue-700/20"
          >
            {completedCourses.length}{" "}
            {completedCourses.length > 1 ? "Kurse" : "Kurs"}
          </Chip>
        </div>
        <div className="flex flex-wrap gap-2 ">
          {uniqueFrameworks.map((framework) => (
            <Tooltip content={framework.name}>
              <div className="w-6 h-6 rounded-md flex items-center justify-center cursor-help">
                <framework.logo className="h-4 w-4 " />
              </div>
            </Tooltip>
          ))}
        </div>
      </div>

      <div className="space-y-2 px-3 pb-4 bg-foreground ">
        {completedCourses.map((course) => (
          <div
            key={course.id}
            className="text-sm p-2 rounded-md flex items-center justify-between gap-2"
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <CheckIcon className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span className="truncate text-background">{course.title}</span>
            </div>

            <div className="flex items-center gap-2">
              {FrameworksList.find((fw) => fw.id === course.frameworkID)
                ?.logo && (
                <div className="h-5 w-5 flex items-center justify-center">
                  {React.createElement(
                    FrameworksList.find((fw) => fw.id === course.frameworkID)
                      ?.logo || (() => null),
                    { className: "h-4 w-4 text-background" }
                  )}
                </div>
              )}

              <Popover placement="bottom" showArrow={true}>
                <PopoverTrigger>
                  <div
                    className={`w-3 h-3 rounded-full ${getDifficultyLabel(course.difficulty).color} cursor-pointer`}
                  />
                </PopoverTrigger>
                <PopoverContent>
                  <div className="text-xs">
                    Schwierigkeit: {getDifficultyLabel(course.difficulty).label}
                  </div>
                </PopoverContent>
              </Popover>

              <Popover placement="bottom" showArrow={true}>
                <PopoverTrigger asChild>
                  <InformationCircleIcon className="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                </PopoverTrigger>
                <PopoverContent className="w-72 p-3">
                  <div className="space-y-2">
                    <h4 className="font-medium">{course.title}</h4>
                    <p className="text-xs text-gray-500">
                      {course.description}
                    </p>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Abgeschlossen</span>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        ))}

        {completedCourses.length === 0 && (
          <p className="text-sm text-gray-500 italic">
            Noch keine Kurse abgeschlossen
          </p>
        )}
      </div>
    </Card>
  );
};

export default MemberCard;

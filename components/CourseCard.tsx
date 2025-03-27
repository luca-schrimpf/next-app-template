import {
  Button,
  Card,
  CardFooter,
  CardHeader,
  Chip,
  Image,
} from "@heroui/react";
import React from "react";

import {
  ArrowRightCircleIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";
import { CourseDatabaseInterface } from "@/types";
import { FrameworksList } from "@/data/frameworks";
import { frame } from "framer-motion";
import Link from "next/link";

const CourseCard = ({
  course,
  inAdminMode,
  alreadyStarted,
  solved,
}: {
  course: CourseDatabaseInterface;
  inAdminMode?: boolean;
  alreadyStarted?: boolean;
  solved?: boolean;
}) => {
  const framework = FrameworksList.find(
    (framework) => framework.id === course.frameworkID
  );

  return (
    <Card
      isFooterBlurred
      className="w-full h-[250px] group relative  transition-all duration-200 ease-in  "
    >
      <CardHeader className="absolute z-10 top-1 flex-col items-start ">
        <p className="text-tiny line-clamp-1 text-white/60 uppercase font-bold">
          {course.description}
        </p>
        <h4 className="text-white/90 font-bold text-xl ">{course.title}</h4>
      </CardHeader>
      <Image
        removeWrapper
        alt={course.title}
        className="z-0 w-full h-full object-cover group-hover:scale-105"
        src={course.thumbnail}
      />

      <div className=" absolute w-full h-full bg-black/60">
        {framework?.logo && (
          <Chip
            startContent={<framework.logo />}
            className="bg-card shadow-lg px-3 text-text font-semibold bottom-16 left-2 absolute"
          >
            {framework.name} -{" "}
            <span className="font-bold">Level {course.difficulty}</span>
          </Chip>
        )}
      </div>

      <CardFooter className="absolute bg-black/40 bottom-0 z-10">
        <div className="flex flex-grow gap-2 items-center">
          {/* <Image
            alt="Breathing app icon"
            className="rounded-full w-10 h-11 bg-black"
            src="https://heroui.com/images/breathing-app-icon.jpeg"
          /> */}
          {framework?.logo ? <framework.logo className="w-8 h-8" /> : <p>/</p>}
          <div className="flex flex-col">
            <p className="text-tiny text-white/80 font-bold">
              {framework?.name}
            </p>
            <p className="text-tiny text-white/60 truncate max-w-40">
              {framework?.description}
            </p>
          </div>
        </div>

        {solved ? (
          <Button
            radius="full"
            color="primary"
            className="font-bold text-background "
            size="sm"
            endContent={<CheckBadgeIcon className="text-background w-4 h-4" />}
          >
            Absolviert
          </Button>
        ) : (
          <>
            {inAdminMode ? (
              <Link href={`/admin-dashboard/course/edit/${course.id}`}>
                <Button
                  radius="full"
                  color="primary"
                  className="font-bold text-background "
                  size="sm"
                  endContent={
                    <ArrowRightCircleIcon className="text-background w-4 h-4" />
                  }
                >
                  Bearbeiten
                </Button>
              </Link>
            ) : (
              <Link href={`/courses/${course.id}`}>
                <Button
                  radius="full"
                  color="primary"
                  className="font-bold text-background "
                  size="sm"
                  endContent={
                    <ArrowRightCircleIcon className="text-background w-4 h-4" />
                  }
                >
                  {alreadyStarted ? "Fortsetzen" : "Starten"}
                </Button>
              </Link>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default CourseCard;

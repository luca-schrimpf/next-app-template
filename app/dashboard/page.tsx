"use client";
import { CrownIcon } from "@/components/icons";
import MyBadgesList from "@/components/MyBadgesList";
import CoursesListSection from "@/components/section/CoursesListSection";
import TrackingSolvedCourse from "@/components/section/TrackingSolvedCourse";
import { useAuth } from "@/context/AuthContext";
import { FrameworksList } from "@/data/frameworks";
import { Avatar, Chip, Tooltip } from "@heroui/react";
import React from "react";

const page = () => {
  const { user, users, courses } = useAuth();

  const currentUser = users.find((u) => u.id === user?.uid);

  if (!currentUser) {
    return (
      <div>
        <p className="text-center">Leider ist etwas schief gelaufen</p>
      </div>
    );
  }

  return (
    <>
      <section className=" bg-[#1B1A17] p-8 rounded-lg flex flex-col md:flex-row text-center md:text-left items-center md:items-start gap-4">
        <div className="relative">
          <Avatar
            size="lg"
            radius="lg"
            isBordered
            color="primary"
            src={currentUser.photoURL}
          />
        </div>

        <div>
          <h1 className={`md:text-4xl text-2xl font-bold`}>
            Willkommen zurück,{" "}
            <span className="text-primary">{currentUser.name}</span>!
          </h1>
          <p className="text-muted md:text-lg text-base">
            Lass uns weiter an deinen Programmierfertigkeiten arbeiten
          </p>

          <div className="mt-4">
            <p className="font-semibold">Deine gesammelten Badges</p>
            <div>
              <MyBadgesList
                courses={courses}
                solvedCourses={currentUser.solvedCourses}
              />
            </div>
          </div>
        </div>
      </section>

      <TrackingSolvedCourse />

      <CoursesListSection type="solved" title="Absolvierte Kurse" inCardStyle />
    </>
  );
};

export default page;

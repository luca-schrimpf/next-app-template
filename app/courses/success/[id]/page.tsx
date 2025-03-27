"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useWindowSize } from "react-use";
import Confetti from "react-confetti";
import { useAuth } from "@/context/AuthContext";
import { Button, ButtonGroup, Chip, Image } from "@heroui/react";
import { FrameworksList } from "@/data/frameworks";

const page = () => {
  const { courses, user, users } = useAuth();
  const { width, height } = useWindowSize();
  const params = useParams();
  const navigate = useRouter();

  if (!params?.id || typeof params.id !== "string") {
    navigate.push("/courses");
    return;
  }

  const course = courses.find((course) => course.id === params.id);
  const currentUser = users.find((u) => u.id === user?.uid);

  const isCourseCompleted = currentUser?.solvedCourses?.includes(params.id);

  if (!course || !isCourseCompleted) {
    navigate.push("/courses");
    return;
  }

  const framework = FrameworksList.find((f) => f.id === course.frameworkID);

  return (
    <>
      <Confetti recycle={false} width={width} height={height} />

      <section className="flex flex-col items-center justify-center h-[60vh] gap-10">
        <Image
          removeWrapper
          alt="Relaxing app background"
          className="z-0 max-w-sm w-full  object-cover "
          src={course.thumbnail}
          width={500}
          height={250}
          isBlurred
        />

        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Herzlichen Glückwunsch!</h1>
          <p className="text-muted">
            Du hast den Kurs{" "}
            <strong className="underline">{course.title}</strong> erfolgreich
            abgeschlossen.
          </p>
        </div>

        <div className="flex items-center flex-col justify-center gap-2 bg-card p-4 rounded-lg shadow-lg">
          <p className="text-lg font-semibold">Neues Badge erhalten!</p>
          {framework && (
            <Chip
              startContent={<framework.logo />}
              className="bg-background shadow-lg px-3 text-muted font-semibold"
            >
              {framework.name} -{" "}
              <span className="font-bold">Level {course.difficulty}</span>
            </Chip>
          )}
        </div>

        <ButtonGroup>
          <Button
            className="bg-muted text-foreground"
            onPress={() => navigate.push("/dashboard")}
          >
            Zum Dashboard
          </Button>
          <Button
            color="primary"
            onPress={() => navigate.push("/courses")}
            className="text-background font-semibold"
          >
            Weiter Kurse ansehen
          </Button>
        </ButtonGroup>
      </section>
    </>
  );
};

export default page;

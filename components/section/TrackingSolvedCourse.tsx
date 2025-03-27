"use client";
import { useAuth } from "@/context/AuthContext";
import { FrameworksList } from "@/data/frameworks";
import { FrameworkInterface } from "@/types";
import { Progress } from "@heroui/react";
import React, { useEffect, useState } from "react";

interface StatsDataInterface {
  framework: FrameworkInterface;
  solvedCourses: number;
  totalCourses: number;
  progressValue?: number;
}

const TrackingSolvedCourse = () => {
  const { courses, user, users } = useAuth();

  const [statsData, setStatsData] = useState<StatsDataInterface[]>();

  useEffect(() => {
    const getStatsData = () => {
      const statsData: StatsDataInterface[] = [];
      const currentUser = users.find((u) => u.id === user?.uid);

      if (!currentUser) {
        return;
      }

      FrameworksList.forEach((framework) => {
        const totalCourses = courses.filter(
          (course) => course.frameworkID === framework.id
        ).length;

        if (totalCourses === 0) {
          return;
        }

        const solvedCourses = courses.filter(
          (course) =>
            course.frameworkID === framework.id &&
            currentUser.solvedCourses.includes(course.id as string)
        ).length;

        const progressValue = (solvedCourses / totalCourses) * 100;

        statsData.push({
          framework,
          solvedCourses,
          totalCourses,
          progressValue,
        });
      });

      setStatsData(statsData);
    };

    getStatsData();
  }, []);

  return (
    <section className="my-12 bg-card p-8 rounded-lg">
      <h2 className="text-3xl font-semibold">Lernfortschritt</h2>
      <p className="mb-4 text-muted">
        Hier siehst du eine Übersicht über deinem Lernfortschritt und was noch
        offen ist
      </p>

      <div className="flex flex-col gap-5">
        {statsData?.map((data) => {
          return (
            <div key={data.framework.id} className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <data.framework.logo className="w-7 h-7" />
                <p className="text-lg font-semibold">{data.framework.name}</p>
              </div>
              <Progress
                classNames={{
                  track: "bg-muted/40",
                }}
                label={`${data.solvedCourses}/${data.totalCourses} ${data.framework.name} Kurse absolviert`}
                value={data.progressValue}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TrackingSolvedCourse;

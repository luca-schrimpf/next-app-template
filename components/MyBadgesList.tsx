import { FrameworksList } from "@/data/frameworks";
import { CourseDatabaseInterface, IconSvgProps } from "@/types";
import { Chip } from "@heroui/react";
import React, { useEffect, useState } from "react";

interface BadgeInterface {
  frameworkLogo: React.FC<IconSvgProps>;
  frameworkName: string;
  courseDifficulty: number;
}

const MyBadgesList = ({
  solvedCourses,
  courses,
}: {
  solvedCourses: string[];
  courses: CourseDatabaseInterface[];
}) => {
  const [badges, setBadges] = useState<BadgeInterface[]>([]);

  useEffect(() => {
    const getBadgesInformations = () => {
      const badges: BadgeInterface[] = [];

      solvedCourses.forEach((courseId) => {
        const course = courses.find((c) => c.id === courseId);

        if (!course) return;

        const framework = FrameworksList.find(
          (f) => f.id === course.frameworkID
        );

        if (!framework) return;

        const badge = {
          frameworkLogo: framework.logo,
          frameworkName: framework.name,
          courseDifficulty: course.difficulty,
        };

        badges.push(badge);
      });

      setBadges(badges);
    };

    getBadgesInformations();
  }, []);

  return (
    <div className="flex items-center flex-row mt-2">
      {badges.map((value, index) => {
        return (
          <Chip
            key={index}
            startContent={<value.frameworkLogo />}
            className="bg-white shadow-lg px-3 text-background font-semibold "
          >
            {value.frameworkName} -{" "}
            <span className="font-bold">Level {value.courseDifficulty}</span>
          </Chip>
        );
      })}
    </div>
  );
};

export default MyBadgesList;

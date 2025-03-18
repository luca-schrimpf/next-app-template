import React from "react";
import CourseCard from "../CourseCard";
import { SAMPLE_COURSES } from "@/data/courses";
import { useAuth } from "@/context/AuthContext";

const CoursesListSection = ({
  type,
  inCardStyle,
  title,
  inAdminMode,
}: {
  type: "solved" | "all";
  inCardStyle?: boolean;
  inAdminMode?: boolean;
  title?: string;
}) => {
  const { courses, users, user } = useAuth();

  const currentUser = users.find((u) => u.id === user?.uid);

  const allCourses = courses;

  const solvedCoursesIds = currentUser?.solvedCourses;

  const solvedCourses = allCourses.filter((course) =>
    solvedCoursesIds?.includes(course.id || "")
  );

  return (
    <section
      className={` ${inCardStyle && " my-12 bg-[#1B1A17] p-8 rounded-lg"}`}
    >
      <h2 className="text-3xl font-semibold">{title}</h2>
      <p className="mb-4 text-muted">
        Hier sind einige Kurse, die du fortsetzen kannst:
      </p>
      <div className="grid grid-cols-1  md:grid-cols-3 gap-6">
        {type === "all" &&
          allCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              inAdminMode={inAdminMode}
            />
          ))}

        {type === "solved" &&
          solvedCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              inAdminMode={inAdminMode}
              solved
            />
          ))}
      </div>
    </section>
  );
};

export default CoursesListSection;

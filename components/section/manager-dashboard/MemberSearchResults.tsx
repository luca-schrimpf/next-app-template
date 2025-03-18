import React from "react";
import { SearchParams } from "./MemberSearchForm";
import { UserDatabaseInterface } from "@/types";
import { useAuth } from "@/context/AuthContext";
import MemberCard from "./MemberCard";

interface MemberSearchResultsProps {
  searchParams: SearchParams;
}

const MemberSearchResults: React.FC<MemberSearchResultsProps> = ({
  searchParams,
}) => {
  const { searchTerm, frameworkIds, difficultyLevels, statusFilter } =
    searchParams;

  const { courses, users } = useAuth();

  // Filter users based on search parameters
  const filteredUsers = users.filter((user) => {
    // Filter by status
    if (statusFilter.length > 0 && !statusFilter.includes(user.status)) {
      return false;
    }

    // Filter by search term (user name or completed course titles)
    if (searchTerm) {
      const userCompletedCourses = courses.filter((course) =>
        user.solvedCourses.includes(course.id as string)
      );

      const matchesName = user.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCourseTitle = userCompletedCourses.some((course) =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (!matchesName && !matchesCourseTitle) {
        return false;
      }
    }

    // Filter by framework
    if (frameworkIds.length > 0) {
      const userCompletedCourses = courses.filter((course) =>
        user.solvedCourses.includes(course.id as string)
      );

      const hasMatchingFramework = userCompletedCourses.some((course) =>
        frameworkIds.includes(course.frameworkID)
      );

      if (!hasMatchingFramework) {
        return false;
      }
    }

    // Filter by difficulty level
    if (difficultyLevels.length > 0) {
      const userCompletedCourses = courses.filter((course) =>
        user.solvedCourses.includes(course.id as string)
      );

      const hasMatchingDifficulty = userCompletedCourses.some((course) =>
        difficultyLevels.includes(course.difficulty)
      );

      if (!hasMatchingDifficulty) {
        return false;
      }
    }

    return true;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold ">Suchergebniss</h2>
        <span className="text-sm text-muted">
          {filteredUsers.length} Member gefunden.
        </span>
      </div>

      {filteredUsers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <MemberCard key={user.id} user={user} />
          ))}
        </div>
      ) : (
        <div className=" rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium text-muted mb-2">
            Keine Member gefunden
          </h3>
          <p className="text-muted">
            Versuchen Sie, Ihre Such- oder Filterkriterien anzupassen.
          </p>
        </div>
      )}
    </div>
  );
};

export default MemberSearchResults;

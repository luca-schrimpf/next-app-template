"use client";
import StatsCard from "@/components/StatsCard";
import React from "react";
import { UserGroupIcon } from "@heroicons/react/24/solid";
import { useAuth } from "@/context/AuthContext";
import { Divider } from "@heroui/react";

const StatsSectionAdmin = () => {
  const { users, courses } = useAuth();

  const UserStatsObject = {
    title: "Benutzer",
    icon: UserGroupIcon,
    value: users.length.toString(),
    description: "Anzahl der registrierten Benutzer auf der Plattform",
    href: "/admin-dashboard/users",
    color: "green" as "green",
  };

  const CourseStatsObject = {
    title: "Kurse",
    icon: UserGroupIcon,
    value: courses.length.toString(),
    description: "Anzahl der verfügbaren Kurse auf der Plattform",
    color: "orange" as "orange",
  };

  return (
    <section>
      <Divider className="mb-4" />
      <h1 className={`md:text-4xl text-2xl font-bold`}>Stats</h1>
      <p className="text-muted md:text-lg text-base mb-8">
        Alles wichtigen Daten auf einen Blick
      </p>

      <div className="grid grid-cols-3 gap-6">
        <StatsCard content={UserStatsObject} />
        <StatsCard content={CourseStatsObject} />
      </div>
    </section>
  );
};

export default StatsSectionAdmin;

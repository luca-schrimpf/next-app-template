"use client";
import CoursesListSection from "@/components/section/CoursesListSection";
import React from "react";

const page = () => {
  return (
    <div>
      <CoursesListSection
        type="all"
        title="Alle verfügbaren Kurse auf einen Blick"
        inCardStyle
      />
    </div>
  );
};

export default page;

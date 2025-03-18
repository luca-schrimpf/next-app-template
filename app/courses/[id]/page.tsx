"use client";

import { useParams } from "next/navigation";
import CompleteCourseSection from "@/components/section/courses/complete-course/CompleteCourseSection";
import React from "react";

const Page: React.FC = () => {
  const params = useParams();

  if (!params?.id || typeof params.id !== "string") {
    return <div>Kurs-ID nicht gefunden.</div>;
  }

  return (
    <div>
      <CompleteCourseSection courseID={params.id} />
    </div>
  );
};

export default Page;

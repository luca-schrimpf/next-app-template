import { Button, Divider } from "@heroui/react";
import React, { useState } from "react";
import CreateCourseWithAI from "./CreateCourseWithAI";
import CoursesListSection from "../CoursesListSection";

const CoursesSectionAdmin = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async () => {
    const res = await fetch("/api/openai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    setResponse(data.response);
  };

  return (
    <section className="flex flex-col gap-10">
      <div>
        <h1 className={`md:text-4xl text-2xl font-bold`}>Kurse</h1>
        <p className="text-muted md:text-lg text-base mb-3 ">
          Erstellen und verwalten Sie Ihre Kurse
        </p>

        <CreateCourseWithAI />
      </div>

      <CoursesListSection
        type="all"
        title="Alle Kurse im Überblick"
        inAdminMode
      />
    </section>
  );
};

export default CoursesSectionAdmin;

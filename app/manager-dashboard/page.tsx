"use client";
import FindMemberSearchSection from "@/components/section/manager-dashboard/FindMemberSearchSection";
import { useAuth } from "@/context/AuthContext";
import { FaceFrownIcon } from "@heroicons/react/24/solid";
import { Button } from "@heroui/button";
import { Tab, Tabs } from "@heroui/react";
import Link from "next/link";
import React from "react";

const page = () => {
  const { user, users } = useAuth();

  if (!user) return <div></div>;
  const currentUser = users.find((u) => u.id === user?.uid);

  if (currentUser?.role !== "manager" && currentUser?.role !== "admin") {
    return (
      <div className="flex items-center justify-center h-[70vh] flex-col gap-4">
        <FaceFrownIcon className="w-20 h-20 text-primary mx-auto" />
        <p className="text-center">
          Du hast keine Berechtigung für diese Seite
        </p>
        <Link href={"/dashboard"}>
          <Button>Zurück zum Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 bg-card p-8 rounded-lg ">
      <div>
        <h1 className={`md:text-4xl text-2xl font-bold`}>Manager Dashboard</h1>
        <p className="text-lg text-muted">
          Entwickler finden für dein nächstes Projekt?
        </p>
      </div>

      <Tabs fullWidth aria-label="Menu">
        <Tab key="stats" title="Entwickler finden">
          <FindMemberSearchSection />
        </Tab>
        <Tab isDisabled key="courses" title="Mitarbetier verwalten">
          {/* <CoursesSectionAdmin /> */}
        </Tab>
      </Tabs>
    </div>
  );
};

export default page;

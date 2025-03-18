import UsersTable from "@/components/section/admin-dashboard/UsersTable";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="space-y-4">
      <Link href={"/admin-dashboard"}>
        <Button startContent={<ArrowLeftCircleIcon className="w-5 h-5" />}>
          Zurück zum Admin Dashboard
        </Button>
      </Link>

      <UsersTable />
    </div>
  );
};

export default page;

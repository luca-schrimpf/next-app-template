"use client";
import React, { useState } from "react";
import MemberSearchForm, { SearchParams } from "./MemberSearchForm";
import MemberSearchResults from "./MemberSearchResults";

const FindMemberSearchSection = () => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    searchTerm: "",
    frameworkIds: [],
    difficultyLevels: [],
    statusFilter: ["active"],
  });

  const handleSearch = (params: SearchParams) => {
    setSearchParams(params);
  };

  return (
    <section>
      <MemberSearchForm onSearch={handleSearch} />
      <MemberSearchResults searchParams={searchParams} />
    </section>
  );
};

export default FindMemberSearchSection;

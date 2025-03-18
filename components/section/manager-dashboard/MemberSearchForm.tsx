import { FrameworksList } from "@/data/frameworks";
import {
  FunnelIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Checkbox, Chip, Divider } from "@heroui/react";
import React, { useState } from "react";

interface MemberSearchFormProps {
  onSearch: (searchParams: SearchParams) => void;
}

export interface SearchParams {
  searchTerm: string;
  frameworkIds: string[];
  difficultyLevels: number[];
  statusFilter: string[];
}

const MemberSearchForm: React.FC<MemberSearchFormProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [frameworkIds, setFrameworkIds] = useState<string[]>([]);
  const [difficultyLevels, setDifficultyLevels] = useState<number[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>(["active"]);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = () => {
    onSearch({
      searchTerm,
      frameworkIds,
      difficultyLevels,
      statusFilter,
    });
  };

  const handleFrameworkToggle = (frameworkId: string) => {
    setFrameworkIds((prev) =>
      prev.includes(frameworkId)
        ? prev.filter((id) => id !== frameworkId)
        : [...prev, frameworkId]
    );
  };

  const handleDifficultyToggle = (level: number) => {
    setDifficultyLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  const handleStatusToggle = (status: string) => {
    setStatusFilter((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const clearFilters = () => {
    setFrameworkIds([]);
    setDifficultyLevels([]);
    setStatusFilter(["active"]);
  };

  return (
    <div className="bg-default/50 rounded-lg shadow-md p-6 mb-8">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Suche nach Membernamen oder Kurstitel..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>

          <Button
            variant="bordered"
            onPress={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <FunnelIcon className="h-4 w-4" />
            Filters
            {(frameworkIds.length > 0 ||
              difficultyLevels.length > 0 ||
              statusFilter.length !== 1) && (
              <Chip className="ml-2 px-2 py-0">
                {frameworkIds.length +
                  difficultyLevels.length +
                  (statusFilter.length !== 1 ? 1 : 0)}
              </Chip>
            )}
          </Button>

          <Button
            onPress={handleSearch}
            color="primary"
            className="text-background font-semibold "
          >
            Suchen
          </Button>
        </div>

        {showFilters && (
          <div className="bg-[#1B1A17] rounded-lg p-4 mt-4 ">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium ">Erweiterte Filter</h3>
              <Button
                variant="ghost"
                size="sm"
                onPress={clearFilters}
                className="h-8"
              >
                Filter zurücksetzen
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Framework Filter */}
              <div>
                <h2 className="text-sm font-medium  block">Frameworks</h2>
                <div className="space-y-2 mt-2">
                  {FrameworksList.map((framework) => (
                    <div key={framework.id} className="flex items-center">
                      <Checkbox
                        id={`framework-${framework.id}`}
                        isSelected={frameworkIds.includes(framework.id)}
                        onValueChange={() =>
                          handleFrameworkToggle(framework.id)
                        }
                      />
                      <label
                        htmlFor={`framework-${framework.id}`}
                        className="ml-2 text-sm font-medium flex items-center"
                      >
                        <framework.logo className="h-4 w-4 mr-2 text-gray-600" />
                        {framework.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Difficulty Level Filter */}
              <div>
                <h2 className="text-sm font-medium  block">Erfahrungslevel</h2>
                <div className="space-y-2 mt-2">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div key={level} className="flex items-center">
                      <Checkbox
                        id={`difficulty-${level}`}
                        isSelected={difficultyLevels.includes(level)}
                        onValueChange={() => handleDifficultyToggle(level)}
                      />
                      <label
                        htmlFor={`difficulty-${level}`}
                        className="ml-2 text-sm font-medium flex items-center"
                      >
                        {level === 1 && "Beginner"}
                        {level === 2 && "Intermediate"}
                        {level === 3 && "Advanced"}
                        {level === 4 && "Expert"}
                        {level === 5 && "Master"}
                        <div
                          className={`ml-2 w-4 h-4 rounded-full ${
                            level === 1
                              ? "bg-green-500"
                              : level === 2
                                ? "bg-yellow-500"
                                : level === 3
                                  ? "bg-orange-500"
                                  : level === 4
                                    ? "bg-red-500"
                                    : "bg-purple-500"
                          }`}
                        />
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <h2 className="text-sm font-medium mb-2 block">
                  Verfügbarkeit
                </h2>
                <div className="space-y-2 mt-2">
                  {["active", "disabled"].map((status) => (
                    <div key={status} className="flex items-center">
                      <Checkbox
                        isDisabled
                        id={`status-${status}`}
                        isSelected={statusFilter.includes(status)}
                        onValueChange={() => handleStatusToggle(status)}
                      />
                      <label
                        htmlFor={`status-${status}`}
                        className="ml-2 text-sm font-medium flex items-center"
                      >
                        {status === "active" ? "Verfügbar" : "Nicht Verfügbar"}
                        <Chip
                          color={status === "active" ? "success" : "danger"}
                          className={`ml-2 `}
                        >
                          {status}
                        </Chip>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(frameworkIds.length > 0 ||
              difficultyLevels.length > 0 ||
              statusFilter.length !== 1) && (
              <div className="mt-4 flex flex-wrap gap-2">
                {frameworkIds.map((id) => {
                  const framework = FrameworksList.find((f) => f.id === id);
                  return framework ? (
                    <Chip
                      key={id}
                      variant="bordered"
                      className="bg-content3 hover:bg-content3/85"
                    >
                      <div className="flex flex-row items-center gap-1">
                        <framework.logo className="w-4 h-4" />
                        {framework.name}
                        <XMarkIcon
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => handleFrameworkToggle(id)}
                        />
                      </div>
                    </Chip>
                  ) : null;
                })}

                {difficultyLevels.map((level) => (
                  <Chip
                    key={level}
                    variant="bordered"
                    className="bg-content3 hover:bg-content3/85"
                  >
                    <div className="flex flex-row items-center gap-1">
                      {level === 1
                        ? "Beginner"
                        : level === 2
                          ? "Intermediate"
                          : level === 3
                            ? "Advanced"
                            : level === 4
                              ? "Expert"
                              : "Master"}
                      <XMarkIcon
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => handleDifficultyToggle(level)}
                      />
                    </div>
                  </Chip>
                ))}

                {statusFilter.length !== 1 &&
                  statusFilter.map((status) => (
                    <Chip
                      key={status}
                      variant="bordered"
                      className={`flex items-center gap-1 ${
                        status === "active"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      }`}
                    >
                      {status === "active" ? "Verfügbar" : "Nicht Verfügbar"}
                      <XMarkIcon
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => handleStatusToggle(status)}
                      />
                    </Chip>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberSearchForm;

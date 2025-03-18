"use client";
import { useAuth } from "@/context/AuthContext";
import { UserDatabaseInterface } from "@/types";
import {
  Bars3Icon,
  EyeIcon,
  EyeSlashIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import {
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  User,
} from "@heroui/react";
import React, { useCallback } from "react";

const UsersTable = () => {
  const { users } = useAuth();

  return (
    <Table aria-label="Users Table">
      <TableHeader>
        <TableColumn>NAME</TableColumn>
        <TableColumn>ROLLE</TableColumn>
        <TableColumn>STATUS</TableColumn>
        <TableColumn>AKTIONEN</TableColumn>
      </TableHeader>
      <TableBody>
        {users.map((user: UserDatabaseInterface) => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell>
              <Chip
                children={user.status === "active" ? "Aktiv" : "Deaktiviert"}
                color={user.status === "active" ? "success" : "danger"}
              />
            </TableCell>
            <TableCell className="space-x-2">
              {user.status === "disabled" ? (
                <Tooltip content="User aktivieren">
                  <Button isIconOnly>
                    <EyeIcon className="w-5 h-5" />
                  </Button>
                </Tooltip>
              ) : (
                <Tooltip content="User deaktivieren">
                  <Button isIconOnly>
                    <EyeSlashIcon className="w-5 h-5" />
                  </Button>
                </Tooltip>
              )}
              <Tooltip content="User löschen">
                <Button color="danger" isIconOnly>
                  <TrashIcon className="w-5 h-5" />
                </Button>
              </Tooltip>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UsersTable;

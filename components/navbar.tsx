"use client";
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Link as LinkHero } from "@heroui/link";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { CrownIcon, Logo, ManagerIcon } from "@/components/icons";
import { Button } from "@heroui/button";
import { useAuth } from "@/context/AuthContext";
import {
  addToast,
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Tooltip,
} from "@heroui/react";

import {
  Cog8ToothIcon,
  ArrowLeftStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export const Navbar = () => {
  const { user, users } = useAuth();

  const navigate = useRouter();

  const currentUser = users.find((u) => u.id === user?.uid);

  return (
    <HeroUINavbar
      maxWidth="xl"
      className="bg-foreground py-3"
      position="sticky"
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <Link
            className="flex justify-start items-center gap-1"
            href="/dashboard"
          >
            <Logo className="h-8 w-auto mb-1 " />
          </Link>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <Link
                className={clsx(
                  "data-[active=true]:text-primary text-muted data-[active=true]:font-medium"
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </Link>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        {/* <NavbarItem className="hidden sm:flex gap-2">
          <ThemeSwitch />
        </NavbarItem> */}

        <NavbarItem className="hidden sm:flex gap-2">
          {currentUser ? (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <h2 className={`font-bold text-primary leading-5`}>
                  {currentUser.name}
                </h2>
                <p className=" leading-4">
                  {currentUser.role === "member" && "Member"}
                  {currentUser.role === "manager" && "Manager"}
                  {currentUser.role === "admin" && "Admin"}
                </p>
              </div>

              <Dropdown>
                <DropdownTrigger>
                  <div className="relative">
                    <Avatar
                      isBordered
                      radius="sm"
                      color="primary"
                      className="cursor-pointer"
                      src={currentUser.photoURL}
                    />
                  </div>
                </DropdownTrigger>
                <DropdownMenu className="" aria-label="Profile Actions">
                  <DropdownSection showDivider title="">
                    <DropdownItem key="profile" className="h-14 ">
                      <div className="flex items-center gap-4">
                        <Avatar
                          isBordered
                          radius="sm"
                          size="sm"
                          color="primary"
                          className="cursor-pointer"
                          src={currentUser.photoURL}
                        />
                        <div>
                          <p className="font-semibold">{currentUser.name}</p>
                          <p className=" text-muted">{currentUser.email}</p>
                        </div>
                      </div>
                    </DropdownItem>
                  </DropdownSection>

                  <DropdownItem key="settings" href="/settings">
                    Meine Einstellungen
                  </DropdownItem>
                  {currentUser.role === "manager" ||
                  currentUser.role === "admin" ? (
                    <DropdownItem
                      key="manager-dashboard"
                      href="/manager-dashboard"
                    >
                      Manager Dashboard
                    </DropdownItem>
                  ) : null}
                  {currentUser.role === "admin" ? (
                    <DropdownItem
                      className="hover:bg-background"
                      key="admin-dashboard"
                      href="/admin-dashboard"
                    >
                      Admin Dashboard
                    </DropdownItem>
                  ) : null}

                  <DropdownItem
                    key="logout"
                    color="danger"
                    className="text-danger"
                    onPress={() => {
                      signOut(auth)
                        .then(() => {
                          // Sign-out successful.
                          addToast({
                            title: "Erolgreich abgemeldet",
                            description: "Sie wurden erfolgreich abgemeldet",
                            color: "success",
                          });

                          navigate.replace("/auth");
                        })
                        .catch((error) => {
                          console.log(error);
                          addToast({
                            title: "Fehler!",
                            description:
                              "Es ist ein Fehler aufgetreten, bitte versuchen Sie es erneut",
                            color: "danger",
                          });
                        });
                    }}
                  >
                    Abmelden
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          ) : (
            <Link href="/auth">
              <Button color="primary" variant="bordered">
                Anmelden
              </Button>
            </Link>
          )}
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        {/* <ThemeSwitch /> */}
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <LinkHero color={"foreground"} href={item.href} size="lg">
                {item.label}
              </LinkHero>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};

"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Spinner } from "@heroui/react";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user === undefined) return; // Falls `user` noch nicht geladen ist, nichts tun

    if (!user) {
      router.replace("/auth");
    } else if (pathname === "/auth" || pathname === "/") {
      router.replace("/dashboard");
    }

    setLoading(false);
  }, [user, router, pathname]);

  if (loading || (!user && pathname !== "/auth")) {
    return (
      <section className="flex justify-center items-center h-[70vh]">
        <Spinner />
      </section>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;

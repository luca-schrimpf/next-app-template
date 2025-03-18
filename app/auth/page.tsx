"use client";
import { Logo } from "@/components/icons";
import { auth, db } from "@/firebase";
import { Button, Card, CardBody, Input, Link, Tab, Tabs } from "@heroui/react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import React, { useState } from "react";
import { addToast } from "@heroui/toast";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

const page = () => {
  const [selected, setSelected] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        addToast({
          title: "Anmeldung erfolgreich",
          description: "Sie werden in Kürze weitergeleitet",
          color: "success",
        });

        setTimeout(() => {
          navigate.push("/dashboard");
        }, 2000);
      })
      .catch((error) => {
        let errorMessage = "Unbekannter Fehler";
        if (error.code === "auth/wrong-password")
          errorMessage = "Falsches Passwort!";
        if (error.code === "auth/user-not-found")
          errorMessage = "Benutzer nicht gefunden!";
        if (error.code === "auth/too-many-requests")
          errorMessage = "Zu viele Anmeldeversuche!";
        if (error.code === "auth/invalid-credential")
          errorMessage = "Ungültige Anmeldeinformationen!";

        console.log(error);
        setIsSubmitting(false);

        addToast({
          title: "Anmeldung fehlgeschlagen",
          description: errorMessage,
          color: "danger",
        });
      });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const photoURL = `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(fullname)}`;

        updateProfile(userCredential.user, {
          displayName: fullname,
          photoURL: photoURL,
        });

        await setDoc(doc(db, "users", userCredential.user.uid), {
          name: fullname,
          email: email,
          photoURL: photoURL,
          role: "member",
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          status: "active",
          solvedCourses: [],
          solvedTasks: [],
        });

        addToast({
          title: "Registrierung erfolgreich",
          description: "Sie werden in Kürze weitergeleitet",
          color: "success",
        });

        setTimeout(() => {
          navigate.push("/dashboard");
        }, 2000);
      })
      .catch((error) => {
        console.log(error);
        setIsSubmitting(false);

        addToast({
          title: "Anmeldung fehlgeschlagen",
          description: "Registrierung fehlgeschlagen, versuche es nochmal.",
          color: "danger",
        });
      });
  };

  return (
    <section>
      <div className="flex flex-col justify-center items-center w-full">
        <Card className="max-w-full w-[340px] h-fit transition-height duration-250 ease-out ">
          <CardBody className="overflow-hidden">
            <Logo className="h-8 w-auto my-5 mb-8 " />

            <Tabs
              fullWidth
              aria-label="Tabs form"
              selectedKey={selected}
              size="md"
              onSelectionChange={(key) => setSelected(String(key))}
            >
              <Tab key="login" title="Anmelden">
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                  <Input
                    isRequired
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    label="Email"
                    placeholder="Gebe deine E-Mail-Adresse ein"
                    type="email"
                  />
                  <Input
                    isRequired
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    label="Password"
                    placeholder="Gebe dein Passwort ein"
                    type="password"
                  />
                  <p className="text-center text-small">
                    Konto erstellen?{" "}
                    <Link
                      size="sm"
                      className="cursor-pointer"
                      onPress={() => setSelected("sign-up")}
                    >
                      Registrieren
                    </Link>
                  </p>
                  <div className="flex gap-2 justify-end">
                    <Button
                      isLoading={isSubmitting}
                      type="submit"
                      fullWidth
                      color="primary"
                      className="font-bold"
                    >
                      Anmelden
                    </Button>
                  </div>
                </form>
              </Tab>
              <Tab key="sign-up" title="Registrieren">
                <form
                  onSubmit={handleRegister}
                  className="flex flex-col gap-4 "
                >
                  <Input
                    isRequired
                    label="Name"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    placeholder="Gebe deinen Vollständigen Namen ein"
                    type="text"
                  />
                  <Input
                    isRequired
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    label="Email"
                    placeholder="Gebe deine E-Mail-Adresse ein"
                    type="email"
                  />
                  <Input
                    isRequired
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Gebe dein Passwort ein"
                    type="password"
                  />
                  <p className="text-center text-small">
                    Bereits ein Konto?{" "}
                    <Link size="sm" onPress={() => setSelected("login")}>
                      Anmelden
                    </Link>
                  </p>
                  <div className="flex gap-2 justify-end">
                    <Button
                      isLoading={isSubmitting}
                      type="submit"
                      className="font-bold"
                      fullWidth
                      color="primary"
                    >
                      Registrieren
                    </Button>
                  </div>
                </form>
              </Tab>
            </Tabs>
          </CardBody>
        </Card>
      </div>
    </section>
  );
};

export default page;

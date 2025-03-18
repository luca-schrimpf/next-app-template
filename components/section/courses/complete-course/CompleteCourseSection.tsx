"use client";
import { CodeBlock } from "@/components/CodeBlock";
import { CustomCheckbox } from "@/components/CustomCheckbox";
import CustomRadioButton from "@/components/CustomRadioButton";
import RowSteps from "@/components/row-steps";
import { useAuth } from "@/context/AuthContext";
import { TaskDatabaseInterface } from "@/types";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/solid";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import {
  addToast,
  CheckboxGroup,
  radio,
  RadioGroup,
  Spinner,
} from "@heroui/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import OpenHintDialog from "./OpenHintDialog";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "next/navigation";

const CompleteCourseSection = ({ courseID }: { courseID: string }) => {
  const { courses, users, user, tasks, refreshData } = useAuth();

  const [step, setStep] = useState(0);
  const [currentTask, setCurrentTask] = useState<TaskDatabaseInterface>();
  const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [solvedTasks, setSolvedTasks] = useState([] as string[]);

  //   Antwort Inputs
  const [answerInput, setAnswerInput] = useState("");
  const [answerCheckbox, setAnswerCheckbox] = useState<string[]>([]);
  const [answerRadio, setAnwserRadio] = useState("");

  const navigate = useRouter();

  if (!user) {
    return (
      <div className="text-center flex flex-col gap-3 py-12 text-muted">
        Bitte einloggen.
        <Link href={`/login`}>
          <Button>Login</Button>
        </Link>
      </div>
    );
  }

  const currentUserDatabase = users.find((u) => u.id === user.uid);

  if (!courses || !tasks || !users || !currentUserDatabase) {
    return (
      <div className="text-center flex flex-col gap-3 py-12 text-muted">
        Leider ist ein Fehler aufgetreten.
        <Link href={`/dashboard`}>
          <Button>Zurück zum Dashboard</Button>
        </Link>
      </div>
    );
  }

  const course = courses.find((course) => course.id === courseID);

  if (!course) {
    return (
      <div className="text-center flex flex-col gap-3 py-12 text-muted">
        Kurs nicht gefunden.
        <Link href={`/dashboard`}>
          <Button>Zurück zum Dashboard</Button>
        </Link>
      </div>
    );
  }

  const tasksOfCourse = tasks.filter((task) => task.courseId === courseID);

  const sortTasksByOrder = tasksOfCourse.sort((a, b) => a.order - b.order);

  useEffect(() => {
    const changeStates = () => {
      const solved = (currentUserDatabase.solvedTasks ?? []).filter((taskID) =>
        tasksOfCourse.find((task) => task.id === taskID)
      );

      setSolvedTasks(solved);

      if (solved.length > 0) {
        const lastSolvedTask = tasksOfCourse
          .filter((task) => solved.includes(task.id))
          .sort((a, b) => b.order - a.order)[0];
        const lastSolvedTaskIndex = sortTasksByOrder.findIndex(
          (task) => task.id === lastSolvedTask.id
        );
        setStep(lastSolvedTaskIndex + 1);
      } else {
        setStep(0);
      }

      setLoading(false);
    };

    const checkIfCourseIsSolved = async () => {
      if (
        tasksOfCourse.every((task) =>
          currentUserDatabase.solvedTasks.includes(task.id)
        )
      ) {
        navigate.push("/courses/success/" + courseID);
        return;
      } else {
        changeStates();
      }
    };

    checkIfCourseIsSolved();
  }, []);

  useEffect(() => {
    const changeStates = () => {
      const currentTask = sortTasksByOrder[step];

      if (
        currentTask.answerType === "single-choice" ||
        currentTask.answerType === "multiple-choice" ||
        currentTask.answerType === "code"
      ) {
        const answers = [
          ...currentTask.answers,
          ...(currentTask.wrongAnswers || []),
        ];
        setShuffledAnswers(answers.sort(() => Math.random() - 0.5));
      }

      setCurrentTask(currentTask);
    };

    changeStates();
  }, [step]);

  const handleNextStep = async () => {
    if (!currentTask?.id) return;

    // Antwort überpüfen

    if (currentTask?.answerType === "text") {
      if (!answerInput) {
        addToast({
          title: "Bitte gebe eine Antwort ein",
          color: "danger",
        });
        return;
      }

      const isCorrect = currentTask.answers.includes(answerInput);

      if (isCorrect) {
        addToast({ title: "Richtig!", color: "success" });

        setAnswerInput("");
      } else {
        addToast({
          title: "Antwort ist leider Falsch, versuche es erneut.",
          color: "danger",
        });

        return;
      }
    }

    if (currentTask?.answerType === "single-choice") {
      if (!answerRadio) {
        addToast({
          title: "Bitte wähle eine Antwort aus.",
          color: "danger",
        });
        return;
      }

      if (answerRadio === currentTask.answers[0]) {
        addToast({ title: "Richtig!", color: "success" });

        setAnwserRadio("");
      } else {
        addToast({
          title: "Antwort ist leider Falsch, versuche es erneut.",
          color: "danger",
        });

        return;
      }
    }
    if (currentTask?.answerType === "code") {
      if (!answerRadio) {
        addToast({
          title: "Bitte wähle eine Antwort aus.",
          color: "danger",
        });
        return;
      }

      if (currentTask.answers.includes(answerRadio)) {
        addToast({ title: "Richtig!", color: "success" });

        setAnwserRadio("");
      } else {
        addToast({
          title: "Antwort ist leider Falsch, versuche es erneut.",
          color: "danger",
        });

        return;
      }
    }

    if (currentTask?.answerType === "multiple-choice") {
      if (answerCheckbox.length === 0) {
        addToast({
          title: "Bitte wähle mindestens eine Antwort aus.",
          color: "danger",
        });
        return;
      }

      const isCorrect = answerCheckbox.every((answer) =>
        currentTask.answers.includes(answer)
      );

      if (isCorrect) {
        addToast({ title: "Richtig!", color: "success" });

        setAnswerCheckbox([]);
      } else {
        addToast({
          title: "Antwort ist leider Falsch, versuche es erneut.",
          color: "danger",
        });

        return;
      }
    }

    // Antwort speichern

    setSolvedTasks([...solvedTasks, currentTask.id]);
    const userRef = doc(db, "users", user.uid);

    await updateDoc(userRef, {
      solvedTasks: arrayUnion(currentTask.id),
    });

    if (step === sortTasksByOrder.length - 1) {
      addToast({ title: "Kurs erfolgreich abgeschlossen!", color: "success" });

      await updateDoc(userRef, {
        solvedCourses: arrayUnion(courseID),
      });

      refreshData();

      navigate.push("/courses/success/" + courseID);
      return;
    } else {
      setStep(step + 1);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12 text-muted">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <RowSteps
        // defaultStep={2}
        currentStep={step}
        onStepChange={(step) => setStep(step)}
        steps={sortTasksByOrder.map((task) => ({
          title: task.title,
        }))}
      />

      <div className="flex flex-col gap-3 bg-[#1B1A17] p-8 rounded-lg my-5 mb-14 ">
        <h1 className={`md:text-4xl text-2xl font-bold`}>
          {currentTask?.title}
        </h1>
        <p className="text-lg text-muted">{currentTask?.description}</p>

        <div className="mt-5">
          <div className="flex items-center gap-3 bg-default/50 p-5 rounded-lg">
            <QuestionMarkCircleIcon className="h-8 w-8 text-primary" />
            <div>
              <p className=" text-xl font-semibold">{currentTask?.question}</p>
            </div>
          </div>

          {currentTask?.questionCode && currentTask.answerType === "code" && (
            <div className="mt-5">
              <CodeBlock
                language="jsx"
                filename="DummyComponent.jsx"
                highlightLines={[9, 13, 14, 18]}
                code={currentTask?.questionCode || ""}
              />
            </div>
          )}

          <div className="py-8">
            {currentTask?.answerType === "text" && (
              <Input
                label="Antwort"
                labelPlacement="outside"
                placeholder="Gebe hier deine Antwort ein..."
                onChange={(e) => setAnswerInput(e.target.value)}
                value={answerInput}
              />
            )}

            {currentTask?.answerType === "single-choice" ? (
              <RadioGroup
                // description="Nur eine Antwort ist richtig"
                label="Wähle die richtige Antwort"
                value={answerRadio}
                onChange={(e) => setAnwserRadio(e.target.value)}
              >
                {shuffledAnswers.map((answer, index) => (
                  <CustomRadioButton key={index} value={answer}>
                    {answer}
                  </CustomRadioButton>
                ))}
              </RadioGroup>
            ) : currentTask?.answerType === "code" ? (
              <RadioGroup
                label="Wähle die richtige Antwort"
                value={answerRadio}
                onChange={(e) => setAnwserRadio(e.target.value)}
              >
                {shuffledAnswers.map((answer, index) => (
                  <CustomRadioButton key={index} value={answer}>
                    {answer}
                  </CustomRadioButton>
                ))}
              </RadioGroup>
            ) : null}

            {currentTask?.answerType === "multiple-choice" ? (
              <CheckboxGroup
                classNames={{
                  base: "w-full",
                }}
                label="Wähle die richtigen Antworten"
                value={answerCheckbox}
                onChange={setAnswerCheckbox}
              >
                {shuffledAnswers.map((answer, index) => (
                  <CustomCheckbox value={answer} key={index} />
                ))}
              </CheckboxGroup>
            ) : null}

            {currentTask?.hint && (
              <OpenHintDialog hintText={currentTask.hint} />
            )}
          </div>

          <div className="flex items-center justify-between ">
            <Button
              color="primary"
              className="text-background font-semibold"
              onPress={handleNextStep}
            >
              {step === sortTasksByOrder.length - 1
                ? "Kurs abschließen"
                : "Weiter"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteCourseSection;

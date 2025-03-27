import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  addToast,
  Input,
  Divider,
  Textarea,
  Tabs,
  Tab,
  Select,
  SelectItem,
  Image,
  NumberInput,
} from "@heroui/react";
import { CourseDatabaseInterface, TaskDatabaseInterface } from "@/types";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { TrashIcon } from "@heroicons/react/24/solid";
import { db, storage } from "@/firebase";
import { useAuth } from "@/context/AuthContext";
import { createCourseWithTasks } from "@/lib/prompts";
import { PhotoIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { FrameworksList } from "@/data/frameworks";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const awnserTypes = [
  { key: "text", label: "Text" },
  { key: "code", label: "Code" },
  { key: "multiple-choice", label: "Multiple Choice" },
  { key: "single-choice", label: "Single Choice" },
];

interface CoursePromtResultInterface {
  description: string;
  title: string;
  tasks: TaskDatabaseInterface[];
}

const CreateCourseWithAI = () => {
  const { user, refreshData } = useAuth();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [error, setError] = useState("");

  const [frameworkValue, setFrameworkValue] = useState("");
  const [difficultyLevel, setDifficultyLevel] = useState<number>();
  const [countOfTasks, setCountOfTasks] = useState<number>();

  const [isCreatingLoading, setIsCreatingLoading] = useState(false);

  const [courseData, setCourseData] = useState<CourseDatabaseInterface>();
  const [tasksData, setTasksData] = useState<TaskDatabaseInterface[]>();

  const handleSubmit = async () => {
    setIsCreatingLoading(true);

    createCourseWithTasks({
      framework: frameworkValue,
      difficulty: Number(difficultyLevel),
      countOfTasks: Number(countOfTasks),
    })
      .then((data: CoursePromtResultInterface) => {
        const courseId = uuidv4();

        const course: CourseDatabaseInterface = {
          id: courseId,
          createdBy: user?.uid ? user.uid : "unknown",
          thumbnail:
            "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
          title: data.title,
          description: data.description,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          status: "draft",
          frameworkID: frameworkValue,
          difficulty: Number(difficultyLevel),
        };

        const tasks: TaskDatabaseInterface[] = data.tasks.map((task, index) => {
          return {
            id: uuidv4(),
            courseId: courseId,
            order: index,
            title: task.title,
            description: task.description,
            hint: task.hint,
            question: task.question,
            questionCode: task.questionCode || "",
            answers: task.answers,
            wrongAnswers: task.wrongAnswers || [],
            answerType: task.answerType as
              | "text"
              | "code"
              | "multiple-choice"
              | "single-choice",
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
          };
        });

        setCourseData(course);
        setTasksData(tasks);

        addToast({
          title: "Kurs erstellt",
          description: "Der Kurs wurde erfolgreich generiert",
          color: "success",
        });

        // setResponse(data.response);
      })
      .catch((error) => {
        console.log(error);
        setError("Fehler beim Erstellen des Kurses");
      })
      .finally(() => {
        setIsCreatingLoading(false);
      });
  };

  const handleSave = async () => {
    try {
      if (!courseData?.id) return;
      if (!tasksData) return;

      let thumbnailURL = courseData.thumbnail;

      if (thumbnailURL.startsWith("data:image")) {
        const response = await fetch(thumbnailURL);
        const blob = await response.blob();
        const storageRef = ref(
          storage,
          `courses/${courseData.id}/thumbnail.jpg`
        );

        await uploadBytes(storageRef, blob);

        thumbnailURL = await getDownloadURL(storageRef);
      }

      const updatedCourseData = { ...courseData, thumbnail: thumbnailURL };

      await setDoc(doc(db, "courses", courseData.id), updatedCourseData);

      tasksData.forEach(async (task) => {
        console.log(task);
        await setDoc(doc(db, "tasks", task.id), task);
      });

      addToast({
        title: "Kurs gespeichert",
        description: "Der Kurs wurde erfolgreich gespeichert",
        color: "success",
      });
      refreshData();
    } catch (error) {
      console.log(error);
      addToast({
        title: "Fehler beim Speichern",
        description: "Der Kurs konnte nicht gespeichert werden",
        color: "danger",
      });
    }
  };

  return (
    <>
      <Button
        onPress={onOpen}
        color="primary"
        variant="bordered"
        startContent={<SparklesIcon className="w-5 h-5 " />}
      >
        Kurse mit KI erstellen
      </Button>
      <Modal
        isDismissable={false}
        isKeyboardDismissDisabled
        className="min-w-[80vw] min-h-[80vh]"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-row items-center gap-1">
                <SparklesIcon className="w-6 h-6" /> Kurs mit KI erstellen
              </ModalHeader>
              <ModalBody>
                {error && (
                  <div className=" overflow-y-scroll h-96 mt-4">
                    <p className="mt-4 ">Antwort: {error}</p>{" "}
                  </div>
                )}

                {courseData && tasksData ? (
                  <>
                    <h2 className="font-semibold">Kurs Informationen</h2>

                    <Divider />

                    <div className=" overflow-y-scroll h-full max-h-[70vh] mt-4 pr-4 space-y-5">
                      <div className="mb-14">
                        <p className="text-sm">Thumbnail</p>
                        <Image
                          alt="Course cover"
                          className=" my-2"
                          src={courseData.thumbnail}
                          width={240}
                        />

                        <Button
                          variant="bordered"
                          color="primary"
                          startContent={<PhotoIcon className="w-5 h-5" />}
                          onPress={() => {
                            const input = document.createElement("input");
                            input.type = "file";
                            input.accept = "image/*";
                            input.onchange = (e) => {
                              const file = (e.target as HTMLInputElement)
                                .files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = () => {
                                  if (
                                    reader.result &&
                                    typeof reader.result === "string"
                                  ) {
                                    setCourseData({
                                      ...courseData,
                                      thumbnail: reader.result,
                                    });
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            };
                            input.click();
                          }}
                        >
                          Eigenes Thumbnail hochladen
                        </Button>
                      </div>
                      <div>
                        <p>Titel</p>
                        <Input
                          required
                          type="text"
                          placeholder="Titel hier eingeben..."
                          defaultValue={courseData?.title}
                          classNames={{
                            inputWrapper: "bg-text hover:bg-text/80",
                            mainWrapper: "bg-text text-white rounded-lg ",
                          }}
                          onChange={(e) =>
                            setCourseData({
                              ...courseData,
                              title: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div>
                        <p>Beschreibung</p>
                        <Textarea
                          required
                          type="text"
                          classNames={{
                            inputWrapper: "bg-text hover:bg-text/80",
                            mainWrapper: "bg-text hover:bg-text/80",
                            input: "bg-text hover:bg-text/80",
                            base: "hover:bg-text rounded-lg",
                            innerWrapper:
                              "bg-text hover:bg-text/80 text-white rounded-lg ",
                          }}
                          placeholder="Beschreibung hier eingeben..."
                          defaultValue={courseData?.description}
                          onChange={(e) =>
                            setCourseData({
                              ...courseData,
                              description: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div>
                        <p className="text-sm mb-3">Aufgaben</p>
                        <Tabs aria-label="TasksTabs">
                          {tasksData &&
                            tasksData.map((task, index) => (
                              <Tab key={index} title={`Aufgabe ${index + 1}`}>
                                <div className="bg-muted/25 text-text mb-5 flex flex-col gap-4 p-4 rounded-lg">
                                  <div>
                                    <p>Titel</p>
                                    <Input
                                      required
                                      classNames={{
                                        inputWrapper:
                                          "bg-text hover:bg-text/80",
                                        mainWrapper:
                                          "bg-text text-white rounded-lg ",
                                      }}
                                      type="text"
                                      placeholder="Titel hier eingeben..."
                                      defaultValue={task.title}
                                      onChange={(e) =>
                                        setTasksData([
                                          ...tasksData.slice(0, index),
                                          { ...task, title: e.target.value },
                                          ...tasksData.slice(index + 1),
                                        ])
                                      }
                                    />
                                  </div>

                                  <div>
                                    <p>Beschreibung</p>
                                    <Textarea
                                      required
                                      classNames={{
                                        inputWrapper:
                                          "bg-text hover:bg-text/80",
                                        mainWrapper: "bg-text hover:bg-text/80",
                                        input: "bg-text hover:bg-text/80",
                                        base: "hover:bg-text rounded-lg",
                                        innerWrapper:
                                          "bg-text hover:bg-text/80 text-white rounded-lg ",
                                      }}
                                      type="text"
                                      placeholder="Beschreibung hier eingeben..."
                                      defaultValue={task.description}
                                      onChange={(e) =>
                                        setTasksData([
                                          ...tasksData.slice(0, index),
                                          {
                                            ...task,
                                            description: e.target.value,
                                          },
                                          ...tasksData.slice(index + 1),
                                        ])
                                      }
                                    />
                                  </div>

                                  <div>
                                    <p>Frage</p>
                                    <Textarea
                                      required
                                      classNames={{
                                        inputWrapper:
                                          "bg-text hover:bg-text/80",
                                        mainWrapper: "bg-text hover:bg-text/80",
                                        input: "bg-text hover:bg-text/80",
                                        base: "hover:bg-text rounded-lg",
                                        innerWrapper:
                                          "bg-text hover:bg-text/80 text-white rounded-lg ",
                                      }}
                                      type="text"
                                      placeholder="Frage hier eingeben..."
                                      defaultValue={task.question}
                                      onChange={(e) =>
                                        setTasksData([
                                          ...tasksData.slice(0, index),
                                          { ...task, question: e.target.value },
                                          ...tasksData.slice(index + 1),
                                        ])
                                      }
                                    />
                                  </div>

                                  <div>
                                    <p>Antwort Typ</p>

                                    <Select
                                      fullWidth
                                      classNames={{
                                        mainWrapper:
                                          "bg-text text-foreground rounded-lg",
                                      }}
                                      defaultSelectedKeys={[task.answerType]}
                                      onChange={(e) =>
                                        setTasksData([
                                          ...tasksData.slice(0, index),
                                          {
                                            ...task,
                                            answerType: e.target.value as
                                              | "text"
                                              | "code"
                                              | "multiple-choice"
                                              | "single-choice",
                                          },
                                          ...tasksData.slice(index + 1),
                                        ])
                                      }
                                    >
                                      {awnserTypes.map((type) => (
                                        <SelectItem key={type.key}>
                                          {type.label}
                                        </SelectItem>
                                      ))}
                                    </Select>
                                  </div>

                                  {task.answerType === "code" && (
                                    <div>
                                      <p>Code</p>
                                      <Textarea
                                        required
                                        classNames={{
                                          inputWrapper:
                                            "bg-text hover:bg-text/80",
                                          mainWrapper:
                                            "bg-text hover:bg-text/80",
                                          input: "bg-text hover:bg-text/80",
                                          base: "hover:bg-text rounded-lg",
                                          innerWrapper:
                                            "bg-text hover:bg-text/80 text-white rounded-lg ",
                                        }}
                                        type="text"
                                        placeholder="Code hier eingeben..."
                                        defaultValue={task.questionCode}
                                        onChange={(e) =>
                                          setTasksData([
                                            ...tasksData.slice(0, index),
                                            {
                                              ...task,
                                              questionCode: e.target.value,
                                            },
                                            ...tasksData.slice(index + 1),
                                          ])
                                        }
                                      />
                                    </div>
                                  )}

                                  <div className="px-6 flex bg-foreground py-4 rounded-lg flex-col gap-4">
                                    <p className="font-semibold">Antworten</p>
                                    <Divider />
                                    {task.answers.map((awnser, awnserIndex) => (
                                      <div
                                        key={awnserIndex}
                                        className="flex bg-muted/10 p-2 px-3 rounded-lg items-end justify-between gap-2"
                                      >
                                        <div className="w-full">
                                          <p className="mb-1">
                                            Antwort {awnserIndex + 1}
                                          </p>
                                          <Input
                                            required
                                            type="text"
                                            placeholder="Antwort hier eingeben..."
                                            defaultValue={awnser}
                                            classNames={{
                                              inputWrapper:
                                                "bg-text hover:bg-text/80",
                                              mainWrapper:
                                                "bg-text text-white rounded-lg ",
                                            }}
                                            onChange={(e) =>
                                              setTasksData([
                                                ...tasksData.slice(0, index),
                                                {
                                                  ...task,
                                                  answers: [
                                                    ...task.answers.slice(
                                                      0,
                                                      awnserIndex
                                                    ),
                                                    e.target.value,
                                                    ...task.answers.slice(
                                                      awnserIndex + 1
                                                    ),
                                                  ],
                                                },
                                                ...tasksData.slice(index + 1),
                                              ])
                                            }
                                          />
                                        </div>

                                        <Button
                                          isIconOnly
                                          variant="bordered"
                                          color="danger"
                                          onPress={() => {
                                            setTasksData([
                                              ...tasksData.slice(0, index),
                                              {
                                                ...task,
                                                answers: [
                                                  ...task.answers.slice(
                                                    0,
                                                    awnserIndex
                                                  ),
                                                  ...task.answers.slice(
                                                    awnserIndex + 1
                                                  ),
                                                ],
                                              },
                                              ...tasksData.slice(index + 1),
                                            ]);
                                          }}
                                        >
                                          <TrashIcon className="w-5 h-5" />
                                        </Button>
                                      </div>
                                    ))}
                                    <Button
                                      variant="bordered"
                                      color="primary"
                                      className="mb-2"
                                      onPress={() =>
                                        setTasksData([
                                          ...tasksData.slice(0, index),
                                          {
                                            ...task,
                                            answers: [
                                              ...task.answers,
                                              "Neue Antwort",
                                            ],
                                          },
                                          ...tasksData.slice(index + 1),
                                        ])
                                      }
                                    >
                                      Weitere Antwort hinzufügen
                                    </Button>
                                    {task.answerType === "single-choice" ||
                                    task.answerType === "multiple-choice" ||
                                    task.answerType === "code" ? (
                                      <>
                                        <p className="font-semibold">
                                          Falsche Antworten
                                        </p>

                                        <Divider />
                                        {task.wrongAnswers &&
                                          task.wrongAnswers.map(
                                            (wrongAnswer, wrongAnswerIndex) => (
                                              <div
                                                key={wrongAnswerIndex}
                                                className="flex items-end justify-between gap-2"
                                              >
                                                <div className="w-full">
                                                  <p className="mb-1">
                                                    Antwort{" "}
                                                    {wrongAnswerIndex + 1}
                                                  </p>
                                                  <Input
                                                    required
                                                    type="text"
                                                    classNames={{
                                                      inputWrapper:
                                                        "bg-text hover:bg-text/80",
                                                      mainWrapper:
                                                        "bg-text text-white rounded-lg ",
                                                    }}
                                                    placeholder="Antwort hier eingeben..."
                                                    defaultValue={wrongAnswer}
                                                    onChange={(e) =>
                                                      setTasksData([
                                                        ...tasksData.slice(
                                                          0,
                                                          index
                                                        ),
                                                        {
                                                          ...task,
                                                          wrongAnswers: [
                                                            ...(
                                                              task.wrongAnswers ||
                                                              []
                                                            ).slice(
                                                              0,
                                                              wrongAnswerIndex
                                                            ),
                                                            e.target.value,
                                                            ...(
                                                              task.wrongAnswers ||
                                                              []
                                                            ).slice(
                                                              wrongAnswerIndex +
                                                                1
                                                            ),
                                                          ],
                                                        },
                                                        ...tasksData.slice(
                                                          index + 1
                                                        ),
                                                      ])
                                                    }
                                                  />
                                                </div>

                                                <Button
                                                  isIconOnly
                                                  variant="bordered"
                                                  color="danger"
                                                  onPress={() => {
                                                    setTasksData([
                                                      ...tasksData.slice(
                                                        0,
                                                        index
                                                      ),
                                                      {
                                                        ...task,
                                                        wrongAnswers: [
                                                          ...(
                                                            task.wrongAnswers ||
                                                            []
                                                          ).slice(
                                                            0,
                                                            wrongAnswerIndex
                                                          ),
                                                          ...(
                                                            task.wrongAnswers ||
                                                            []
                                                          ).slice(
                                                            wrongAnswerIndex + 1
                                                          ),
                                                        ],
                                                      },
                                                      ...tasksData.slice(
                                                        index + 1
                                                      ),
                                                    ]);
                                                  }}
                                                >
                                                  <TrashIcon className="w-5 h-5" />
                                                </Button>
                                              </div>
                                            )
                                          )}
                                        <Button
                                          variant="bordered"
                                          color="danger"
                                          className="mb-2"
                                          onPress={() =>
                                            setTasksData([
                                              ...tasksData.slice(0, index),
                                              {
                                                ...task,
                                                wrongAnswers: [
                                                  ...(task.wrongAnswers || []),
                                                  "Neue falsche Antwort",
                                                ],
                                              },
                                              ...tasksData.slice(index + 1),
                                            ])
                                          }
                                        >
                                          Falsche Antworten hinzufügen
                                        </Button>
                                      </>
                                    ) : null}
                                  </div>

                                  <div>
                                    <p className="mb-1">Hinweis</p>
                                    <Input
                                      required
                                      classNames={{
                                        inputWrapper:
                                          "bg-text hover:bg-text/80",
                                        mainWrapper:
                                          "bg-text text-white rounded-lg ",
                                      }}
                                      type="text"
                                      placeholder="Hinweis hier eingeben..."
                                      defaultValue={task.hint}
                                      onChange={(e) =>
                                        setTasksData([
                                          ...tasksData.slice(0, index),
                                          { ...task, hint: e.target.value },
                                          ...tasksData.slice(index + 1),
                                        ])
                                      }
                                    />
                                  </div>

                                  <Button
                                    variant="faded"
                                    color="danger"
                                    onPress={() => {
                                      setTasksData([
                                        ...tasksData.slice(0, index),
                                        ...tasksData.slice(index + 1),
                                      ]);
                                    }}
                                  >
                                    Aufgabe entfernen
                                  </Button>
                                </div>
                              </Tab>
                            ))}
                        </Tabs>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="my-3">
                      <h1 className="text-4xl  font-bold">
                        In welche richtung soll der Kurs gehen?{" "}
                      </h1>
                      <p className="text-muted">
                        Fülle die erforderlichen Felder aus, um mit den Angaben
                        und der KI ein Kurs zu generieren lassen.
                      </p>
                    </div>
                    <Divider />

                    <p>Framework</p>

                    <Select
                      classNames={{
                        mainWrapper: "bg-text text-foreground rounded-lg",
                      }}
                      placeholder="Framework auswählen..."
                      onChange={(e) => setFrameworkValue(e.target.value)}
                    >
                      {FrameworksList.map((framework) => {
                        return (
                          <SelectItem
                            startContent={
                              <framework.logo className="w-6 h-6 mr-1" />
                            }
                            key={framework.id}
                          >
                            {framework.name}
                          </SelectItem>
                        );
                      })}
                    </Select>

                    <p>Schwierigkeitsgrad</p>
                    <Select
                      placeholder="Schwierigkeitsgrad auswählen..."
                      description="1-5, wobei 1 leicht ist und 5 am schwierigsten ist"
                      onChange={(e) =>
                        setDifficultyLevel(Number(e.target.value))
                      }
                      classNames={{
                        mainWrapper: "bg-text text-foreground rounded-lg",
                        description: "text-muted pl-2",
                      }}
                    >
                      {Array.from({ length: 5 }, (_, index) => index + 1).map(
                        (level) => {
                          return (
                            <SelectItem key={level}>
                              {`Level ${level} `}
                            </SelectItem>
                          );
                        }
                      )}
                    </Select>

                    <p>Aufgaben Anzahl</p>
                    <Select
                      placeholder="Aufgaben Anzahl auswählen..."
                      description="Zwischen 1 und 10 Aufgaben können erstellt werden"
                      onChange={(e) => setCountOfTasks(Number(e.target.value))}
                      classNames={{
                        mainWrapper: "bg-text text-foreground rounded-lg",
                        description: "text-muted pl-2",
                      }}
                    >
                      {Array.from({ length: 10 }, (_, index) => index + 1).map(
                        (level) => {
                          return (
                            <SelectItem key={level}>
                              {`${level}  ${level === 1 ? "Aufgabe" : "Aufgaben"} `}
                            </SelectItem>
                          );
                        }
                      )}
                    </Select>
                  </>
                )}
              </ModalBody>
              <ModalFooter>
                {courseData && tasksData ? (
                  <Button
                    isLoading={isCreatingLoading}
                    fullWidth
                    color="primary"
                    className="text-background font-semibold"
                    onPress={handleSave}
                  >
                    Kurs speichern
                  </Button>
                ) : (
                  <Button
                    isLoading={isCreatingLoading}
                    fullWidth
                    isDisabled={
                      !frameworkValue || !countOfTasks || !difficultyLevel
                    }
                    startContent={<SparklesIcon className="w-5 h-5" />}
                    onPress={handleSubmit}
                    color={
                      frameworkValue || countOfTasks || difficultyLevel
                        ? "primary"
                        : "default"
                    }
                    className={
                      frameworkValue || countOfTasks || difficultyLevel
                        ? "text-background font-semibold"
                        : ""
                    }
                  >
                    Generieren lassen
                  </Button>
                )}

                <Button
                  isLoading={isCreatingLoading}
                  color="danger"
                  variant="bordered"
                  onPress={onClose}
                >
                  Schließen
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateCourseWithAI;

export const createCourseWithTasks = async ({
  framework,
  difficulty,
  countOfTasks,
}: {
  framework: string;
  difficulty: number;
  countOfTasks: number;
}) => {
  try {
    // Step 1: OpenAI Course Prompt
    const coursePrompt = `
      Du bist ein erfahrener Softwareentwickler und Experte für ${framework}.  
      Deine Aufgabe ist es, einen gut strukturierten Kurs zu erstellen.  

      **Erstelle eine Kursstruktur im folgenden JSON-Format:**  
      {
        "title": "...",
        "description": "...",
        "tasks": []
      }

      **Wichtige Anforderungen:**  
      - Der Kurs soll dem Schwierigkeitsgrad ${difficulty} entsprechen. (1-5, wobei 1 leicht ist und 5 am schwierigsten ist)
      - **title**: Kurz und prägnant.  
      - **description**: Eine detaillierte Einführung in den Kurs.  
      - **tasks**: Ein leeres Array, die Aufgaben werden in Schritt 2 generiert.
      - Text bitte alle in Deutsch
    `;

    const courseResponse = await fetch("/api/openai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: coursePrompt }),
    });

    const reader = courseResponse.body?.getReader();
    const decoder = new TextDecoder();
    let courseText = "";

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        courseText += decoder.decode(value, { stream: true });
      }
    }

    let courseData;
    try {
      courseData = JSON.parse(courseText.trim());
    } catch (error) {
      console.error("Fehler beim Parsen des Kurs-JSONs:", error, courseText);
      return null;
    }

    // Step 2: OpenAI Task Prompt
    const taskPrompt = `
      Du bist ein erfahrener Kursentwickler. Erstelle ${countOfTasks} interaktive Aufgaben für den Kurs **${courseData.title}** (${framework}).  

      **Erstelle mehrere Aufgaben im JSON-Format:**  
      [
        {
          "title": "...",
          "description": "...",
          "question": "...",
          "questionCode": "...",
          "answers": ["..."],
          "wrongAnswers": ["..."],
          "answerType": "text" | "code" | "multiple-choice" | "single-choice",
          "hint": "..."
        }
      ]

      **Wichtige Anforderungen:**  
      - Jede Aufgabe enthält ein **relevantes Konzept** von ${framework}.  
      - Sie sollen sich **logisch aufeinander aufbauen**.  
      - Falls möglich, enthalten sie **praktische Beispiele** oder fehlerhaften Code zur Korrektur.  
      - Die Aufgaben sollen **detailliert und verständlich** sein.  
      - **title**: Kurz und prägnant auf Deutsch.
      - **question**: Ist der answerType code, dann sollen Fragen kommen wie z.B. "Was ist die Ausgabe des folgenden Codes?" oder Fehlende Code Zeilen die man ergänzen soll.
      - **questionCode**: Der zugehörge CodeSnippet passend zur Question (Nur wenn answerType code ist!).
      - **description**: Eine detaillierte Einführung in die Aufgabe, da sollen genug hinweise dabei sein für die richtige Antwort. Es sollen auch keine Fragen gestellt werden. Die Description soll helfen die Frage zu beantworten also gern ausführlich erklären und ein Hinweis für die Lösung optional einbauen.
      - **answers**: Wenn answerType text ist dann bitte 1-2 richtige Antworten für die Fragen einfügen, bei single-choice nur 1 richtige Antwort und allen anderen answerType bitte 2-3 richtige Antworten einfügen.
      - **wrongAnswers**: Falsche Antworten hinzufügen (Nur bei wenn answerType multiple-choice, code oder single-choice ist, mindesten 2).
    `;

    const taskResponse = await fetch("/api/openai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: taskPrompt }),
    });

    const taskReader = taskResponse.body?.getReader();
    let taskText = "";

    if (taskReader) {
      while (true) {
        const { done, value } = await taskReader.read();
        if (done) break;
        taskText += decoder.decode(value, { stream: true });
      }
    }

    let tasks;
    try {
      tasks = JSON.parse(taskText.trim());
    } catch (error) {
      console.error("Fehler beim Parsen der Aufgaben:", error, taskText);
      return null;
    }

    courseData.tasks = tasks;
    console.log(courseData);
    return courseData;
  } catch (error) {
    console.error("Fehler beim Erstellen des Kurses:", error);
    return null;
  }
};

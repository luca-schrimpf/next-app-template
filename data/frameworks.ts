import { NextJSIcon, ReactIcon, VueJsIcon } from "@/components/icons";
import { FrameworkInterface } from "@/types";

export const FrameworksList: FrameworkInterface[] = [
  {
    id: "reactjs",
    description:
      "ReactJS is a JavaScript library for building user interfaces.",
    logo: ReactIcon,
    name: "ReactJS",
  },
  {
    id: "nextjs",
    description:
      "Next.js is a React framework that enables functionality such as server-side rendering and generating static websites for React based web applications.",
    logo: NextJSIcon,
    name: "Next.js",
  },
  {
    id: "vuejs",
    description:
      "Vue.js is a progressive JavaScript framework for building user interfaces.",
    logo: VueJsIcon,
    name: "Vue.js",
  },
];

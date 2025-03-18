import { CourseDatabaseInterface } from "@/types";
import { Timestamp } from "firebase/firestore";

export const SAMPLE_COURSES: CourseDatabaseInterface[] = [
  {
    badgeID: "",
    frameworkID: "reactjs",
    createdAt: Timestamp.now(),
    createdBy: "user1",
    description: "This is a sample course",
    id: "course1",
    status: "published",
    thumbnail:
      "https://store-wp.mui.com/wp-content/uploads/2019/08/tabler-react.com_-min-e1565617941333.png",
    title: "Sample Course",
    updatedAt: Timestamp.now(),
  },
  {
    badgeID: "",
    frameworkID: "nextjs",
    createdAt: Timestamp.now(),
    createdBy: "user132",
    description: "This is a Next.js sample course",
    id: "course11231",
    status: "published",
    thumbnail:
      "https://cdn.prod.website-files.com/615f5935af74848be6f33e1f/6356f474040e32fada16cadd_image1.png",
    title: "Next.js Sample Course",
    updatedAt: Timestamp.now(),
  },
  {
    badgeID: "",
    frameworkID: "vuejs",
    createdAt: Timestamp.now(),
    createdBy: "dadedasds",
    description: "This is a Vue.js sample course",
    id: "fead123ddas",
    status: "published",
    thumbnail:
      "https://raw.githubusercontent.com/creativetimofficial/public-assets/master/vue-argon-design-system/vue-argon-design-system.jpg",
    title: "Vue.js Sample Course",
    updatedAt: Timestamp.now(),
  },
];

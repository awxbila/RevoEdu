export type MockModule = {
  id: number;
  courseId: number;
  title: string;
  type: "pdf" | "ppt" | "video";
  fileUrl: string;
};

export const mockModules: MockModule[] = [
  {
    id: 1,
    courseId: 101,
    title: "HTML & CSS Basics",
    type: "pdf",
    fileUrl: "https://example.com/modules/html-css-basics.pdf",
  },
  {
    id: 2,
    courseId: 101,
    title: "Responsive Layout",
    type: "ppt",
    fileUrl: "https://example.com/modules/responsive-layout.pptx",
  },
  {
    id: 3,
    courseId: 102,
    title: "REST API dengan Express",
    type: "pdf",
    fileUrl: "https://example.com/modules/rest-api-express.pdf",
  },
  {
    id: 4,
    courseId: 102,
    title: "JWT Authentication",
    type: "ppt",
    fileUrl: "https://example.com/modules/jwt-auth.pptx",
  },
  {
    id: 5,
    courseId: 102,
    title: "Deploy Backend ke Cloud",
    type: "video",
    fileUrl: "https://example.com/modules/deploy-backend.mp4",
  },
  {
    id: 6,
    courseId: 103,
    title: "Relational Modeling",
    type: "pdf",
    fileUrl: "https://example.com/modules/relational-modeling.pdf",
  },
];

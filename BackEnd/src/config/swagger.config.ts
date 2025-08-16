import { authDoc } from "../docs/auth.doc";

export const paths = {
  ...authDoc
};

export const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "CollegeGram",
    version: "1.0.0",
    description: "API documentation for collegeGram"
  },
  paths
};

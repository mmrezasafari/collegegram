import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import { globSync } from "glob";
import { Express } from "express";
import merge from "lodash.merge";
import { HttpError } from "../../utility/http-error";

export function setupSwagger(app: Express) {
  try {
    const files = globSync(path.join(__dirname, "../docs/**/**.docs.yaml"));

    const swaggerSpec = {
      openapi: "3.0.0",
      info: {
        title: "CollegeGram",
        version: "1.0.0",
        description: "API documentation for collegeGram"
      },
      paths: {},
      components: {},
    };

    files.forEach((file) => {
      const doc = YAML.load(file);

      if (doc.paths) {
        swaggerSpec.paths = { ...swaggerSpec.paths, ...doc.paths };
      }
      if (doc.components) {
        swaggerSpec.components = merge(swaggerSpec.components, doc.components);
      }

    });
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  } catch (err) {
    throw new HttpError(500, "خطا در بارگذاری swagger")
  }
}

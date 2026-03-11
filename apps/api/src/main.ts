import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { cleanupOpenApiDoc } from "nestjs-zod";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle("domisol Database API")
    .setDescription("Domisol Database with Zod v4 + NestJS validation & serialization")
    .setVersion("1.0")
    .build();

  const rawDocument = SwaggerModule.createDocument(app, config);
  const document = cleanupOpenApiDoc(rawDocument);
  SwaggerModule.setup("api", app, document);

  await app.listen(3001);
  console.log("API running on http://localhost:3001");
  console.log("Swagger UI at http://localhost:3001/api");
}

bootstrap();
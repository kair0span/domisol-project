import { Module } from "@nestjs/common";
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { ZodSerializerInterceptor, ZodValidationPipe } from "nestjs-zod";
import { ZodValidationExceptionFilter } from "./filters/zod-validation-exception.filter";
import { HttpExceptionFilter } from "./filters/http-exception.filter";
import { UsersModule } from "./users/users.module";
import { ScoresModule } from './scores/scores.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from "@nestjs/config";
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), UsersModule, ScoresModule, DatabaseModule, UploadModule],
  providers: [
    { provide: APP_PIPE, useClass: ZodValidationPipe },
    { provide: APP_INTERCEPTOR, useClass: ZodSerializerInterceptor },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_FILTER, useClass: ZodValidationExceptionFilter },
  ],
})
export class AppModule { }
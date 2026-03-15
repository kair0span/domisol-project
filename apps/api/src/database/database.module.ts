import { Module } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import * as userSchema from '../users/schema'
import * as scoreSchema from '../scores/schema'
import { DATABASE_CONNECTION } from './database-connection';

@Module({
    providers: [
        {
            provide: DATABASE_CONNECTION,
            useFactory: (configService: ConfigService) => {
                const pool = new Pool({
                    connectionString: configService.getOrThrow('DATABASE_URL'),
                });
                return drizzle(pool, {
                    schema: {
                        ...userSchema,
                        ...scoreSchema
                    },
                });
            },
            inject: [ConfigService],
        },
    ],
    exports: [DATABASE_CONNECTION],
})
export class DatabaseModule { }
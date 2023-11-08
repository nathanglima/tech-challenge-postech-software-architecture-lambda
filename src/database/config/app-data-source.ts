import 'dotenv/config';
import 'reflect-metadata';
import { DataSource } from "typeorm";

export const PostgresDataSource = new DataSource({
	type: 'postgres',
	host: process.env.DATABASE_HOST,
	port: process.env.DATABASE_PORT as number | undefined,
	username: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASSWORD,
	database: process.env.DATABASE_NAME
})
import "reflect-metadata";
import { DataSource } from "typeorm";
import { Contact } from "../entities/Contact";
import { Client } from "../entities/Client";
import { Agent } from "../entities/Agent";
import { Estate } from "../entities/Estate";
import { Contract } from "../entities/Contract";
import { Request } from "../entities/Request";
import { Offer } from "../entities/Offer";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "root",
    database: "srbd",
    synchronize: false, // Set to false in production
    logging: false,
    entities: [Contact, Client, Agent, Estate, Contract, Request, Offer],
    migrations: ["src/migrations/*.ts"],
    migrationsTableName: "migrations",
    subscribers: [],
}); 
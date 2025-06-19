import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Client } from "./Client";

@Entity()
export class Request {
    @PrimaryGeneratedColumn()
    request_id: number;

    @Column({ type: "varchar", length: 100 })
    request_name: string;

    @Column({ type: "timestamp" })
    request_date: Date;

    @Column({ type: "varchar", length: 50 })
    request_type: string;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    square: number;

    @Column({ type: "decimal", precision: 15, scale: 2 })
    price: number;

    @Column({ type: "char", length: 3, default: "USD" })
    currency: string;

    @Column({ type: "varchar", length: 100 })
    country: string;

    @Column({ type: "varchar", length: 100 })
    city: string;

    @Column({ type: "int", nullable: true })
    rental_period_months?: number;

    @Column({ type: "tinytext", nullable: true })
    notes?: string;

    @Column({ nullable: true })
    client_id?: number;

    @ManyToOne(() => Client, { nullable: true })
    @JoinColumn({ name: "client_id" })
    client?: Client;
} 
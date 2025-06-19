import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Client } from "./Client";
import { Agent } from "./Agent";

@Entity()
export class Offer {
    @PrimaryGeneratedColumn()
    offer_id: number;

    @Column({ type: "varchar", length: 100 })
    offer_name: string;

    @Column({ type: "timestamp" })
    offer_date: Date;

    @Column({ type: "varchar", length: 50 })
    offer_type: string;

    @Column({ type: "tinytext", nullable: true })
    client_feedback?: string;

    @Column({ type: "tinytext", nullable: true })
    notes?: string;

    @Column({ nullable: true })
    client_id?: number;

    @Column({ nullable: true })
    agent_id?: number;

    @ManyToOne(() => Client, { nullable: true })
    @JoinColumn({ name: "client_id" })
    client?: Client;

    @ManyToOne(() => Agent, { nullable: true })
    @JoinColumn({ name: "agent_id" })
    agent?: Agent;
} 
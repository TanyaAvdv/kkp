import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Estate } from "./Estate";
import { Agent } from "./Agent";
import { Client } from "./Client";

@Entity()
export class Contract {
    @PrimaryGeneratedColumn()
    contract_id: number;

    @Column({ type: "varchar", length: 100 })
    contract_name: string;

    @Column({ type: "varchar", length: 50 })
    contract_status: string;

    @Column({ type: "timestamp" })
    signing_date: Date;

    @Column({ type: "timestamp" })
    validity_period: Date;

    @Column({ type: "tinytext", nullable: true })
    notes?: string;

    @Column({ nullable: true })
    estate_id?: number;

    @Column({ nullable: true })
    agent_id?: number;

    @Column({ nullable: true })
    tenant_id?: number;

    @Column({ nullable: true })
    renter_id?: number;

    @ManyToOne(() => Estate, { nullable: true })
    @JoinColumn({ name: "estate_id" })
    estate?: Estate;

    @ManyToOne(() => Agent, { nullable: true })
    @JoinColumn({ name: "agent_id" })
    agent?: Agent;

    @ManyToOne(() => Client, { nullable: true })
    @JoinColumn({ name: "tenant_id" })
    tenant?: Client;

    @ManyToOne(() => Client, { nullable: true })
    @JoinColumn({ name: "renter_id" })
    renter?: Client;
} 
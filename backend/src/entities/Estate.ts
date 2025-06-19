import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Agent } from "./Agent";
import { Client } from "./Client";

@Entity()
export class Estate {
    @PrimaryGeneratedColumn()
    estate_id: number;

    @Column({ type: "varchar", length: 20 })
    estate_name: string;

    @Column({ type: "varchar", length: 50 })
    estate_status: string;

    @Column({ type: "varchar", length: 50 })
    estate_type: string;

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

    @Column({ type: "varchar", length: 20 })
    postal_code: string;

    @Column({ type: "varchar", length: 100 })
    street: string;

    @Column({ type: "varchar", length: 100 })
    placement_num: string;

    @Column({ type: "varchar", length: 20 })
    estate_rating: string;

    @Column({ type: "tinytext", nullable: true })
    notes?: string;

    @Column({ nullable: true })
    agent_id?: number;

    @Column({ nullable: true })
    tenant_id?: number;

    @ManyToOne(() => Agent, { nullable: true })
    @JoinColumn({ name: "agent_id" })
    agent?: Agent;

    @ManyToOne(() => Client, { nullable: true })
    @JoinColumn({ name: "tenant_id" })
    tenant?: Client;
} 
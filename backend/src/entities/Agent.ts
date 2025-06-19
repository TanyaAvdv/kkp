import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Contact } from "./Contact";

@Entity()
export class Agent {
    @PrimaryGeneratedColumn()
    agent_id: number;

    @Column({ type: "varchar", length: 20 })
    agent_rating: string;

    @Column({ type: "varchar", length: 30 })
    post_name: string;

    @Column({ type: "decimal", precision: 15, scale: 2 })
    salary: number;

    @Column({ type: "char", length: 3, default: "USD" })
    currency: string;

    @Column({ type: "timestamp" })
    hiring_date: Date;

    @Column({ type: "timestamp", nullable: true })
    dismissal_date?: Date;

    @Column({ type: "varchar", length: 30 })
    department_name: string;

    @Column({ nullable: true })
    contact_id?: number;

    @ManyToOne(() => Contact, { nullable: true })
    @JoinColumn({ name: "contact_id" })
    contact?: Contact;
} 
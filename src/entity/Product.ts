import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Order } from './Order';  // Adjust the path based on your file structure

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    price: number;

    @Column({ nullable: true })
    description: string;

    @Column()
    inventory: number;

    // One-to-many relationship from the Product side
    @OneToMany(() => Order, (order) => order.product)
    orders: Order[];
}

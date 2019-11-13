import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, nullable: true })
  fullName: string;

  @Column('date')
  birthday: Date;

  @Column()
  isActive: boolean;

  @Column({ length: 128, nullable: true })
  username: string;

  @Column({ length: 255, nullable: true })
  password: string;

  @Column("timestamp", { precision: 3, default: () => "CURRENT_TIMESTAMP(3)", onUpdate: "CURRENT_TIMESTAMP(3)" })
  time_stamp: Date;
}

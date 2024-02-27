import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RunConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @Column()
  key: string;

  @Column()
  value: string;
}

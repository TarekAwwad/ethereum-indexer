import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ForeignKeyMetadata } from 'typeorm/metadata/ForeignKeyMetadata';

const DEFAUL_ADDRESS = '0x';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 66 })
  hash: string;

  @Column()
  block_height: number;

  @Column({ type: 'varchar', length: 42, default: DEFAUL_ADDRESS })
  sender_address: string;

  @Column({ enum: ['pending', 'completed'] })
  status: string;

  @Column({ default: false })
  success: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({ default: false })
  isCHZ: boolean;
}

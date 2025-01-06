import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('resources')
export class Resource {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  type: string;

  @Column()
  provider: string;

  @Column()
  url: string;

  @Column('text')
  description: string;

  @Column()
  subject: string;

  @Column()
  level: string;

  @Column('boolean', { default: true })
  isFree: boolean;

  @Column('simple-array')
  tags: string[];

  @CreateDateColumn()
  createdAt: Date;
}

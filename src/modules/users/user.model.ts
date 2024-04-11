import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Token } from '../tokens/tokens.model';

type UserCreationAttributes = {
  email: string;
  password: string;
};

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttributes> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    unique: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @HasMany(() => Token, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  refreshTokens: Token[];
}

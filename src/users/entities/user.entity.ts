import { Column, Entity } from 'typeorm';
import { CoreEntity } from '../../common/entities/base_entity';
import { Exclude } from 'class-transformer';

@Entity('users')
export class UserEntity extends CoreEntity {
  @Column({
    unique: true,
    nullable: false, // 기본 false 이나 명시.
  })
  email!: string;

  @Column({
    unique: true,
    nullable: false,
  })
  nickname!: string;

  @Exclude({
    toPlainOnly: true,
  })
  @Column({
    select: false, // password 공개 여부 X
  })
  password!: string;

  // TODO auth 완료 후 추가 예정
  // role,
}

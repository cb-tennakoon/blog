import {
  IsString,
  IsInt,
  IsDate,
  IsOptional,
  IsEmail,
  IsUUID,
  MinLength,
  IsIn,
} from 'class-validator';

export class AuthorResponseDtoWithID {
  @IsInt()
  authorId: number;

  @IsString()
  username: string;

  @IsString()
  email: string;

  @IsString()
  @IsOptional()
  firstName: string | null;

  @IsString()
  @IsOptional()
  lastName: string | null;

  @IsString()
  @IsOptional()
  roleId: string | null;

  @IsDate()
  createdAt: Date;
}
export class AuthorResponseDto {
  @IsInt()
  authorId: number;

  @IsString()
  username: string;

  @IsString()
  email: string;

  @IsString()
  @IsOptional()
  firstName: string | null;

  @IsString()
  @IsOptional()
  lastName: string | null;

  @IsString()
  @IsOptional()
  roleId: string | null;

  @IsDate()
  createdAt: Date;
}
export class CreateAuthorDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  @IsIn(['author', 'admin', 'editor'], {
    message: 'roleName must be one of: author, admin, editor',
  })
  roleName?: string;
}
export class LoginAuthorDto {
  @IsString()
  emailOrUsername: string;

  @IsString()
  @MinLength(8)
  password: string;
}
export class LoginResponseDto {
  @IsString()
  access_token: string;

  @IsString()
  author: AuthorResponseDto;
}
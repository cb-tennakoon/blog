import { Injectable } from '@nestjs/common';


// This should be a real class/interface representing a user entity
// Define the User interface
// Add this interface
export interface User {
  userId: number;
  username: string;
  password: string;
}


@Injectable()
export class UserService {
  private readonly users: User[] = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
    },
    { userId: 3, username: 'test', password: 'test' }, // Add test user
  ];

  findOne(username: string): User | undefined {
    return this.users.find((user) => user.username === username)
  }
}

// src/app/dto/user.dto.ts
export interface UserDTO {
  id: number;
  name: string;      // changed from username
  email: string;
  // do NOT include password in DTO for security
  // optional: include role if needed
}

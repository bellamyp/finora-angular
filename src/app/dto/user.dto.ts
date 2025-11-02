// src/app/dto/user.dto.ts
export interface UserDTO {
  id: number;
  name: string;      // changed from username
  email: string;
  role: string; // just the role name, e.g., "ROLE_ADMIN"
  // do NOT include password in DTO for security
}

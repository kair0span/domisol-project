import { z } from "zod";

export const UserRole = z.enum(["admin", "user", "moderator"]);
export type UserRole = z.infer<typeof UserRole>;

export const UserSchema = z
  .object({
    id: z.string().uuid(),
    name: z.string().min(1, "Name is required").max(100),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: UserRole,
    createdAt: z.iso.datetime(),
  })
  .meta({ id: "User" });

export type User = z.infer<typeof UserSchema>;

export const CreateUserSchema = UserSchema.omit({
  id: true,
  createdAt: true,
}).meta({ id: "CreateUser" });

export type CreateUser = z.infer<typeof CreateUserSchema>;

export const UpdateUserSchema = CreateUserSchema.partial().meta({
  id: "UpdateUser",
});

export type UpdateUser = z.infer<typeof UpdateUserSchema>;

export const UserResponseSchema = UserSchema.meta({ id: "UserResponse" });
export type UserResponse = z.infer<typeof UserResponseSchema>;

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useForm } from "@tanstack/react-form";

import type { SignupFormData } from "@/lib/auth/schema";
import { signupSchema } from "@/lib/auth/schema";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { useState } from "react";

interface SignupFormProps {
  onSubmit: (data: SignupFormData) => Promise<void>;
}

export function SignupForm({ onSubmit }: SignupFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { Field, handleSubmit } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      console.log(value);
    },
    validators: {
      onSubmit: signupSchema,
      onBlur: signupSchema,
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="w-full max-w-md mx-auto"
    >
      <Card>
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
          <CardDescription>
            Enter your information to create a new account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field name="name">
            {(field) => {
              const { errors, isTouched } = field.state.meta;
              return (
                <div className="w-full flex flex-col gap-2">
                  <Label htmlFor="name">
                    Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={() => field.handleBlur()}
                  />
                  {errors.length > 0 && isTouched && (
                    <span className="text-red-500">{errors[0]?.message}</span>
                  )}
                </div>
              );
            }}
          </Field>
          <Field name="email">
            {(field) => {
              const { errors, isTouched } = field.state.meta;
              return (
                <div className="w-full flex flex-col gap-2">
                  <Label htmlFor="email">
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="text"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={() => field.handleBlur()}
                  />
                  {errors.length > 0 && isTouched && (
                    <span className="text-red-500">{errors[0]?.message}</span>
                  )}
                </div>
              );
            }}
          </Field>
          <Field name="password">
            {(field) => {
              const { errors, isTouched } = field.state.meta;
              return (
                <div className="w-full flex flex-col gap-2">
                  <Label htmlFor="password">
                    Password <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={() => field.handleBlur()}
                  />
                  {errors.length > 0 && isTouched && (
                    <span className="text-red-500">{errors[0]?.message}</span>
                  )}
                </div>
              );
            }}
          </Field>
          <Field name="confirmPassword">
            {(field) => {
              const { errors, isTouched } = field.state.meta;
              return (
                <div className="w-full flex flex-col gap-2">
                  <Label htmlFor="confirmPassword">
                    Confirm Password <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={() => field.handleBlur()}
                  />
                  {errors.length > 0 && isTouched && (
                    <span className="text-red-500">{errors[0]?.message}</span>
                  )}
                </div>
              );
            }}
          </Field>
        </CardContent>
        <CardFooter>
          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Create account"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

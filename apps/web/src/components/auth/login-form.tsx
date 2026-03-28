import { loginSchema, type LoginFormData } from "#/lib/auth/schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "@tanstack/react-form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
}

export function LoginForm({ onSubmit }: LoginFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
  const { Field, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      console.log(value);
    },
    validators: {
      onSubmit: loginSchema,
      onBlur: loginSchema,
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
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
          <CardDescription>
            Enter your credentials to acces your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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

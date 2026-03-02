"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useLink, useLogin } from "@refinedev/core";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const userSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type UserFormData = z.infer<typeof userSchema>;

export const SignInForm = () => {
  const Link = useLink();

  const { mutate: login, isPending: isLoggingIn } = useLogin();

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: UserFormData) => {
    login({
      email: values.email,
      password: values.password,
    });
  };

  return (
    <div
      className={cn(
        "flex",
        "flex-col",
        "items-center",
        "justify-center",
        "px-6",
        "py-8",
        "min-h-svh",
      )}
    >
      <img src="/logo.svg" alt="Logo" width={70} height={70} loading="lazy" />

      <Card className={cn("sm:w-114", "p-12", "mt-6")}>
        <CardHeader className={cn("px-0")}>
          <CardTitle
            className={cn(
              "text-blue-600",
              "dark:text-blue-400",
              "text-3xl",
              "font-semibold",
            )}
          >
            Sign in to OrderFlow
          </CardTitle>
          <CardDescription
            className={cn("text-muted-foreground", "font-medium")}
          >
            Enter your credentials to access the dashboard
          </CardDescription>
        </CardHeader>

        <Separator />

        <CardContent className={cn("px-0")}>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 max-w-md"
            >
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john@email.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-blue-600"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter>
          <div className={cn("w-full", "text-center text-sm")}>
            <span className={cn("text-sm", "text-muted-foreground")}>
              Don't have an account?{" "}
            </span>
            <Link
              to="/register"
              className="text-blue-600 underline font-semibold"
            >
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

SignInForm.displayName = "SignInForm";

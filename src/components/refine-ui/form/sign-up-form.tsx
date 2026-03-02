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
import { useLink, useRegister } from "@refinedev/core";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),

  email: z.string().email("Invalid email address"),

  password: z.string().min(8, "Password must be at least 8 characters"),

  role: z.enum(["admin", "staff"], {
    required_error: "Role is required",
  }),
});

type UserFormData = z.infer<typeof userSchema>;

export const SignUpForm = () => {
  const Link = useLink();

  const { mutate: register, isPending: isRegistering } = useRegister();

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "staff",
    },
  });

  const onSubmit = async (values: UserFormData) => {
    try {
      register(
        {
          ...values,
        },
        {
          onSuccess: (data) => {
            if (data.success === false) {
              toast.error(data.error?.message, {
                richColors: true,
              });
              return;
            }

            toast.success("Account created successfully!", {
              richColors: true,
            });
            form.reset();
          },
        },
      );
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registartion failed", {
        richColors: true,
      });
    }
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
            OrderFlow
          </CardTitle>
          <CardDescription
            className={cn("text-muted-foreground", "font-medium")}
          >
            Sign up to manage orders, customers & staff.
          </CardDescription>
        </CardHeader>

        <Separator />

        <CardContent className={cn("px-0")}>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 max-w-md"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

              {/* Role */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-blue-600"
                disabled={isRegistering}
              >
                {isRegistering ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter>
          <div className={cn("w-full", "text-center text-sm")}>
            <span className={cn("text-sm", "text-muted-foreground")}>
              Have an account?{" "}
            </span>
            <Link to="/login" className="text-blue-600 underline font-semibold">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

SignUpForm.displayName = "SignUpForm";

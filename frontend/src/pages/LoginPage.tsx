import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import "../App.css";
import { useNavigate } from "react-router-dom";
type formField = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const navigate = useNavigate();
  const form = useForm<formField>();
  const onSubmit = (data: formField) => {
  console.log(data);
  // Mock login logic - in real app, validate user
  localStorage.setItem("isLoggedIn", "true");
  navigate("/home");
};


  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fbc2eb] via-[#a6c1ee] to-[#fbc2eb] flex items-center justify-center overflow-hidden relative">
      {/* Floating Clouds */}
      <div className="cloud cloud1" />
      <div className="cloud cloud2" />
      <div className="cloud cloud3" />

      {/* Login Box */}
      <div className="fade-in backdrop-blur-lg bg-white/30 shadow-xl rounded-xl p-8 w-[90%] max-w-md z-10">
        <h2 className="text-3xl font-semibold text-center text-blue-800 mb-6">
          Welcome Back to Memory Lane
        </h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 p-4 border rounded w-full max-w-sm"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;

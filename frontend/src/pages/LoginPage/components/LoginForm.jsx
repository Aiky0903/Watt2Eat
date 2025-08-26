import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserStore } from "@/store/userStore";
import { useState } from "react";

const FormField = ({ label, id, children }) => {
  return (
    <div className="grid w-full max-w-sm items-center gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
};

const LoginForm = () => {
  // TODO: Use this state to control the show password button
  const [showPassword, setShowPassword] = useState(false);

  // Form to be submitted to the backend
  const [formData, setFormData] = useState({
    studentID: "",
    username: "",
    password: "",
  });

  const { loginUser, isLoggingIn } = useUserStore();

  // Submit function for form
  const handleSubmit = async (e) => {
    e.preventDefault();
    loginUser(formData);
  };

  return (
    // TODO: Make this prettier
    <form
      onSubmit={handleSubmit}
      className="grid w-full items-center gap-6 px-4"
    >
      <FormField label="Student ID" id="studentID">
        <Input
          type="text"
          placeholder="H00123456"
          id="studentID"
          value={formData.studentID}
          onChange={(e) =>
            setFormData({ ...formData, studentID: e.target.value })
          }
        />
      </FormField>
      <FormField label="Username" id="username">
        <Input
          type="text"
          placeholder="Username"
          id="username"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
        />
      </FormField>
      <FormField label="Password" id="password">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          id="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
      </FormField>
      <div className="flex flex-col items-center justify-center gap-4">
        <Button type="submit" disabled={isLoggingIn} size="auth">
          {isLoggingIn ? "Logging in..." : "Log in"}
        </Button>
        <div className="font-poppins">
          Don't have an account? <a href="/signup" className="underline">Sign up</a>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;

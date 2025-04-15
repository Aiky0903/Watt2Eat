import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/store/userStore";
import { useState } from "react";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    studentID: "",
    username: "",
    password: "",
  });
  const { loginUser, isLoggingIn } = useUserStore();
  const handleSubmit = async (e) => {
    e.preventDefault();
    loginUser(formData);
  };
  return (
    <form onSubmit={handleSubmit}>
      LoginPage
      <Input
        type="text"
        placeholder="Student ID"
        value={formData.studentID}
        onChange={(e) =>
          setFormData({ ...formData, studentID: e.target.value })
        }
      />
      <Input
        type="text"
        placeholder="Username"
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
      />
      <Input
        type={showPassword ? "text" : "password"}
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
      <Button type="submit" disabled={isLoggingIn}>
        {isLoggingIn ? "Logging in..." : "Sign in"}
      </Button>
    </form>
  );
};

export default LoginPage;

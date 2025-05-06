import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/store/userStore";
import { useState } from "react";

const SignUpForm = () => {
  // TODO: Use this state to control the show password button
  const [showPassword, setShowPassword] = useState(false);

  // Form to be submitted to the backend
  const [formData, setFormData] = useState({
    studentID: "",
    username: "",
    email: "",
    phone: "",
  });

  // Zustand user store
  const { registerUser, isSigningUp } = useUserStore();

  // Submit function for form
  const handleSubmit = async (e) => {
    e.preventDefault();
    registerUser(formData);
  };

  return (
    // TODO: Make this prettier
    <form onSubmit={handleSubmit}>
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
        type="text"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <Input
        type={showPassword ? "text" : "password"}
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
      <Button type="submit" disabled={isSigningUp}>
        {isSigningUp ? "Registering..." : "Register"}
      </Button>
    </form>
  );
};

export default SignUpForm;

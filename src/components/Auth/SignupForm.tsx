import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Facebook } from "lucide-react";

interface SignupFormProps {
  switchToLogin: () => void;
  onSuccess: () => void;
}

const SignupForm = ({ switchToLogin, onSuccess }: SignupFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signup, loginWithGoogle, loginWithFacebook } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await signup(name, email, password);
      onSuccess(); // ✅ close modal
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Create Account</CardTitle>
        <CardDescription className="text-center">
          Join ImmigrantConnect to find friends, accommodations, and more!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Button type="submit" className="w-full bg-primary hover:bg-secondary" disabled={isLoading}>
            {isLoading ? "Creating..." : "Sign Up"}
          </Button>
        </form>

        <div className="text-center mt-4 text-sm text-gray-500">
          Already have an account?{" "}
          <span className="text-primary cursor-pointer hover:underline" onClick={switchToLogin}>
            Login
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignupForm;

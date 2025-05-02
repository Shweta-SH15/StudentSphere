import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultView?: "login" | "signup";
}

const AuthModal = ({ isOpen, onClose, defaultView = "login" }: AuthModalProps) => {
  const [view, setView] = useState<"login" | "signup">(defaultView);

  useEffect(() => {
    if (!isOpen) setView(defaultView);
  }, [isOpen, defaultView]);

  const handleSuccess = () => {
    onClose(); // ✅ close modal on successful login/signup
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        {view === "login" ? (
          <LoginForm onSuccess={handleSuccess} switchToSignup={() => setView("signup")} />
        ) : (
          <SignupForm onSuccess={handleSuccess} switchToLogin={() => setView("login")} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;

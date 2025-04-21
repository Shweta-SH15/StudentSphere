
import { useState } from "react";
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        {view === "login" ? (
          <LoginForm />
        ) : (
          <SignupForm />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;

// components/SocialLoginButton.tsx
import { Button } from "@/components/ui/button";
import { FC, ReactNode } from "react";

interface SocialLoginButtonProps {
  children: ReactNode;
  onClick?: () => void;
}

const SocialLoginButton: FC<SocialLoginButtonProps> = ({
  children,
  onClick,
}) => {
  return (
    <Button
      variant="outline"
      className="w-full justify-center gap-2 border-gray-300 hover:bg-gray-100 transition"
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export default SocialLoginButton;

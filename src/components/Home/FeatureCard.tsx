
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  path: string;
  color: string;
}

const FeatureCard = ({ title, description, icon, path, color }: FeatureCardProps) => {
  const colorMap = {
    "bg-accent-purple": "border-purple-500 text-purple-500",
    "bg-accent-green": "border-primary text-primary",
    "bg-accent-orange": "border-secondary text-secondary",
    "bg-accent-blue": "border-tertiary text-tertiary"
  };

  const textColor = colorMap[color as keyof typeof colorMap] || "border-primary text-primary";
  
  return (
    <Card className="bg-card bg-opacity-30 border border-opacity-20 hover:border-opacity-50 transition-all duration-300">
      <CardHeader>
        <div className="flex justify-center">
          <div className="w-16 h-16 flex items-center justify-center">
            {icon}
          </div>
        </div>
        <CardTitle className={`text-center mt-2 ${textColor.split(' ')[1]}`}>{title}</CardTitle>
      </CardHeader>
      <CardContent className="py-4">
        <CardDescription className="text-center text-gray-400 text-sm">
          {description}
        </CardDescription>
      </CardContent>
      <CardFooter className="pt-0 flex justify-center">
        <Button asChild variant="outline" className={`${textColor} hover:bg-white hover:bg-opacity-5`}>
          <Link to={path}>Explore</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FeatureCard;

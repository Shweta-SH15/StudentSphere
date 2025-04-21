
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
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
      <CardHeader className={`${color} rounded-t-lg`}>
        <div className="flex justify-center">
          <div className="w-16 h-16 flex items-center justify-center text-4xl">
            {icon}
          </div>
        </div>
        <CardTitle className="text-center mt-2">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow py-4">
        <CardDescription className="text-center text-gray-600 text-sm">
          {description}
        </CardDescription>
      </CardContent>
      <CardFooter className="pt-0">
        <Button asChild className="w-full bg-primary hover:bg-secondary">
          <Link to={path}>Explore Now</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FeatureCard;

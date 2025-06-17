import { Button } from "@/components/ui/button";
import { ChevronRightIcon } from "lucide-react";
import React from "react";

const ButtonExample = () => {
  return (
    <div>
      ButtonExample
      <Button variant="destructive">Button</Button>
      <Button variant="secondary" size="icon" className="bg-orange-700 size-8">
      <ChevronRightIcon />
    </Button>
    </div>
  );
};

export default ButtonExample;

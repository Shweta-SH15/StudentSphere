
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FilterOption {
  id: string;
  name: string;
  values: string[];
}

interface FilterBarProps {
  options: FilterOption[];
  onFilterChange: (filterId: string, value: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ options, onFilterChange }) => {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});

  const handleFilterChange = (filterId: string, value: string) => {
    setSelectedFilters({
      ...selectedFilters,
      [filterId]: value,
    });
    onFilterChange(filterId, value);
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 md:justify-center">
      {options.map((option) => (
        <DropdownMenu key={option.id}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="min-w-[120px] justify-between">
              <span>{option.name}</span>
              <span className="ml-2 text-xs font-normal opacity-60">
                {selectedFilters[option.id] || "Any"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[200px]">
            <DropdownMenuLabel>{option.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={selectedFilters[option.id] || ""}
              onValueChange={(value) => handleFilterChange(option.id, value)}
            >
              <DropdownMenuRadioItem value="">Any</DropdownMenuRadioItem>
              {option.values.map((value) => (
                <DropdownMenuRadioItem key={value} value={value}>
                  {value}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ))}
    </div>
  );
};

export default FilterBar;

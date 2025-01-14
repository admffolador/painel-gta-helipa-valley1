import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, Loader2, Search } from "lucide-react";
import { useState } from "react";

interface Employee {
  id: string;
  full_name: string;
  created_at: string;
}

interface EmployeeSelectorProps {
  employees: Employee[];
  selectedEmployee: string | null;
  onSelectEmployee: (employee: string | null) => void;
  isLoading?: boolean;
}

export const EmployeeSelector = ({
  employees,
  selectedEmployee,
  onSelectEmployee,
  isLoading = false,
}: EmployeeSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEmployees = employees
    .filter(employee =>
      employee.full_name.toUpperCase().includes(searchTerm.toUpperCase())
    )
    .sort((a, b) => a.full_name.localeCompare(b.full_name));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Carregando...</span>
            </div>
          ) : (
            <>
              {selectedEmployee || "Selecione um funcionário"}
              <ChevronDown className="h-4 w-4" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <div className="px-2 py-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar funcionário..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        {filteredEmployees.map((employee) => (
          <DropdownMenuItem
            key={employee.id}
            onClick={() => onSelectEmployee(employee.full_name)}
          >
            {employee.full_name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
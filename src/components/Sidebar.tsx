import { useState } from "react";
import { format } from "date-fns";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EmployeeSelector } from "./sidebar/EmployeeSelector";
import { StatusFilter } from "./sidebar/StatusFilter";
import { AddEmployeeForm } from "./sidebar/AddEmployeeForm";
import { useEmployeeManagement } from "@/hooks/useEmployeeManagement";

interface SidebarProps {
  selectedEmployee: string | null;
  setSelectedEmployee: (employee: string | null) => void;
  selectedStatus: string | null;
  setSelectedStatus: (status: string | null) => void;
}

export const Sidebar = ({
  selectedEmployee,
  setSelectedEmployee,
  selectedStatus,
  setSelectedStatus,
}: SidebarProps) => {
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const {
    employees,
    totalEmployees,
    isLoading,
    addEmployee,
    deleteEmployee
  } = useEmployeeManagement();

  const selectedEmployeeData = employees.find(emp => emp.full_name === selectedEmployee);

  const handleDeleteEmployee = async () => {
    if (!selectedEmployee || !selectedEmployeeData) {
      return;
    }

    try {
      const success = await deleteEmployee(selectedEmployeeData.id);
      if (success) {
        setSelectedEmployee(null);
        setShowDeleteDialog(false);
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  return (
    <>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Deseja realmente excluir o funcionário {selectedEmployee}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteEmployee}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <aside className="h-screen w-80 border-r bg-background px-6 py-12">
        <div className="flex flex-col h-full">
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <EmployeeSelector
                  employees={employees}
                  selectedEmployee={selectedEmployee}
                  onSelectEmployee={setSelectedEmployee}
                  isLoading={isLoading}
                />
              </div>
              {selectedEmployee && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowDeleteDialog(true)}
                  className="ml-2"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              )}
            </div>

            <AddEmployeeForm
              onAddEmployee={addEmployee}
              isAddingEmployee={isAddingEmployee}
              setIsAddingEmployee={setIsAddingEmployee}
            />

            {selectedEmployeeData && (
              <div className="text-sm text-muted-foreground">
                Funcionário adicionado em {format(new Date(selectedEmployeeData.created_at), 'dd/MM/yyyy')}
              </div>
            )}

            <StatusFilter
              selectedStatus={selectedStatus}
              onStatusSelect={setSelectedStatus}
              totalEmployees={totalEmployees}
            />
          </div>
        </div>
      </aside>
    </>
  );
};
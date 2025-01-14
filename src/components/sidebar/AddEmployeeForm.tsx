import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useState } from "react";

interface AddEmployeeFormProps {
  onAddEmployee: (name: string) => Promise<boolean>;
  isAddingEmployee: boolean;
  setIsAddingEmployee: (isAdding: boolean) => void;
}

export const AddEmployeeForm = ({
  onAddEmployee,
  isAddingEmployee,
  setIsAddingEmployee,
}: AddEmployeeFormProps) => {
  const [newName, setNewName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!newName.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const success = await onAddEmployee(newName);
      if (success) {
        setNewName("");
        setIsAddingEmployee(false);
      }
    } catch (error) {
      console.error('Error adding employee:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAddingEmployee) {
    return (
      <Button
        variant="outline"
        className="w-full"
        onClick={() => setIsAddingEmployee(true)}
      >
        <Plus className="h-4 w-4 mr-2" />
        Adicionar funcionário
      </Button>
    );
  }

  return (
    <div className="flex gap-2">
      <Input
        placeholder="Nome do funcionário"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        className="uppercase"
        disabled={isSubmitting}
      />
      <Button 
        onClick={handleSubmit}
        disabled={isSubmitting || !newName.trim()}
      >
        {isSubmitting ? "Adicionando..." : "Adicionar"}
      </Button>
    </div>
  );
};
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Employee {
  id: string;
  full_name: string;
  created_at: string;
}

interface FetchEmployeesResponse {
  data: Employee[];
  count: number;
}

export const useEmployeeManagement = () => {
  const queryClient = useQueryClient();

  const fetchEmployees = async (): Promise<FetchEmployeesResponse> => {
    const [{ data: employees, error: fetchError }, { count, error: countError }] = await Promise.all([
      supabase
        .from('profiles')
        .select('id, full_name, created_at')
        .order('full_name'),
      supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
    ]);

    if (fetchError) throw fetchError;
    if (countError) throw countError;

    return {
      data: employees || [],
      count: count || 0
    };
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['employees'],
    queryFn: fetchEmployees,
  });

  const addEmployeeMutation = useMutation({
    mutationFn: async (newName: string): Promise<boolean> => {
      if (!newName.trim()) {
        throw new Error("Nome inválido");
      }

      const normalizedNewName = newName.trim().toUpperCase();

      const { data: existingEmployees } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('full_name', normalizedNewName);

      if (existingEmployees && existingEmployees.length > 0) {
        throw new Error("Já existe um funcionário com este nome. Por favor, escolha um nome diferente.");
      }

      const { error } = await supabase
        .from('profiles')
        .insert({
          full_name: normalizedNewName
        });

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success("Funcionário adicionado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });

  const deleteEmployeeMutation = useMutation({
    mutationFn: async (employeeId: string): Promise<boolean> => {
      console.log('Deleting time records for user:', employeeId);
      const { error: timeRecordsError } = await supabase
        .from('time_records')
        .delete()
        .eq('user_id', employeeId);

      if (timeRecordsError) throw timeRecordsError;

      console.log('Deleting profile:', employeeId);
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', employeeId);

      if (profileError) throw profileError;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success("Funcionário removido com sucesso!");
    },
    onError: (error: any) => {
      console.error('Error in deletion process:', error);
      toast.error("Erro ao remover funcionário");
    }
  });

  return {
    employees: data?.data || [],
    totalEmployees: data?.count || 0,
    isLoading,
    error,
    addEmployee: async (name: string) => {
      await addEmployeeMutation.mutateAsync(name);
      return true;
    },
    deleteEmployee: async (id: string) => {
      await deleteEmployeeMutation.mutateAsync(id);
      return true;
    }
  };
};

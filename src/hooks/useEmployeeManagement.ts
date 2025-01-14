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

const PAGE_SIZE = 10;

export const useEmployeeManagement = (page: number = 1) => {
  const queryClient = useQueryClient();

  const fetchEmployees = async (pageParam: number): Promise<FetchEmployeesResponse> => {
    console.log('Fetching employees for page:', pageParam);
    const start = (pageParam - 1) * PAGE_SIZE;
    
    const [{ data: employees, error: fetchError }, { count, error: countError }] = await Promise.all([
      supabase
        .from('profiles')
        .select('id, full_name, created_at')
        .range(start, start + PAGE_SIZE - 1)
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
    queryKey: ['employees', page],
    queryFn: () => fetchEmployees(page),
  });

  const addEmployeeMutation = useMutation({
    mutationFn: async (newName: string): Promise<boolean> => {
      if (!newName.trim()) {
        throw new Error("Nome inválido");
      }

      const normalizedNewName = newName.trim().toUpperCase();

      // Check for existing employee with the same name
      const { data: existingEmployees, error: checkError } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('full_name', normalizedNewName);

      if (checkError) {
        console.error('Error checking for existing employee:', checkError);
        throw new Error("Erro ao verificar funcionário existente");
      }

      if (existingEmployees && existingEmployees.length > 0) {
        throw new Error("Já existe um funcionário com este nome. Por favor, escolha um nome diferente.");
      }

      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          full_name: normalizedNewName
        });

      if (insertError) {
        console.error('Error inserting employee:', insertError);
        throw new Error("Erro ao adicionar funcionário");
      }

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
    },
    totalPages: Math.ceil((data?.count || 0) / PAGE_SIZE)
  };
};
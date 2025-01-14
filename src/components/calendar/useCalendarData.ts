import { useState, useEffect } from "react";
import { format, startOfDay } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type MarkedDate = {
  date: Date;
  color: string;
};

export const getColorForStatus = (status: string) => {
  switch (status.toLowerCase()) {
    case "entregue":
      return "#10B981"; // Emerald green
    case "meio-entregue":
      return "#F59E0B"; // Amber/Mustard yellow
    case "devendo":
      return "#EF4444"; // Red
    case "liberado":
      return "#3B82F6"; // Blue
    case "incompleto":
      return "#6B7280"; // Gray
    default:
      return "#D1D5DB"; // Light gray for unknown status
  }
};

export const useCalendarData = (
  selectedEmployee: string | null,
  selectedStatus: string | null
) => {
  const [markedDates, setMarkedDates] = useState<MarkedDate[]>([]);

  const fetchRecords = async () => {
    try {
      if (!selectedEmployee) {
        setMarkedDates([]);
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('full_name', selectedEmployee)
        .maybeSingle();

      if (!profile) {
        setMarkedDates([]);
        return;
      }

      const { data: records, error } = await supabase
        .from('time_records')
        .select(`
          *,
          profiles:user_id (
            full_name
          )
        `)
        .eq('user_id', profile.id);

      if (error) throw error;

      const marks = records?.map(record => ({
        date: new Date(record.record_date + 'T00:00:00'),
        color: getColorForStatus(record.status)
      })) || [];

      setMarkedDates(marks);
    } catch (error) {
      console.error('Error fetching records:', error);
      toast.error("Erro ao carregar registros");
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [selectedEmployee]);

  const getDateColor = (date: Date) => {
    const markedDate = markedDates.find(
      md => format(md.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
    return markedDate?.color;
  };

  const handleDateClick = async (date: Date) => {
    if (!selectedEmployee || !selectedStatus) {
      toast.error("Selecione um funcionário e um status");
      return;
    }

    try {
      // First get the current authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Usuário não autenticado");
        return;
      }

      // Then get the profile ID for the selected employee
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('full_name', selectedEmployee)
        .maybeSingle();

      if (!profile) {
        toast.error("Funcionário não encontrado");
        return;
      }

      const formattedDate = format(startOfDay(date), 'yyyy-MM-dd');

      // Check if record exists
      const { data: existingRecord } = await supabase
        .from('time_records')
        .select('*')
        .eq('user_id', profile.id)
        .eq('record_date', formattedDate)
        .maybeSingle();

      if (existingRecord) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('time_records')
          .update({ 
            status: selectedStatus,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingRecord.id);

        if (updateError) throw updateError;
        toast.success("Registro atualizado com sucesso!");
      } else {
        // Create new record
        const { error: insertError } = await supabase
          .from('time_records')
          .insert({
            user_id: profile.id,
            record_date: formattedDate,
            status: selectedStatus
          });

        if (insertError) throw insertError;
        toast.success("Registro adicionado com sucesso!");
      }

      // Refresh calendar data
      await fetchRecords();
    } catch (error) {
      console.error('Error handling date click:', error);
      toast.error("Erro ao registrar data");
    }
  };

  return { 
    getDateColor,
    refreshCalendar: fetchRecords,
    handleDateClick
  };
};
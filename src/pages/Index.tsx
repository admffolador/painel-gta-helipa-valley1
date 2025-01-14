import { Calendar } from "@/components/Calendar";
import { Sidebar } from "@/components/Sidebar";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Index = () => {
  const year = 2025;
  const navigate = useNavigate();
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };
  
  return (
    <div className="min-h-screen flex">
      <Sidebar 
        selectedEmployee={selectedEmployee}
        setSelectedEmployee={setSelectedEmployee}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />
      <main className="flex-1 p-6">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button className="p-2">
              ☰
            </button>
            <span className="text-2xl">{year}</span>
          </div>
          <h1 className="text-3xl font-bold text-red-600">PAINEL GTA</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Sair
          </button>
        </header>
        <Calendar 
          year={year} 
          selectedEmployee={selectedEmployee}
          selectedStatus={selectedStatus}
        />
      </main>
    </div>
  );
};

export default Index;
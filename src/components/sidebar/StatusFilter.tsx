interface StatusFilterProps {
  selectedStatus: string | null;
  onStatusSelect: (status: string | null) => void;
}

export const StatusFilter = ({ selectedStatus, onStatusSelect }: StatusFilterProps) => {
  const statusOptions = [
    { label: "FARM/ENTREGUE", color: "bg-emerald-500", value: "entregue" },
    { label: "1/2-FARM/ENTREGUE", color: "bg-amber-500", value: "meio-entregue" },
    { label: "DEVENDO/FARM", color: "bg-red-500", value: "devendo" },
    { label: "FARM/DISPENSADO", color: "bg-blue-500", value: "liberado" },
    { label: "FARM/INCOMPLETO", color: "bg-gray-500", value: "incompleto" },
  ];

  const handleStatusSelect = (status: string) => {
    if (selectedStatus === status) {
      onStatusSelect(null);
    } else {
      onStatusSelect(status);
    }
  };

  return (
    <div className="space-y-2">
      {statusOptions.map((status) => (
        <button
          key={status.value}
          onClick={() => handleStatusSelect(status.value)}
          className={`flex items-center gap-2 w-full p-2 rounded transition-colors ${
            selectedStatus === status.value ? 'bg-accent' : 'hover:bg-accent/50'
          }`}
        >
          <div className={`w-3 h-3 rounded-full ${status.color}`} />
          <span>{status.label}</span>
        </button>
      ))}
    </div>
  );
};
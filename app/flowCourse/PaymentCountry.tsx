import { NodeProps, Handle, Position } from "reactflow";
export default function PaymentCountry({
  data: { country, currency, icon },
}: NodeProps<{ country: string; currency: string; icon: string }>) {
  return (
    <div className="p-2 flex items-center border border-green-700 rounded">
      <div className="pr-2">
        {icon === "US" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2L2 7h20L12 2z" />
            <path d="M2 7l10 5 10-5M2 17l10 5 10-5" />
          </svg>
        )}

        {icon === "TH" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20M12 2v20" />
          </svg>
        )}
      </div>
      <div>
        <div className="font-bold">{country}</div>
        <div className="text-sm">{currency}</div>
      </div>
      <Handle type="source" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

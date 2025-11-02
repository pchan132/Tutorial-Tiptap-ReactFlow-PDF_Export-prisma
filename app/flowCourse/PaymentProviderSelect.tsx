import { on } from "events";
import { useReactFlow } from "reactflow";
const PAYMENT_PROVIDERS = [
  { code: "St", name: "Stripe" },
  { code: "Gp", name: "Google Pay" },
  { code: "Ap", name: "Apple Pay" },
  { code: "Pp", name: "Paypal" },
  { code: "Am", name: "Amazon Pay" },
];
export default function PaymentProviderSelect() {
  const { setNodes } = useReactFlow();

  //   const onProviderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //     const selectedCode = event.target.value;
  //     const provider = PAYMENT_PROVIDERS.find(p => p.code === selectedCode);

  //     if (provider) {
  //       const location = Math.random() * 500;

  //       setNodes((prevNodes) => [
  //         ...prevNodes,
  //         {
  //           id: `${prevNodes.length + 1}`,
  //           data: { name: provider.name, code: provider.code },
  //           type: "paymentProvider",
  //           position: { x: location, y: location },
  //         },
  //       ]);
  //     }
  //   };

  const onProviderClick = ({ name, code }: { name: string; code: string }) => {
    const location = Math.random() * 500;

    setNodes((prevNodes) => [
      ...prevNodes,
      {
        id: `payment-provider-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        data: { name, icon: code },
        type: "paymentProvider",
        position: { x: location, y: location },
      },
    ]);
  };

  return (
    <div className="p-2 border border-purple-700 rounded bg-white">
      <div className="bg-purple-700 p-1.5 pr-10 text-white">
        Payment Provider
      </div>
      <div className="mt-2 space-y-1">
        {PAYMENT_PROVIDERS.map((provider) => (
          <button
            key={provider.code}
            onClick={() => onProviderClick(provider)}
            className="w-full text-left px-2 py-1 text-sm hover:bg-purple-100 rounded transition-colors border border-gray-200"
          >
            {provider.name}
          </button>
        ))}
      </div>
    </div>
  );
}

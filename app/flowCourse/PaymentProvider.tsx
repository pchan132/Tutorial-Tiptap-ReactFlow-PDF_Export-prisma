import { Handle, NodeProps, Position } from "reactflow";

const PAYMENT_PROVIDER_IMAGE_MAP: { [code: string]: string } = {
  St: "https://cdn.worldvectorlogo.com/logos/stripe-2.svg",
  Ap: "https://cdn.worldvectorlogo.com/logos/apple-14.svg",
  Gp: "https://cdn.worldvectorlogo.com/logos/google-g-2015.svg",
  Pp: "https://avatars.githubusercontent.com/u/476675?s=280&v=4",
  Am: "https://static.wixstatic.com/media/d2252d_4c1a1bda6a774bd68f789c0770fd16e5~mv2.png",
};

export default function PaymentProvider({
  data: { name, icon },
}: NodeProps<{ name: string; icon: string }>) {
  return (
    <div className="flex border border-purple-700 rounded items-center p-2">
      <img
        src={PAYMENT_PROVIDER_IMAGE_MAP[icon]}
        alt={name}
        className="w-4 mr-2"
      />
      <div>{name}</div>

      <Handle type="target" position={Position.Left} />
      <Handle type="target" position={Position.Right} />
    </div>
  );
}

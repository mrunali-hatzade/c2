import { redirect } from "next/navigation";

interface Props {
  params: { id: string };
}

/**
 * /shops/[id] redirects to canonical /shop/[id]
 */
export default function ShopsRedirectPage({ params }: Props) {
  redirect(`/shop/${params.id}`);
}

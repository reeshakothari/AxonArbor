import { redirect } from "next/navigation";

/** Approvals was split into Consultants and Companies. */
export default function ApprovalsPage() {
  redirect("/admin/consultants");
}

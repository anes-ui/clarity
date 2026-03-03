import { getUserById } from "@/lib/users";
import { notFound } from "next/navigation";
import DashboardClient from "@/components/DashboardClient";

export default function Dashboard({ params }: { params: { userId: string } }) {
    const user = getUserById(params.userId);
    if (!user) notFound();

    return <DashboardClient initialUser={user} />;
}

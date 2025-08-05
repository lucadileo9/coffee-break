import React from "react";

import AdminLayout from "@/components/organisms/AdminLayout";

export default function AdminHomePage() {
    return (
        <main style={{ padding: "2rem" }}>
            <AdminLayout>
                <h1>Admin Dashboard</h1>
                <p>Welcome to the Coffee Break admin panel.</p>
            </AdminLayout>
        </main>
    );
}
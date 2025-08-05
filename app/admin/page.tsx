import React from "react";

import AdminHeader from "@/components/molecules/AdminHeader";

export default function AdminHomePage() {
    return (
        <main style={{ padding: "2rem" }}>
            <AdminHeader currentPage="dashboard" />
            <h1>Admin Dashboard</h1>
            <p>Welcome to the Coffee Break admin panel.</p>
        </main>
    );
}
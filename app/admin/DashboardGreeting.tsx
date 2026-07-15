"use client";

export function DashboardGreeting() {
  const hour = new Date().getHours();
  const greeting =
    hour >= 18 || hour < 5
      ? "Buenas noches, Admin"
      : hour >= 12
        ? "Buenas tardes, Admin"
        : "Buenos días, Admin";

  return (
    <h1 className="font-sans text-2xl font-semibold text-text-primary">
      {greeting}
    </h1>
  );
}

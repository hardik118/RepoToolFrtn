// src/lib/dashboardApi.ts
let url = "http://localhost:8090"

interface RecentItem {
  type: string;
  time: string;
  title: string;
}

interface DashboardData {
  stats: {
    totalClasses: number;
    totalAssignments: number;
    totalSubmissions: number;
    totalStudents: number;
  };
  recentActivity: {
    submissions: RecentItem[];
    assignments: RecentItem[];
  };
}

export const fetchTeacherDashboardData = async (): Promise<DashboardData> => {
  const response = await fetch(`${url}/v1/main/teacher/dashboard`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // ⬅️ This is the crucial part that sends the cookie
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to fetch dashboard data");
  }

  return response.json();
};
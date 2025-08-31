// src/lib/authApi.ts (or wherever you organize your API calls)
let urlprefix = "http://localhost:8090"; 
export type SignupData = {
  name: string
  email: string
  password: string
  role: "teacher" | "student"
  classroomId?: number // only required for student signup
}

export type LoginData={
    email: string
    password: string,
    role: "teacher" | "student"
}


export async function signup(data: SignupData) {
    console.log("reached")
  let url = ""
  if (data.role === "teacher") {
    url = "/v1/api/main/auth/signup"
  } else if (data.role === "student") {
    if (!data.classroomId) {
      throw new Error("classroomId is required for student signup")
    }
    url = `/v1/api/main/auth/student/signup/${data.classroomId}`
  } else {
    throw new Error("Invalid role")
  }

      console.log("fetch")

  const res = await fetch(urlprefix+url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // allow cookie handling
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      password: data.password,
    }),
  })

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.error || "Signup failed")
  }
   // 1. Consume the response body once
  const responseData = await res.json() 
  
  // 2. Log the data variable, not the method
  console.log(responseData)

  // 3. Return the data variable
  return responseData


}

// api/auth.ts

export const login = async (email: string, password: string, role: string) => {
    let url="/v1/api/main/auth";
  try {
    // Define the login payload
    const loginData = {
      email,
      password,
    };

    // Make the fetch request
    const response = await fetch(`${urlprefix}/${role}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
      credentials: 'include', // Ensures cookies (like JWT) are sent with the request
    });

    // Check for successful response
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Login failed');
    }

    // Parse the response data (which contains user details and token)
    const data = await response.json();

    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Login failed');
  }
};

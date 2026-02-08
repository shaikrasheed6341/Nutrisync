


const BASE_URL = "http://localhost:3000/v1/api";

async function main() {
    try {
        // 1. Login
        console.log("Logging in...");
        const loginResponse = await fetch(`${BASE_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: "admin@.com",
                password: "admin",
            }),
        });

        if (!loginResponse.ok) {
            const errorText = await loginResponse.text();
            throw new Error(`Login failed: ${loginResponse.status} ${errorText}`);
        }

        const loginData = await loginResponse.json();
        const token = loginData.token;

        if (!token) {
            // Adjust based on actual response structure if needed
            console.error("Login response:", loginData);
            throw new Error("No token received in login response");
        }
        console.log("Login successful! Token received.");

        // 2. Generate Diet Plan
        console.log("Requesting AI Diet Plan...");
        const dietResponse = await fetch(`${BASE_URL}/generate-diet`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!dietResponse.ok) {
            const errorText = await dietResponse.text();
            throw new Error(`Diet generation failed: ${dietResponse.status} ${errorText}`);
        }

        const dietData = await dietResponse.json();
        console.log("\n--- AI Diet Plan Generated ---\n");
        console.log(JSON.stringify(dietData, null, 2));

    } catch (error) {
        console.error("Error:", error);
    }
}

main();

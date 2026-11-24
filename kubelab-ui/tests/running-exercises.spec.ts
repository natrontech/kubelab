import { expect, test } from "@playwright/test";

test("stopping an exercise removes the session without treating the loading Set as an array", async ({
    page,
    context
}) => {
    // Seed an isolated client session so this regression never needs a live backend
    const model = {
        id: "user",
        collectionId: "users",
        collectionName: "users",
        role: "user",
        name: "Test User",
        avatar: ""
    };
    const payload = Buffer.from(
        JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 })
    ).toString("base64url");
    const token = `eyJhbGciOiJIUzI1NiJ9.${payload}.test`;
    await context.addCookies([
        {
            name: "pb_auth",
            value: encodeURIComponent(JSON.stringify({ token, model })),
            url: "http://127.0.0.1:4173"
        }
    ]);

    const exercise = { id: "exercise", lab: "lab", title: "Practice" };
    const session = {
        id: "session",
        exercise: "exercise",
        user: "user",
        agentRunning: true,
        startTime: "2026-01-01 00:00:00.000Z",
        endTime: "",
        expand: { exercise }
    };
    const records: Record<string, unknown[]> = {
        labs: [{ id: "lab", title: "Lab" }],
        lab_sessions: [{ id: "lab-session", lab: "lab", user: "user", clusterRunning: true }],
        exercises: [exercise],
        exercise_sessions: [session]
    };
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    let stopped = false;
    await page.route("**/api/**", async (route) => {
        const request = route.request();
        if (request.method() === "PATCH") {
            expect(request.postDataJSON().agentRunning).toBe(false);
            stopped = true;
            await route.fulfill({ json: { ...session, agentRunning: false } });
            return;
        }
        const collection = new URL(request.url()).pathname.split("/")[3];
        const items = records[collection] ?? [];
        await route.fulfill({
            json: { page: 1, perPage: 200, totalItems: items.length, totalPages: 1, items }
        });
    });

    // Exercise the production component and its PocketBase update path
    await page.goto("/app/");
    await expect(page.getByText("Practice", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Stop Exercise" }).click();
    await expect(page.getByText("No running exercises", { exact: true })).toBeVisible();
    expect(stopped).toBe(true);
    expect(errors).toEqual([]);
});

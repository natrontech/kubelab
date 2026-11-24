import { fireEvent, render, screen } from "@testing-library/svelte";
import { expect, test, vi } from "vitest";
import Markdown from "./Markdown.svelte";

vi.mock("svelte-sonner", () => ({ toast: { success: vi.fn() } }));

test("the replacement renderer preserves code copying and external documentation links", async () => {
    // Render both code forms to verify the migration keeps their text intact
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
    const code = "kubectl get pods\n";
    render(Markdown, {
        source: "`kubectl`\n\n```sh\n" + code + "```\n\n[Docs](https://kubernetes.io/docs/)"
    });

    // Exercise the custom renderers rather than relying on generated markup snapshots
    await fireEvent.click(screen.getByRole("button", { name: "kubectl" }));
    expect(writeText).toHaveBeenLastCalledWith("kubectl");
    await fireEvent.click(screen.getByRole("button", { name: "Copy code" }));
    expect(writeText).toHaveBeenLastCalledWith(code);
    const link = screen.getByRole("link", { name: "Docs" });
    expect(link.getAttribute("href")).toBe("https://kubernetes.io/docs/");
    expect(link.getAttribute("target")).toBe("_blank");
});

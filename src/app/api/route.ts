import { NextResponse } from "next/server";

/* Dead scaffold: nothing on the page calls this. Pinned force-static so
   the GitHub Pages export (output: "export") accepts the route — a
   static GET is exactly what it returns anyway. */
export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json({ message: "Hello, world!" });
}
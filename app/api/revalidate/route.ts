import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const querySecret = request.nextUrl.searchParams.get("secret");
  const authHeader = request.headers.get("authorization")?.replace("Bearer ", "");
  const customHeader = request.headers.get("x-revalidate-secret");

  const providedSecret = querySecret || authHeader || customHeader;

  if (!process.env.REVALIDATE_SECRET || providedSecret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret token" }, { status: 401 });
  }

  try {
    revalidatePath("/", "layout");
    revalidatePath("/wisata");
    revalidatePath("/berita");
    revalidatePath("/profil");

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch {
    return NextResponse.json({ message: "Error revalidating cache" }, { status: 500 });
  }
}

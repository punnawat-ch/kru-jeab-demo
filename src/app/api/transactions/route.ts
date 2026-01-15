import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export const runtime = "nodejs";

const parseNumber = (value: string | null) => {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const getDateRange = (year: number | null, month: number | null) => {
  const now = new Date();
  const targetYear = year ?? now.getFullYear();

  if (month && month >= 1 && month <= 12) {
    const start = new Date(targetYear, month - 1, 1);
    const end = new Date(targetYear, month, 1);
    return { start, end };
  }

  if (year) {
    const start = new Date(targetYear, 0, 1);
    const end = new Date(targetYear + 1, 0, 1);
    return { start, end };
  }

  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return { start, end };
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const monthParam = searchParams.get("month");
  const yearParam = searchParams.get("year");

  if (!userId) {
    return NextResponse.json(
      { message: "userId is required" },
      { status: 400 }
    );
  }

  const month = monthParam === "all" ? null : parseNumber(monthParam);
  const year = parseNumber(yearParam);
  const { start, end } = getDateRange(year, month);

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      createdAt: {
        gte: start,
        lt: end,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json({ data: transactions });
}

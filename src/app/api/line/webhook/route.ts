import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { prisma } from "@/libs/prisma";
import { TxnType } from "@/generated/prisma/enums";

export const runtime = "nodejs";

type LineWebhookEvent = {
  type: "message";
  replyToken?: string;
  source?: {
    userId?: string;
  };
  message?: {
    type?: string;
    text?: string;
  };
};

type LineWebhookBody = {
  events?: LineWebhookEvent[];
};

const getTextPayload = (text: string) => {
  // รูปแบบ: "รับ 100 #โน๊ต" หรือ "จ่าย 250"
  const match = text.trim().match(/^(รับ|จ่าย)\s+([\d,]+)(?:\s*#(.+))?$/);
  if (!match) return null;

  const action = match[1];
  const amount = Number(match[2].replace(/,/g, ""));
  const note = match[3]?.trim();

  if (!Number.isFinite(amount) || amount <= 0) return null;

  return {
    type: action === "รับ" ? TxnType.INCOME : TxnType.EXPENSE,
    amount: Math.floor(amount),
    note,
  };
};

const verifySignature = (rawBody: string, signature: string | null) => {
  const secret = process.env.LINE_CHANNEL_SECRET;
  if (!secret || !signature) return false;

  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(rawBody, "utf8");
  const expected = hmac.digest("base64");
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
};

const replyMessage = async (replyToken: string, text: string) => {
  const accessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  if (!accessToken) return;

  await fetch("https://api.line.me/v2/bot/message/reply", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      replyToken,
      messages: [{ type: "text", text }],
    }),
  });
};

const getMonthRange = (date = new Date()) => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  return { start, end };
};

export async function POST(req: Request) {
  const signature = req.headers.get("x-line-signature");
  const rawBody = await req.text();

  if (!verifySignature(rawBody, signature)) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
  }

  let payload: LineWebhookBody;
  try {
    payload = JSON.parse(rawBody) as LineWebhookBody;
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  const events = payload.events ?? [];

  await Promise.all(
    events.map(async (event) => {
      if (event.type !== "message") return;
      if (event.message?.type !== "text") return;

      const userId = event.source?.userId;
      console.log("🚀 ~ POST ~ userId:", event);
      const text = event.message?.text ?? "";
      if (!userId || !text) return;

      const user = await prisma.user.findUnique({
        where: { lineId: userId },
      });

      if (!user) {
        if (event.replyToken) {
          await replyMessage(
            event.replyToken,
            "ยังไม่พบผู้ใช้งาน กรุณาเปิด LIFF และลงทะเบียนก่อนใช้งาน"
          );
        }
        return;
      }

      const trimmedText = text.trim();
      if (trimmedText === "สรุปผล") {
        const { start, end } = getMonthRange();

        const [incomeSummary, expenseSummary] = await Promise.all([
          prisma.transaction.aggregate({
            where: {
              userId: user.id,
              type: TxnType.INCOME,
              createdAt: {
                gte: start,
                lt: end,
              },
            },
            _sum: { amount: true },
          }),
          prisma.transaction.aggregate({
            where: {
              userId: user.id,
              type: TxnType.EXPENSE,
              createdAt: {
                gte: start,
                lt: end,
              },
            },
            _sum: { amount: true },
          }),
        ]);

        if (event.replyToken) {
          const incomeTotal = incomeSummary._sum.amount ?? 0;
          const expenseTotal = expenseSummary._sum.amount ?? 0;
          const netTotal = incomeTotal - expenseTotal;

          const incomeFormatted = incomeTotal.toLocaleString("th-TH");
          const expenseFormatted = expenseTotal.toLocaleString("th-TH");
          const netFormatted = Math.abs(netTotal).toLocaleString("th-TH");
          const netSign = netTotal >= 0 ? "+" : "-";
          const monthName = new Date().toLocaleString("th-TH", {
            month: "long",
          });
          const year = new Date().getFullYear();

          // convert to พศ
          const yearThai = year + 543;

          await replyMessage(
            event.replyToken,
            `เดือนนี้ เดือน ${monthName} ${yearThai}\nสรุปยอด \nรับ ${incomeFormatted} บาท \nจ่าย ${expenseFormatted} บาท\nสรุปยอดใช้จ่ายเดือนนี้ เท่ากับ ${netSign}${netFormatted} บาท`
          );
        }
        return;
      }

      const parsed = getTextPayload(text);
      if (!parsed) {
        if (event.replyToken) {
          await replyMessage(
            event.replyToken,
            "รูปแบบไม่ถูกต้อง ลองใช้: รับ 100 #โน๊ต หรือ จ่าย 50 #โน๊ต"
          );
        }
        return;
      }

      await prisma.transaction.create({
        data: {
          userId: user.id,
          type: parsed.type,
          amount: parsed.amount,
          note: parsed.note,
        },
      });

      if (event.replyToken) {
        const successMessage =
          parsed.type === TxnType.INCOME
            ? `บันทึกรายรับ ${parsed.amount} บาทแล้ว`
            : `บันทึกรายจ่าย ${parsed.amount} บาทแล้ว`;

        await replyMessage(
          event.replyToken,
          parsed.note ? `${successMessage} (#${parsed.note})` : successMessage
        );
      }
    })
  );

  return NextResponse.json({ ok: true });
}

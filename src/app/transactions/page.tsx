"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useUserStore } from "@/stores/userStore";
import type { Transaction } from "@/generated/prisma/client";

type FilterMonth = number | "all";

const monthNames = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
];

const formatAmount = (amount: number, type: Transaction["type"]) => {
  const sign = type === "INCOME" ? "+" : "-";
  return `${sign}${amount.toLocaleString("th-TH")} บาท`;
};

const formatDate = (date: string | Date) =>
  new Date(date).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export default function TransactionsPage() {
  const { user } = useUserStore();
  const [month, setMonth] = useState<FilterMonth>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const summary = useMemo(() => {
    const income = transactions
      .filter((txn) => txn.type === "INCOME")
      .reduce((sum, txn) => sum + txn.amount, 0);
    const expense = transactions
      .filter((txn) => txn.type === "EXPENSE")
      .reduce((sum, txn) => sum + txn.amount, 0);
    const net = income - expense;
    return { income, expense, net };
  }, [transactions]);

  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => currentYear - i);
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    const controller = new AbortController();
    const params = new URLSearchParams({
      userId: user.id,
      year: String(year),
    });

    if (month === "all") {
      params.set("month", "all");
    } else {
      params.set("month", String(month));
    }
    startTransition(async () => {
      setError(null);

      fetch(`/api/transactions?${params.toString()}`, {
        signal: controller.signal,
      })
        .then(async (res) => {
          if (!res.ok) {
            const body = await res.json().catch(() => null);
            throw new Error(body?.message || "โหลดข้อมูลไม่สำเร็จ");
          }
          return res.json();
        })
        .then((data) => {
          setTransactions(data.data || []);
        })
        .catch((err) => {
          if (err.name === "AbortError") return;
          setError(err.message || "โหลดข้อมูลไม่สำเร็จ");
        });
    });

    return () => controller.abort();
  }, [user?.id, month, year]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-100 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-blue-600 mb-2">
            กรุณาลงทะเบียนก่อน
          </h2>
          <p className="text-gray-500">
            ต้องลงทะเบียนผ่าน LIFF ก่อนจึงจะดูรายการได้
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-100 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-3xl shadow-xl p-6">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-700 mb-6">
            รายการรายรับรายจ่าย
          </h1>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600">
              1
            </span>
            <span>ตัวกรอง</span>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label
                htmlFor="month"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                เดือน
              </label>
              <select
                id="month"
                className="w-full border border-blue-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={month}
                onChange={(e) => {
                  const value = e.target.value;
                  setMonth(value === "all" ? "all" : Number(value));
                }}
              >
                <option value="all">ทั้งหมด</option>
                {monthNames.map((name, index) => (
                  <option key={name} value={index + 1}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label
                htmlFor="year"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                ปี
              </label>
              <select
                id="year"
                className="w-full border border-blue-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
              >
                {yearOptions.map((y) => (
                  <option key={y} value={y}>
                    {y + 543}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600">
              2
            </span>
            <span>สรุปผล</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
              <div className="text-sm text-green-700">รายรับรวม</div>
              <div className="text-2xl font-bold text-green-700">
                +{summary.income.toLocaleString("th-TH")} บาท
              </div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
              <div className="text-sm text-red-700">รายจ่ายรวม</div>
              <div className="text-2xl font-bold text-red-700">
                -{summary.expense.toLocaleString("th-TH")} บาท
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <div className="text-sm text-blue-700">คงเหลือสุทธิ</div>
              <div className="text-2xl font-bold text-blue-700">
                {summary.net >= 0 ? "+" : "-"}
                {Math.abs(summary.net).toLocaleString("th-TH")} บาท
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600">
              3
            </span>
            <span>รายการทั้งหมด</span>
          </div>
          {isPending && (
            <div className="flex items-center justify-center py-10">
              <div className="w-10 h-10 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          )}

          {error && (
            <div className="text-center text-red-600 font-medium py-6">
              {error}
            </div>
          )}

          {!isPending && !error && transactions.length === 0 && (
            <div className="text-center text-gray-500 py-10">
              ไม่มีรายการในช่วงเวลานี้
            </div>
          )}

          <div className="space-y-4">
            {transactions.map((txn) => (
              <div
                key={txn.id}
                className="flex items-center justify-between p-4 border border-blue-100 rounded-2xl hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        txn.type === "INCOME"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {txn.type === "INCOME" ? "รับ" : "จ่าย"}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatDate(txn.createdAt)}
                    </span>
                  </div>
                  <div className="text-gray-700">
                    {txn.note || "ไม่มีหมายเหตุ"}
                  </div>
                </div>
                <div
                  className={`font-bold ${
                    txn.type === "INCOME" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {formatAmount(txn.amount, txn.type)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

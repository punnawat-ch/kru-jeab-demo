"use server";

import { prisma } from "@/libs/prisma";
import type { User } from "@/generated/prisma/client";

export interface RegisterInput {
  lineId: string;
  name?: string;
}

export interface RegisterResult {
  success: boolean;
  user?: User;
  isNewUser: boolean;
  error?: string;
}

/**
 * Register หรือ login user จาก LINE LIFF
 * ถ้า user มีอยู่แล้วจะ return user เดิม
 * ถ้าไม่มีจะสร้างใหม่
 */
export async function registerUser(
  input: RegisterInput
): Promise<RegisterResult> {
  try {
    const { lineId, name } = input;
    console.log("🚀 ~ registerUser ~ input:", input);

    if (!lineId) {
      return {
        success: false,
        isNewUser: false,
        error: "LINE ID is required",
      };
    }

    // ค้นหา user จาก lineId
    const existingUser = await prisma.user.findUnique({
      where: { lineId },
    });

    // ถ้ามี user อยู่แล้ว return user เดิม (update name ถ้ามีการเปลี่ยน)
    if (existingUser) {
      // Update name ถ้ามีการเปลี่ยน
      if (name && name !== existingUser.name) {
        const updatedUser = await prisma.user.update({
          where: { lineId },
          data: { name },
        });
        return {
          success: true,
          user: updatedUser,
          isNewUser: false,
        };
      }

      return {
        success: true,
        user: existingUser,
        isNewUser: false,
      };
    }

    // สร้าง user ใหม่
    const newUser = await prisma.user.create({
      data: {
        lineId,
        name,
      },
    });

    return {
      success: true,
      user: newUser,
      isNewUser: true,
    };
  } catch (error) {
    console.error("Register error:", error);
    return {
      success: false,
      isNewUser: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * ดึงข้อมูล user จาก LINE ID
 */
export async function getUserByLineId(lineId: string): Promise<User | null> {
  try {
    return await prisma.user.findUnique({
      where: { lineId },
    });
  } catch (error) {
    console.error("Get user error:", error);
    return null;
  }
}

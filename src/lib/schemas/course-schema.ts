import { z } from "zod";

import { PROGRAMS, SEMESTERS, type Course } from "@/lib/types";

export const MAX_INSTRUCTORS = 3;
export const MAX_DESCRIPTION = 100;

export const programOptions = [
  { value: "CPE", label: "CPE — วิศวกรรมคอมพิวเตอร์" },
  { value: "ISNE", label: "ISNE — วิศวกรรมระบบสารสนเทศและเครือข่าย" },
];

export const semesterOptions = [
  { value: "1", label: "ภาคเรียนที่ 1" },
  { value: "2", label: "ภาคเรียนที่ 2" },
  { value: "3", label: "ภาคฤดูร้อน" },
];

const instructorSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "กรุณากรอกชื่อผู้สอน")
    .max(60, "ชื่อผู้สอนต้องไม่เกิน 60 ตัวอักษร"),
  email: z
    .string()
    .trim()
    .min(1, "กรุณากรอกอีเมล")
    .email("รูปแบบอีเมลไม่ถูกต้อง")
    .refine((v) => v.toLowerCase().endsWith("@cmu.ac.th"), {
      message: "อีเมลต้องลงท้ายด้วย @cmu.ac.th",
    }),
});

/**
 * สร้าง schema ใหม่ทุกครั้งที่ courses เปลี่ยน เพื่อให้ .refine() ที่กันรหัสวิชาซ้ำ
 * เห็นข้อมูลล่าสุดจาก store (รวมวิชาที่เพิ่งเพิ่มไปใน session นี้)
 */
export function createCourseFormSchema(courses: Course[]) {
  return (
    z
      .object({
        courseId: z
          .string()
          .trim()
          .min(1, "กรุณากรอกรหัสวิชา")
          .regex(/^\d{6}$/, "รหัสวิชาต้องเป็นตัวเลข 6 หลัก"),
        courseTitle: z
          .string()
          .trim()
          .min(1, "กรุณากรอกชื่อวิชา")
          .max(100, "ชื่อวิชาต้องไม่เกิน 100 ตัวอักษร"),
        instructors: z
          .array(instructorSchema)
          .min(1, "ต้องมีผู้สอนอย่างน้อย 1 คน")
          .max(MAX_INSTRUCTORS, `ผู้สอนได้ไม่เกิน ${MAX_INSTRUCTORS} คน`),
        program: z.enum(PROGRAMS, { message: "กรุณาเลือกหลักสูตร" }),
        semester: z.enum(SEMESTERS, { message: "กรุณาเลือกภาคการศึกษา" }),
        description: z
          .string()
          .trim()
          .max(
            MAX_DESCRIPTION,
            `รายละเอียดต้องไม่เกิน ${MAX_DESCRIPTION} ตัวอักษร`,
          ),
        notifyByEmail: z.boolean(),
      })
      // กันรหัสวิชาซ้ำกับที่มีอยู่แล้วในระบบ
      .refine((data) => !courses.some((c) => c.courseId === data.courseId), {
        message: "รหัสวิชานี้มีอยู่แล้วในระบบ",
        path: ["courseId"],
      })
      // กันอีเมลผู้สอนซ้ำกันเองภายในวิชาเดียวกัน
      .refine(
        (data) => {
          const emails = data.instructors.map((i) =>
            i.email.trim().toLowerCase(),
          );
          return new Set(emails).size === emails.length;
        },
        { message: "อีเมลผู้สอนต้องไม่ซ้ำกัน", path: ["instructors"] },
      )
  );
}

// type เดียวมาจาก schema — ไม่ประกาศซ้ำ
export type CourseFormValues = z.infer<
  ReturnType<typeof createCourseFormSchema>
>;

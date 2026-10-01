// ── Shared literal sources — ใช้ร่วมกันระหว่าง type และ Zod schema ──
const PROGRAMS = ["CPE", "ISNE"] as const;
export { PROGRAMS };
type Program = (typeof PROGRAMS)[number];
export type { Program };

const SEMESTERS = ["1", "2", "3"] as const;
export { SEMESTERS };
type Semester = (typeof SEMESTERS)[number];
export type { Semester };

interface Student {
  studentId: string;
  firstName: string;
  lastName: string;
  program: Program;
  courses?: string[];
  interests?: string[];
  emails?: StudentEmail[];
}
export type { Student };

interface StudentEmail {
  address: string;
}
export type { StudentEmail };

interface Instructor {
  name: string;
  email: string;
}
export type { Instructor };

interface Course {
  courseId: string;
  courseTitle: string;
  instructors: Instructor[];
  program: Program;
  semester: Semester;
  description: string;
  notifyByEmail: boolean;
}
export type { Course };

interface Enrollment {
  studentId: string;
  courseId: string;
  enrolledAt?: string;
}
export type { Enrollment };

// ผู้ใช้ระบบ (สำหรับ Login) — โปรเจกต์นี้ตัดระบบ Login ออกทั้งหมด (ดู
// mock-data.ts: CURRENT_STUDENT_ID) type นี้เลยไม่ได้ใช้งานจริงในแอป ADMIN นี้
// เก็บไว้เผื่ออ้างอิงตอนต่อ Backend จริง
interface User {
  username: string;
  password: string;
  studentId?: string | null;
  role: "STUDENT" | "ADMIN";
  tokens?: string[];
}
export type { User };

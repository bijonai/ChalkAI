import { classroomTable } from "./schema";
import { eq } from "drizzle-orm";
import { db } from ".";
import { Message } from "xsai";
import { Board } from "../shared";

export enum ClassroomStatus {
  Pending = 'pending',
  Running = 'running',
  Completed = 'completed',
  Failed = 'failed',
}

export const createClassroom = async () => {
  return await db
    .insert(classroomTable)
    .values([{
      title: 'Untitled',
    }])
    .returning({ id: classroomTable.id })
    .then(r => r.at(0) ?? null) as ClassroomInfo | null
}

export interface ClassroomInfo {
  id: string,
  title: string,
  createdAt: Date,
  updatedAt: Date,
  createdBy: string,
  public: boolean,
  status: ClassroomStatus,
}

export const getClassroomInfo = async (id: string) => {
  return await db
    .select({
      id: classroomTable.id,
      title: classroomTable.title,
      createdAt: classroomTable.createdAt,
      updatedAt: classroomTable.updatedAt,
      createdBy: classroomTable.createdBy,
      public: classroomTable.public,
      status: classroomTable.status,
    })
    .from(classroomTable)
    .where(eq(classroomTable.id, id))
    .then(r => r.at(0) ?? null) as ClassroomInfo | null
}

export const getContext = async (id: string) => {
  return await db
    .select({
      context: classroomTable.context,
    })
    .from(classroomTable)
    .where(eq(classroomTable.id, id))
    .then(r => r.at(0) ?? null) as Message[] | null
}

export const getResult = async (id: string) => {
  return await db
    .select({
      result: classroomTable.result,
    })
    .from(classroomTable)
    .where(eq(classroomTable.id, id))
    .then(r => r.at(0) ?? null) as Board | null
}

export const updateClassroomInfo = async (id: string, info: Partial<ClassroomInfo>) => {
  return await db
    .update(classroomTable)
    .set(info)
    .where(eq(classroomTable.id, id))
    .returning({ id: classroomTable.id })
    .then(r => r.at(0)!)
}

export const updateContext = async (id: string, context: Message[]) => {
  return await db
    .update(classroomTable)
    .set({ context })
    .where(eq(classroomTable.id, id))
    .returning({ id: classroomTable.id })
    .then(r => r.at(0)!)
}

export const updateResult = async (id: string, result: Board) => {
  return await db
    .update(classroomTable)
    .set({ result })
    .where(eq(classroomTable.id, id))
    .returning({ id: classroomTable.id })
    .then(r => r.at(0)!)
}
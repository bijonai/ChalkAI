import { classroomTable } from "../schema";
import { eq } from "drizzle-orm";
import { db } from "..";
import type { Message } from "xsai";
import type { Board } from "../../board";

export enum ClassroomStatus {
  Pending = 'pending',
  Running = 'running',
  Completed = 'completed',
  Failed = 'failed',
}

export interface Context {
  coder: Message[],
  planner: Message[],
  reviewer: Message[],
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

export const deleteClassroom = async (id: string) => {
  return await db
    .delete(classroomTable)
    .where(eq(classroomTable.id, id))
    .returning({ id: classroomTable.id })
    .then(r => r.at(0) ?? null) as ClassroomInfo | null
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

export const getContext = async (id: string): Promise<Context | null> => {
  return await db
    .select({
      context: classroomTable.context,
    })
    .from(classroomTable)
    .where(eq(classroomTable.id, id))
    .then(r => r.at(0) ?? null) as Context | null
}

export const getResult = async (id: string) => {
  const result = await db
    .select({
      result: classroomTable.result,
    })
    .from(classroomTable)
    .where(eq(classroomTable.id, id))
    .then(r => r.at(0) ?? null)
  if (!result) return null
  return result.result as Board
}

export const updateClassroomInfo = async (id: string, info: Partial<ClassroomInfo>) => {
  return await db
    .update(classroomTable)
    .set(info)
    .where(eq(classroomTable.id, id))
    .returning({ id: classroomTable.id })
    .then(r => r.at(0)!)
}

export const updateContext = async (id: string, context: Context) => {
  return await db
    .update(classroomTable)
    .set({
      context: {
        coder: context.coder,
        planner: context.planner,
        reviewer: context.reviewer,
      },
    })
    .where(eq(classroomTable.id, id))
    .returning({ id: classroomTable.id })
    .then(r => r.at(0)!)
}

export const updateResult = async (id: string, result: Board | { error: string }) => {
  return await db
    .update(classroomTable)
    .set({ result })
    .where(eq(classroomTable.id, id))
    .returning({ id: classroomTable.id })
    .then(r => r.at(0)!)
}

export const listClassrooms = async (
  limit: number = 10,
  offset: number = 0,
) => {
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
    .limit(limit)
    .offset(offset)
}

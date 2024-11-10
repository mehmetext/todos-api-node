import prisma from "@/lib/core/prisma";
import { calculatePagination, getPaginationSkip } from "@/lib/utils";
import {
  CreateLabelInput,
  GetLabelsInput,
  UpdateLabelInput,
} from "@/lib/validations";

export default class LabelService {
  static async getLabels(userId: string, query: GetLabelsInput["query"]) {
    const [labels, total] = await Promise.all([
      prisma.label.findMany({
        select: {
          id: true,
          name: true,
          color: true,
          _count: {
            select: { todos: true },
          },
        },
        where: { userId, deletedAt: null },
        skip: getPaginationSkip(query.page),
      }),
      prisma.label.count({ where: { userId, deletedAt: null } }),
    ]);

    return {
      pagination: calculatePagination(total, query.page),
      labels: labels.map((label) => ({
        ...label,
        todoCount: label._count.todos,
        _count: undefined,
      })),
    };
  }

  static async getLabelById(userId: string, id: string) {
    const label = await prisma.label.findUnique({
      select: {
        id: true,
        name: true,
        color: true,
        _count: { select: { todos: true } },
      },
      where: { deletedAt: null, id, userId },
    });

    if (!label) return null;

    return {
      ...label,
      todoCount: label._count.todos,
      _count: undefined,
    };
  }

  static async createLabel(userId: string, data: CreateLabelInput["body"]) {
    return prisma.label.create({ data: { ...data, userId } });
  }

  static async updateLabel(
    userId: string,
    id: string,
    data: UpdateLabelInput["body"]
  ) {
    const labelExists = await this.getLabelById(userId, id);
    if (!labelExists) return null;

    return prisma.label.update({
      where: { deletedAt: null, id, userId },
      data: { ...data, updatedAt: new Date() },
    });
  }

  static async deleteLabel(userId: string, id: string) {
    const labelExists = await this.getLabelById(userId, id);
    if (!labelExists) return null;

    return prisma.label.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

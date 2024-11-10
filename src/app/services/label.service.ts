import prisma from "@/lib/core/prisma";
import { CreateLabelInput, UpdateLabelInput } from "@/lib/validations";

export default class LabelService {
  static async getLabels(userId: string) {
    return prisma.label.findMany({
      where: { userId, deletedAt: null },
    });
  }

  static async getLabelById(userId: string, id: string) {
    return prisma.label.findUnique({
      where: { deletedAt: null, id, userId },
    });
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

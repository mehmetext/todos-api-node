import prisma from "@/lib/core/prisma";
import { calculatePagination, getPaginationSkip } from "@/lib/utils";
import {
  CreateLabelInput,
  GetLabelsInput,
  UpdateLabelInput,
} from "@/lib/validations";
import { Label } from "@prisma/client";
import { CacheService } from ".";

export default class LabelService {
  private static readonly CACHE_PREFIX = "labels";
  private static readonly CACHE_TTL = 60 * 5; // 5 minutes

  private static async invalidateCache(userId: string) {
    await CacheService.delByPattern(`${this.CACHE_PREFIX}:${userId}:*`);
  }

  static async getLabels(userId: string, query: GetLabelsInput["query"]) {
    const listCacheKey = CacheService.generateKey(
      this.CACHE_PREFIX,
      userId,
      "list",
      JSON.stringify(query)
    );
    const countCacheKey = CacheService.generateKey(
      this.CACHE_PREFIX,
      userId,
      "count",
      JSON.stringify(query)
    );

    const cachedLabels = await CacheService.get<Label[]>(listCacheKey);
    const cachedTotal = await CacheService.get<number>(countCacheKey);

    if (cachedLabels && cachedTotal) {
      return {
        pagination: calculatePagination(cachedTotal, query.page),
        labels: cachedLabels,
      };
    }

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

    const labelsWithTodoCount = labels.map((label) => ({
      ...label,
      todoCount: label._count.todos,
      _count: undefined,
    }));

    await Promise.all([
      CacheService.set(listCacheKey, labelsWithTodoCount, this.CACHE_TTL),
      CacheService.set(countCacheKey, total, this.CACHE_TTL),
    ]);

    return {
      pagination: calculatePagination(total, query.page),
      labels: labelsWithTodoCount,
    };
  }

  static async getLabelById(userId: string, id: string) {
    const labelCacheKey = CacheService.generateKey(
      this.CACHE_PREFIX,
      userId,
      id
    );

    const cachedLabel = await CacheService.get<Label>(labelCacheKey);

    if (cachedLabel) return cachedLabel;

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

    const labelWithTodoCount = {
      ...label,
      todoCount: label._count.todos,
      _count: undefined,
    };

    await CacheService.set(labelCacheKey, labelWithTodoCount, this.CACHE_TTL);

    return labelWithTodoCount;
  }

  static async createLabel(userId: string, data: CreateLabelInput["body"]) {
    const label = await prisma.label.create({ data: { ...data, userId } });

    await this.invalidateCache(userId);

    return label;
  }

  static async updateLabel(
    userId: string,
    id: string,
    data: UpdateLabelInput["body"]
  ) {
    const labelExists = await this.getLabelById(userId, id);
    if (!labelExists) return null;

    const label = await prisma.label.update({
      where: { deletedAt: null, id, userId },
      data: { ...data, updatedAt: new Date() },
    });

    await this.invalidateCache(userId);

    return label;
  }

  static async deleteLabel(userId: string, id: string) {
    const labelExists = await this.getLabelById(userId, id);
    if (!labelExists) return null;

    const label = await prisma.label.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    await this.invalidateCache(userId);

    return label;
  }
}

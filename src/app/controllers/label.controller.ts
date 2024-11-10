import ApiResponse from "@/lib/core/api-response";
import { CreateLabelInput, UpdateLabelInput } from "@/lib/validations";
import { LabelService } from "@/services";
import { Request, Response } from "express";

export default class LabelController {
  static async getLabels(req: Request, res: Response) {
    const labels = await LabelService.getLabels(req.user!.id);
    return ApiResponse.success(res, labels);
  }

  static async getLabelById(req: Request<{ id: string }>, res: Response) {
    const label = await LabelService.getLabelById(req.user!.id, req.params.id);

    if (!label) return ApiResponse.notFound(res, "Label not found");

    return ApiResponse.success(res, label);
  }

  static async createLabel(
    req: Request<unknown, unknown, CreateLabelInput["body"]>,
    res: Response
  ) {
    const label = await LabelService.createLabel(req.user!.id, req.body);
    return ApiResponse.success(res, label);
  }

  static async updateLabel(
    req: Request<{ id: string }, unknown, UpdateLabelInput["body"]>,
    res: Response
  ) {
    const label = await LabelService.updateLabel(
      req.user!.id,
      req.params.id,
      req.body
    );

    if (!label) return ApiResponse.notFound(res, "Label not found");

    return ApiResponse.success(res, label);
  }

  static async deleteLabel(req: Request<{ id: string }>, res: Response) {
    const label = await LabelService.deleteLabel(req.user!.id, req.params.id);

    if (!label) return ApiResponse.notFound(res, "Label not found");

    return ApiResponse.success(res, null);
  }
}

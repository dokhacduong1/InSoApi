import { Request, Response } from "express";
export const createInfo = async function (
  req: Request,
  res: Response,
  next: any
): Promise<void> {
  const { homeowners, age, address } = req.body;

  if (!homeowners || !age || !address) {
    res.status(400).json({
      code: 400,
      message: "Vui lòng nhập đầy đủ thông tin.",
    });
    return;
  }
  next();
  try {
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const deleteInfo = async function (
  req: Request,
  res: Response,
  next: any
): Promise<void> {
  const { id } = req.query;
  if (!id) {
    res.status(400).json({
      code: 400,
      message: "Vui lòng nhập id.",
    });
    return;
  }
  next();
  try {
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const editInfo = async function (
  req: Request,
  res: Response,
  next: any
): Promise<void> {
  const { homeowners, age, address } = req.body;

  if (!homeowners || !age || !address) {
    res.status(400).json({
      code: 400,
      message: "Vui lòng nhập đầy đủ thông tin.",
    });
    return;
  }
  next();
  try {
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
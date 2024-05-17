import { Request, Response } from "express";
import { Multer } from "multer";

export const createSheet = async function (
  req: Request & { file: Multer.File },
  res: Response,
  next: any
): Promise<void> {
  const { title, positionAddress, positionUserInfo, positionSurname } = req.body;
  const { file } = req;
  if (!positionSurname) {
    res.status(400).json({
      code: 400,
      message: "Vui lòng vị trí thượng phụng.",
    });
    return;
  }
  if (!title) {
    res.status(400).json({
      code: 400,
      message: "Vui lòng nhập tiêu đề.",
    });
    return;
  }
  if (!file) {
    res.status(400).json({
      code: 400,
      message: "Vui lòng chọn file.",
    });
    return;
  }
  if (!positionAddress) {
    res.status(400).json({
      code: 400,
      message: "Vui lòng nhập vị trí địa chỉ.",
    });
    return;
  }
  if (!positionUserInfo) {
    res.status(400).json({
      code: 400,
      message: "Vui lòng nhập vị trí thông tin người dùng.",
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

export const editSheet = async function (
  req: Request & { file: Multer.File },
  res: Response,
  next: any
): Promise<void> {
  const { title, positionAddress, positionUserInfo, positionSurname } = req.body;
  const { file } = req;
  if (!positionSurname) {
    res.status(400).json({
      code: 400,
      message: "Vui lòng vị trí thượng phụng.",
    });
    return;
  }
  if (!title) {
    res.status(400).json({
      code: 400,
      message: "Vui lòng nhập tiêu đề.",
    });
    return;
  }
  if (!file) {
    res.status(400).json({
      code: 400,
      message: "Vui lòng chọn file.",
    });
    return;
  }
  if (!positionAddress) {
    res.status(400).json({
      code: 400,
      message: "Vui lòng nhập vị trí địa chỉ.",
    });
    return;
  }
  if (!positionUserInfo) {
    res.status(400).json({
      code: 400,
      message: "Vui lòng nhập vị trí thông tin người dùng.",
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

export const deleteSheet = async function (
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
export const printSheet = async function (
  req: Request,
  res: Response,
  next: any
): Promise<void> {
  try {
    const { listIdInfo, sheetId, date } = req.body;

    if (listIdInfo.length === 0) {
      res.status(400).json({
        code: 400,
        message: "Vui lòng nhập listIdInfo.",
      });
      return;
    }
    if (!sheetId) {
      res.status(400).json({
        code: 400,
        message: "Vui lòng nhập sheetId.",
      });
      return;
    }
    if (!date) {
      res.status(400).json({
        code: 400,
        message: "Vui lòng nhập date.",
      });
      return;
    }
    next();
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
    console.log(error);
  }
};

import { Request, Response } from "express";
import excel from "excel4node";
import { Multer } from "multer";
import Sheet from "../../../../../model/sheet.model";
import xlsx from "xlsx";
import * as SheetInterface from "../../../interfaces/sheet.interface";
import { convertToSlug } from "../../../helpers/convertToSlug";
import { filterQueryPagination } from "../../../helpers/filterQueryPagination.";
import { tinhCanChi } from "../../../helpers/tinhCanChi";
import Info from "../../../../../model/info.model";
import { convertDataInfo } from "../../../helpers/convertDataInfo";
import { noBorderExecl, optionsExecl } from "../../../helpers/optionsExecl";
import {
  addAddress,
  addDataCanChi,
  addNgayCung,
  addUserInfo,
} from "../../../helpers/sheetHelpers";
export const index = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    //Khai báo biến find.
    //Đoạn or là lấy ra các id có trong trường createdBy hoặc nếu không có trong trường createdBy thì lấy ra trong mảng listUsser nếu có
    //Nói chung có nghĩa là lấy các user có quyền tham gia được task này
    const find: SheetInterface.Find = {};

    let querySortKey: string = "";
    let querySortValue: string = "";
    let queryPage: number = 1;
    let queryLimit: number = 6;

    //Check xem nếu query có sortKey  thì gán vào biến sortKey không thì gán bằng title. (Chức Năng Sắp Xếp)
    if (req.query.sortKey) {
      querySortKey = req.query.sortKey.toString() || "homeowners";
    }

    //Check xem nếu query có sortValue  thì gán vào biến sortValue không thì gán bằng desc. (Chức Năng Sắp Xếp)
    if (req.query.sortValue) {
      querySortValue = req.query.sortValue.toString() || "asc";
    }

    //Check xem nếu query có queryPage thì gán vào biến queryPage không thì gán bằng rỗng. (Chức Năng Phân Trang)
    if (req.query.page) {
      queryPage = parseInt(req.query.page.toString());
    }

    //Check xem nếu query có queryLimit thì gán vào biến queryLimit không thì gán bằng 1. (Chức Năng Phân Trang)
    if (req.query.limit) {
      queryLimit = parseInt(req.query.limit.toString());
    }

    //Check xem nếu query có queryKeyword thì gán vào biến queryKeyword không thì gán bằng rỗng. (Chức Tìm Kiếm)
    //Nếu tồn tại keyword bắt đầu tìm kiếm theo keyword đối chiếu database(Chức Tìm Kiếm)
    if (req.query.keyword) {
      //Lấy ra key word của người dùng gửi lên
      const keyword: string = req.query.keyword.toString();
      //Chuyển keyword về dạng regex
      const keywordRegex: RegExp = new RegExp(keyword, "i");
      //Chuyển tất cả sang dạng slug
      const unidecodeSlug: string = convertToSlug(keyword);
      //Chuyển slug vừa tạo qua regex
      const slugRegex: RegExp = new RegExp(unidecodeSlug, "i");
      //Tạo ra một mảng find có các tiêu chí tìm một là tìm theo title nếu không có tìm theo slug
      find["$or"] = [{ title: keywordRegex }, { slug: slugRegex }];
    }

    //Đếm xem bảng record có bao nhiêu sản phẩm và check phân trang (Chức Năng Phân Trang)
    const countRecord = await Sheet.countDocuments(find);

    const objectPagination = filterQueryPagination(
      countRecord,
      queryPage,
      queryLimit
    );
    //Tạo một object gán sortKey , sortValue tìm được vào  (Chức Năng Sắp Xếp)
    let sort = {};
    //Nếu tồn tại thì mới gán vào sort
    if (querySortKey && querySortValue) {
      sort = {
        [querySortKey]: querySortValue,
      };
    }

    //Check xem có bao job để phân trang
    const countRecordModal: number = Math.round(countRecord / queryLimit);

    let records = [];
    //Tìm tất cả các công việc.
    if (req.query.findAll) {
      records = await Sheet.find(find).sort(sort).select("");
    } else {
      records = await Sheet.find(find)
        .sort(sort)
        .limit(objectPagination.limitItem || 4)
        .skip(objectPagination.skip || 0)
        .select("");
    }

    //Trả về công việc đó.
    res
      .status(200)
      .json({ data: records, code: 200, countRecordModal: countRecordModal });
  } catch (error) {
    //Thông báo lỗi 500 đến người dùng server lỗi.
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createSheet = async function (
  req: Request & { file: Multer.File },
  res: Response
): Promise<void> {
  try {
    const title = req.body.title;
    const positionUserInfo = req.body.positionUserInfo;
    const positionAddress = req.body.positionAddress;
    const buffer = req.file.buffer;
    const workbook = xlsx.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0]; // Chúng ta lấy tên của sheet đầu tiên
    const worksheet = workbook.Sheets[sheetName];
    let arrObject = [];
    // Đọc dữ liệu từ tệp Excel và lưu vào cơ sở dữ liệu
    const range = xlsx.utils.decode_range(worksheet["!ref"]);

    for (let rowNum = range.s.r - 1; rowNum <= range.e.r; rowNum++) {
      for (let colNum = range.s.c - 1; colNum <= range.e.c; colNum++) {
        const position = { r: rowNum + 1, c: colNum + 1 }; // Vị trí của ô dưới dạng index
        const cellIndex = xlsx.utils.encode_cell(position);
        const positionChar = xlsx.utils.encode_cell({
          r: rowNum + 1,
          c: colNum + 1,
        }); // Lấy vị trí của ô (dùng để duyệt vị trí dùng lại)
        const cell = worksheet[cellIndex];
        if (cell && cell.v) {
          const value = cell.v.toString(); // Lấy giá trị của ô
          const ObjectValue = {
            position: position,
            value: value,
            positionChar: positionChar,
          };
          arrObject.push(ObjectValue);
        }
      }
    }
    arrObject.sort((a, b) => {
      if (a.positionChar < b.positionChar) {
        return -1;
      }
      if (a.positionChar > b.positionChar) {
        return 1;
      }
      return 0;
    });
    const stringFyData = JSON.stringify(arrObject);
    const record = new Sheet({
      title: title,
      data: stringFyData,
      positionUserInfo: positionUserInfo,
      positionAddress: positionAddress,
    });
    await record.save();
    res.status(200).json({ code: 200, success: "Thêm dữ liệu thành công." });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
    console.log(error);
  }
};

export const editSheet = async function (
  req: Request & { file: Multer.File },
  res: Response
): Promise<void> {
  try {
    const id = req.body._id;
    const title = req.body.title;
    const positionUserInfo = req.body.positionUserInfo;
    const positionAddress = req.body.positionAddress;
    const buffer = req.file.buffer;
    const record = {
      title: title,
    
      positionUserInfo: positionUserInfo,
      positionAddress: positionAddress,
    };
    if (buffer) {
      const workbook = xlsx.read(buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0]; // Chúng ta lấy tên của sheet đầu tiên
      const worksheet = workbook.Sheets[sheetName];
      let arrObject = [];
      // Đọc dữ liệu từ tệp Excel và lưu vào cơ sở dữ liệu
      const range = xlsx.utils.decode_range(worksheet["!ref"]);

      for (let rowNum = range.s.r - 1; rowNum <= range.e.r; rowNum++) {
        for (let colNum = range.s.c - 1; colNum <= range.e.c; colNum++) {
          const position = { r: rowNum + 1, c: colNum + 1 }; // Vị trí của ô dưới dạng index
          const cellIndex = xlsx.utils.encode_cell(position);
          const positionChar = xlsx.utils.encode_cell({
            r: rowNum + 1,
            c: colNum + 1,
          }); // Lấy vị trí của ô (dùng để duyệt vị trí dùng lại)
          const cell = worksheet[cellIndex];
          if (cell && cell.v) {
            const value = cell.v.toString(); // Lấy giá trị của ô
            const ObjectValue = {
              position: position,
              value: value,
              positionChar: positionChar,
            };
            arrObject.push(ObjectValue);
          }
        }
      }
      arrObject.sort((a, b) => {
        if (a.positionChar < b.positionChar) {
          return -1;
        }
        if (a.positionChar > b.positionChar) {
          return 1;
        }
        return 0;
      });
      const stringFyData = JSON.stringify(arrObject);
      record["data"] = stringFyData;
    }

    
    await Sheet.updateOne({ _id: id }, record);
    res.status(200).json({ code: 200, success: "Sửa dữ liệu thành công." });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
    console.log(error);
  }
};

export const deleteSheet = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = req.query.id;
    await Sheet.deleteOne({ _id: id });
    res.status(200).json({ code: 200, success: "Xóa dữ liệu thành công." });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const printSheet = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    const listIdInfo = req.body.listIdInfo;
    const listSheetId = req.body.sheetId;
    const dateInfo = req.body.date;
    const recordInfo = await Info.find({ _id: { $in: listIdInfo } });
    const recordSheets = await Sheet.find({ _id: { $in: listSheetId } });

    // res.status(200).json({ code: 200, data: "ok" });
    // return;
    if (recordInfo.length === 0) {
      res
        .status(200)
        .json({ code: 200, success: "Không có dữ liệu cá nhân nào." });
      return;
    }
    if (recordSheets.length === 0) {
      res.status(200).json({ code: 200, success: "Không có dữ liệu sớ nào." });
      return;
    }
    const convertDataInfoAll = convertDataInfo(recordInfo);
    const wb = new excel.Workbook({
      defaultFont: {
        size: 16,
        name: "Arial",
        bold: true,
      },
      font: {
        bold: true,
      },
    });
    for (let recordSheet of recordSheets) {
      for (let i = 0; i < convertDataInfoAll.length; i++) {
        const ws = wb.addWorksheet(
          `${convertDataInfoAll[i].slug}${new Date().getTime()}`,
          optionsExecl
        );
        const convertData = JSON.parse(recordSheet.data);

        convertData.forEach((row, index) => {
          ws.cell(row?.position["r"], row?.position["c"] + 1)
            .string(row.value)
            .style({ border: noBorderExecl });
        });

        addUserInfo(
          ws,
          convertDataInfoAll[i].infoConvert,
          recordSheet?.positionUserInfo
        );
        addAddress(
          ws,
          convertDataInfoAll[i].address,
          recordSheet?.positionAddress
        );
        addDataCanChi(ws);
        addNgayCung(ws, dateInfo);
      }
    }
    const buffer = await wb.writeToBuffer();
    res.status(200).json({ code: 200, data: buffer.toString("base64") });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

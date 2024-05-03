import { Request, Response } from "express";
import excel from "excel4node";

import xlsx from "xlsx";
import Sheet from "../../../../../model/sheet.model";
import { noBorderExecl, optionsExecl } from "../../../helpers/optionsExecl";
import { convertDataInfo } from "../../../helpers/convertDataInfo";
import Info from "../../../../../model/info.model";

export const index = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {

    const recordInfo = await Info.find();
    const convertDataInfoAll = convertDataInfo(recordInfo);

    // res.status(200).json({code: 200, data: convertDataInfoAll});
    // return;
    const record = await Sheet.findOne({ title: "Sớ gia tiên" });
    if (!record) {
      res.status(404).json({
        message: "Record not found",
      });
      return;
    }
    const wb = new excel.Workbook({
      defaultFont: {
        size: 16,
        name: "Arial",
        bool: true,
      },
    });
    for (let i = 0; i < convertDataInfoAll.length; i++) {
      const ws = wb.addWorksheet(convertDataInfoAll[i].slug + new Date().getTime(), optionsExecl);
      // Header
      const convertData = JSON.parse(record.data);
      // Data
      convertData.forEach((row, index) => {
        ws.cell(row?.position["r"], row?.position["c"] + 1)
          .string(row.value)
          .style({ border: noBorderExecl });
        // Đặt độ rộng của cột bằng chiều rộng của chữ
      });
      //Thêm thông tin người dùng vào file excel in dọc
      let startColumn = 18;
      for (let j = 0; j < convertDataInfoAll[i].infoConvert.length; j++) {
        let column = startColumn + Math.floor(j / 30);
        let row = (j % 30) + 2;

        ws.cell(row, column)
          .string(convertDataInfoAll[i].infoConvert[j])
          .style({ border: noBorderExecl });
      }
      //Thêm địa chỉ vào file excel in dọc
      let addressSpilt = convertDataInfoAll[i].address.split(" ");
      let startColumnAddress = 22;
      for (let j = 0; j < addressSpilt.length; j++) {
        let column = startColumnAddress + Math.floor(j / 30);
        let row = (j % 30) + 5;

        ws.cell(row, column)
          .string(addressSpilt[j])
          .style({ border: noBorderExecl });
      }
      wb.write("output.xlsx");
    }

    // const ws = wb.addWorksheet("Sheet 1", optionsExecl);

    // // Header
    // const convertData = JSON.parse(record.data);
    // // Data
    // convertData.forEach((row, index) => {
    //    ws.cell(row?.position["r"], row?.position["c"] + 1)
    //     .string(row.value)
    //     .style({ border: noBorderExecl });

    //   // Đặt độ rộng của cột bằng chiều rộng của chữ

    // });

    // wb.write("output.xlsx");
    res.status(200).json({
      message: "Welcome to the home page",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
    console.log(error);
  }
};

//Hàm này đọc file excel và lưu vào cơ sở dữ liệu
export const readFileExcel = async function (
  req: Request,
  res: Response
): Promise<void> {
  const inputFile = "./api/v1/access/input.xlsx";
  try {
    const workbook = xlsx.readFile(inputFile);
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
      title: "Sớ gia tiên",
      data: stringFyData,
    });
    await record.save();
    res.status(200).json({ code: 200, data: arrObject });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
    console.log(error);
  }
};

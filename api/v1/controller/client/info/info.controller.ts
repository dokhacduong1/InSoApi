import { Request, Response } from "express";
import Info from "../../../../../model/info.model";

import * as InfoInterface from "../../../interfaces/info.interface";
import { convertToSlug } from "../../../helpers/convertToSlug";
import { filterQueryPagination } from "../../../helpers/filterQueryPagination.";
//VD: //VD: {{BASE_URL}}/api/v1/admin/admin/jobs?page=1&limit=7&sortKey=title&sortValue=asc&status=active&featured=true&salaryKey=gt&salaryValue=1000&jobLevel=Intern&occupationKey=software-development
export const index = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    //Khai báo biến find.
    //Đoạn or là lấy ra các id có trong trường createdBy hoặc nếu không có trong trường createdBy thì lấy ra trong mảng listUsser nếu có
    //Nói chung có nghĩa là lấy các user có quyền tham gia được task này
    const find: InfoInterface.Find = {};

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
      find["$or"] = [
        { homeowners: keywordRegex },
        { slug: slugRegex },
        { address: keywordRegex },
      ];
    }

    //Đếm xem bảng record có bao nhiêu sản phẩm và check phân trang (Chức Năng Phân Trang)
    const countRecord = await Info.countDocuments(find);

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
      records = await Info.find(find).sort(sort).select("");
    } else {
      records = await Info.find(find)
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

export const createInfo = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    const {
      homeowners,
      age,
      wife_homeowners,
      wife_age,
      address,
      info_children,
    } = req.body;
    const record = new Info({
      homeowners,
      age,
      wife_homeowners: wife_homeowners || "",
      wife_age: wife_age || 0,
      address,
      info_children: info_children || [],
    });

    await record.save();
    res.status(200).json({ code: 200, success: "Thêm dữ liệu thành công." });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const deleteInfo = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = req.query.id;
    await Info.deleteOne({ _id: id });
    res.status(200).json({ code: 200, success: "Xóa dữ liệu thành công." });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const editInfo = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = req.body._id;
  
    const {
      homeowners,
      age,
      wife_homeowners,
      wife_age,
      address,
      info_children,
    } = req.body;
    const record = {
      homeowners,
      age,
      wife_homeowners: wife_homeowners || "",
      wife_age: wife_age || 0,
      address,
      info_children: info_children || [],
    };

    await Info.updateOne({ _id: id }, record);
    res.status(200).json({ code: 200, success: "Sửa liệu thành công." });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

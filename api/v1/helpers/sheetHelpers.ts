import { noBorderExecl } from "./optionsExecl";
import { tinhCanChi } from "./tinhCanChi";

export function addUserInfo(ws, infoConvert, startColumn = 18) {
  for (let j = 0; j < infoConvert.length; j++) {
    const column = startColumn + Math.floor(j / 30);
    const row = (j % 30) + 2;

    ws.cell(row, column)
      .string(infoConvert[j])
      .style({ border: noBorderExecl });
  }
}

export function addAddress(ws, address, startColumnAddress = 22) {
  const addressSpilt = address.split(" ");
  for (let j = 0; j < addressSpilt.length; j++) {
    const column = startColumnAddress + Math.floor(j / 30);
    const row = (j % 30) + 5;

    ws.cell(row, column)
      .string(addressSpilt[j])
      .style({ border: noBorderExecl });
  }
}

export function addDataCanChi(ws) {
  const year = new Date().getFullYear();
  const canChi = tinhCanChi(year);
  //B11 - B4
  ws.cell(4, 2).string(canChi["can"]).style({ border: noBorderExecl });
  //B11
  ws.cell(11, 2).string(canChi["chi"]).style({ border: noBorderExecl });
}

export function addNgayCung(ws, dataInfo) {
  const day = new Date(dataInfo).getDate();
  const month = new Date(dataInfo).getMonth() + 1;
  ws.cell(13, 2).string(month.toString()).style({ border: noBorderExecl });
  //B18
  ws.cell(18, 2).string(day.toString()).style({ border: noBorderExecl });
}

export function addThuongPhung(ws, positionSurname,hoGiaChu) {
 
  ws.cell(positionSurname?.row, positionSurname?.column).string(hoGiaChu.toString()).style({ border: noBorderExecl });

}

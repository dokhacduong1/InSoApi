export function tinhCanChi(nam: number): {
  can: string;
  chi: string;
} {
  // Mảng chứa các Can
  var arrCan: Array<string> = [
    "Canh",
    "Tân",
    "Nhâm",
    "Quý",
    "Giáp",
    "Ất",
    "Bính",
    "Đinh",
    "Mậu",
    "Kỷ",
  ];
  // Mảng chứa các Chi
  var arrChi: Array<string> = [
    "Thân",
    "Dậu",
    "Tuất",
    "Hợi",
    "Tí",
    "Sửu",
    "Dần",
    "Mão",
    "Thìn",
    "Tỵ",
    "Ngọ",
    "Mùi",
  ];

  // Tính Can và Chi
  var can = arrCan[nam % 10];
  var chi = arrChi[nam % 12];

  return {
    can: can,
    chi: chi,
  };
}

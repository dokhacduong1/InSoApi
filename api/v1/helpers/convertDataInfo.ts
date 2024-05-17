export function convertDataInfo(data) {
    const currentYear = new Date().getFullYear();
    return data.map(item => {
      let result = `${item.homeowners} ${currentYear - item.age + 1} tuổi`;
      if (item.wife_homeowners) {
        result += ` thê ${item.wife_homeowners} ${currentYear - item.wife_age + 1} tuổi`;
      }
      if (item.info_children.length > 0) {
        item.info_children.forEach(child => {
          result += ` ${child.name} ${currentYear - child.year + 1} tuổi`;
        });
      }
      return {
        ...item._doc,
        infoConvert: result.split(" ").filter(str => str != " ")
      };
    });
  }
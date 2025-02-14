//import { Roundto5,Round_to10 } from "./rounding.js";
//import {Roundto5,Round_to10} from "./rounding";
export default function solve_eqn(arr) {
    switch (arr.length) {
      case 2:
        return process_data(solve_pt1(arr[0], arr[1]));
        break;
      case 3:
        return process_data(solve_pt2(arr[0], arr[1], arr[2]));
        break;
      case 4:
        return process_data(solve_pt3(arr[0], arr[1], arr[2], arr[3]));
        break;
      case 5:
        return process_data(solve_pt4(arr[0], arr[1], arr[2], arr[3], arr[4]));
        break;
    }
  }
  function countdupes(arr) {
    const count = arr.reduce((accumulator, value) => {
      return { ...accumulator, [value]: (accumulator[value] || 0) + 1 };
    }, {});
  
    // 👇️ {one: 3, two: 2, three: 1}
    return count;
  }
  function counting(array, number) {
    let count = 0;
    array.forEach((value) => {
      if (number == value) {
        count++;
      }
    });
    return count;
  }
  function findDuplicates(array, numberofdupes) {
    let result = [];
    for (let i = 0; i < numberofdupes; i++) {
      for (let j = 0; j < array.length; j++) {
        for (let k = j + 1; k < array.length; k++) {
          if (array[j] == array[k]) {
            if (i == 1) if (result[0]["number"] == array[j]) continue;
  
            result[i] = { number: array[j], dupetime: counting(array, array[j]) };
          }
        }
      }
    }
    return result;
  }
  function containsDuplicates(array) {
    return array.length !== new Set(array).size;
  }
//   const Round_to10 = (x) => {
//     console.log(Math.round(x * 100000))
//     return Math.round(x * 100000) / 100000;
//   };
  const Round_to10 = (x) => {
    return Math.round(x * 10000000000) / 10000000000;
  };
  
  const solve_pt1 = (a, b) => {
    if (a === 0) {
      if (b === 0) {
        return [[], "PT vô số nghiệm"];
      } else {
        return [[], "PT vô nghiệm"];
      }
    } else {
      return [[-b / a], "PT có nghiệm"];
    }
  };
  const solve_pt2 = (a, b, c) => {
    if (a === 0) return solve_pt1(b, c);
    else {
      const delta = b * b - 4 * a * c;
      if (delta < 0) return [[], "PT vô nghiệm"];
      else if (delta === 0)
        return [[-b / (2 * a), -b / (2 * a)], "PT có nghiệm kép"];
      else
        return [
          [(-b + Math.sqrt(delta)) / (2 * a), (-b - Math.sqrt(delta)) / (2 * a)],
          "PT có hai nghiệm",
        ];
    }
  };
  const solve_pt3 = (a, b, c, d) => {
    console.log(a, b, c, d);
    //we will solve the equation of the form ax^3+bx^2+cx+d=0
    if (a === 0) return solve_pt2(b, c, d);
    else {
      const delta = b * b - 3 * a * c;
      const sq_delta = Math.sqrt(Math.abs(delta));
      if (delta === 0) {
        const result = (-b + Math.cbrt(b * b * b - 27 * a * a * d)) / (3 * a);
        return [[result, result, result], "PT có nghiệm bội"];
      }
      const k =
        (9 * a * b * c - 2 * b * b * b - 27 * a * a * d) /
        (2 * Math.pow(Math.sqrt(Math.abs(delta)), 3));
      if (delta > 0) {
        if (Math.abs(k) <= 1) {
          const cos = Math.cos(Math.acos(k) / 3);
          const x1 = (2 * sq_delta * cos - b) / (3 * a);
          const x2 =
            (2 * sq_delta * Math.cos(Math.acos(k) / 3 + (2 * Math.PI) / 3) - b) /
            (3 * a);
          const x3 =
            (2 * sq_delta * Math.cos(Math.acos(k) / 3 - (2 * Math.PI) / 3) - b) /
            (3 * a);
          return [[x1, x2, x3], "PT có 3 nghiệm"];
        } else {
          const x =
            ((sq_delta * Math.abs(k)) / (3 * a * k)) *
              (Math.cbrt(Math.abs(k) + Math.sqrt(k * k - 1)) +
                Math.cbrt(Math.abs(k) - Math.sqrt(k * k - 1))) -
            b / (3 * a);
          return [[x], "PT có nghiệm duy nhất"];
        }
      }
      if (delta < 0) {
        //const test =(Math.cbrt(k+Math.sqrt(k*k+1))+Math.cbrt(k-Math.sqrt(k*k+1)))
        const x =
          (sq_delta / (3 * a)) *
            (Math.cbrt(k + Math.sqrt(k * k + 1)) +
              Math.cbrt(k - Math.sqrt(k * k + 1))) -
          b / (3 * a);
        //const test1=(sq_delta)/(3*a)*(Math.cbrt(k+Math.sqrt(k*k+1))+Math.cbrt(k-Math.sqrt(k*k+1)));
        //test1=test1;
        return [[x], "PT có nghiệm duy nhất"];
      }
    }
  };
  const solve_pt4 = (_a, _b, _c, _d, _e) => {
    //we will solve the equation of the form ax^4+bx^3+cx^2+dx+e=0
    if (_a === 0) return solve_pt3(_b, _c, _d, _e);
    const a = _b / _a;
    const b = _c / _a;
    const c = _d / _a;
    const d = _e / _a;
  
    const y = Round_to10(
      solve_pt3(1, -b, a * c - 4 * d, -(c * c - 4 * b * d + a * a * d))[0][0]
    );
  
    const A = Math.sqrt(Round_to10((a * a) / 4 - b + y));
    let B = Math.sqrt(Round_to10((y * y) / 4 - d));
    if ((a * y) / 2 - c < 0) {
      B = B * -1;
    }
    let nghiem1 = solve_pt2(1, a / 2 - A, y / 2 - B);
    let nghiem2 = solve_pt2(1, a / 2 + A, y / 2 + B);
  
    return [nghiem1[0].concat(nghiem2[0]), nghiem1[1]];
  };
  function process_data([a, str]) {
    console.log(a);
    console.log(str);
    let state = "";
    if (typeof a !== "object") return "Lỗi . Vui lòng thử lại";
    let result = "";
    if (a.length === 0) {
      return str;
    }
    a=a.map((x)=>Round_to10(x));
    if (containsDuplicates(a) === false) {
      let key = 0;
      result = `PT có ${a.length} nghiệm phân biệt`;
      for (let i = 0; i < a.length; i++) {
        if (key >= 1) result += ",";
        result = result + ` ${a[i]}`;
        key++;
      }
    } else {
      result = `PT có ${new Set(a).size} nghiệm `;
      let dupe = countdupes(a);
      let numberofdupe = Object.keys(dupe).filter((key) => dupe[key] > 1).length;
      if (numberofdupe == 2) {
        result += `trong đó có: 2 nghiệm kép là`;
      }
      if (numberofdupe == 1) {
        let key = 0;
        result += "là: ";
        new Set(a).forEach((value) => {
          result += `${value}`;
          result += ", ";
          key++;
        });
      }
      let data = findDuplicates(a, numberofdupe);
  
      for (let i = 1; i <= numberofdupe; i++) {
        let number = data[i - 1]["number"];
        let dupetime = data[i - 1]["dupetime"];
        if (dupetime == 2) {
          state = ` nghiệm kép`;
        } else {
          state = ` nghiệm bội`;
        }
        if (numberofdupe == 2) {
          if (i == 2) result += ` và`;
          result += ` ${number}`;
        }
        if (numberofdupe == 1) {
          result += `trong dó có: 1${state} là ${number}`;
        }
      }
    }
  
    return result;
  }
  let answer = solve_pt3(1, 2, 3, 4);
  //module.exports={solve_pt1,solve_pt2,solve_pt3,solve_pt4};
  //console.log(process_data([1,1]))
  //console.log(solve_pt3(0,0,0,0))
  //console.log(solve_eqn([1,4,8,4,4]));
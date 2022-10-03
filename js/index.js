var staffList = [];
//---------------- THÊM NHÂN VIÊN -------------------
function themNV() {
  // Kiểm tra form user nhập chưa
  var isFormValid = validateForm();
  if (!isFormValid) return;
  // BƯỚC 1 : LẤY THÔNG TIN NGƯỜI DÙNG NHẬP VÀO
  var staffId = document.getElementById("tknv").value;
  var fullName = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  var date = document.getElementById("datepicker").value;
  var totalSalary = +document.getElementById("luongCB").value;
  var position = document.getElementById("chucvu").value;
  var workHour = +document.getElementById("gioLam").value;
  // BƯỚC 2 : CHECK TÀI KHOẢN CÓ BỊ TRÙNG HAY KHÔNG
  for (let i = 0; i < staffList.length; i++) {
    if (staffList[i].staffId === staffId) {
      alert("Tài khoản đã có người dùng!");
      return;
    }
  }
  // BƯỚC 3 : TẠO 1 OBJECT TỪ LỚP ĐỐI TƯỢNG
  var newStaff = new Staff(
    staffId,
    fullName,
    email,
    password,
    date,
    totalSalary,
    position,
    workHour
  );
  //
  staffList.push(newStaff);
  renderStaff();
  setLocalStorage();
}
// ----------- KIỂM TRA ĐẦU VÀO -------------
function validateForm() {
  var staffId = document.getElementById("tknv").value;
  var fullName = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  var date = document.getElementById("datepicker").value;
  var totalSalary = +document.getElementById("luongCB").value;
  var position = document.getElementById("chucvu").value;
  var workHour = +document.getElementById("gioLam").value;
  var isValid = true;
  // --- Check có nhập hay không ? và độ dài mã sv
  // Tai khoan
  isValid &= required(staffId, "tbTKNV");
  // Ho ten
  isValid &= required(fullName, "tbTen") && string(fullName, "tbTen");
  // Email
  isValid &= required(email, "tbEmail") && patternEmail(email, "tbEmail");
  // Mat khau
  isValid &=
    required(password, "tbMatKhau") && patternPassword(password, "tbMatKhau");
  // // Date
  // isValid &= required(date, "tbNgay") && patternDate(date, "tbNgay");
  // Luong
  isValid &=
    required(totalSalary, "tbLuongCB") &&
    patternPoint(totalSalary, "tbLuongCB");
  // // Chuc vu
  // isValid &= required(position, "tbChucVu");
  // Gio lam
  isValid &=
    required(workHour, "tbGiolam") && patternPoint(workHour, "tbGiolam");
  return isValid;
}
// ---------------- IN RA DANH SÁCH NHÂN VIÊN ----------
function renderStaff() {
  var tableHTML = "";
  for (let i = 0; i < staffList.length; i++) {
    var currentStaff = staffList[i];
    tableHTML += `<tr>
        <td>${currentStaff.staffId}</td>
        <td>${currentStaff.fullName}</td>
        <td>${currentStaff.email}</td>
        <td>${currentStaff.date}</td>
        <td>${currentStaff.position}</td>
        <td>${currentStaff.calcLuong().toLocaleString() + " " + "VND"}</td>
        <td>${currentStaff.calcXepLoai()}</td>
        <td><button onclick="deleteStaff('${
          currentStaff.staffId
        }')" class="btn btn-danger">Xóa</button></td>
        <td><button onclick="getUpdateStaff('${
          currentStaff.staffId
        }')" class="btn btn-info" id="Sua" data-toggle="modal"
        data-target="#myModal">Sửa</button></td>
      </tr>`;
  }
  document.getElementById("tableDanhSach").innerHTML = tableHTML;
}
//--LƯU DANH SÁCH SINH VIÊN DƯỚI TRANG WEB (LOCALSTROAGE)--
function setLocalStorage() {
  // JSON.stringify : chuyển object sang chuỗi
  var staffJSON = JSON.stringify(staffList);
  localStorage.setItem("StaffList", staffJSON);
}
//-- DO F5 REFESH LẠI TRANG THÌ BỊ MẤT DATA BAN ĐẦU NÊN PHẢI THÊM HÀM GET ĐỂ LƯU LẠI DATA --
function getLocalStorage() {
  var staffJSON = localStorage.getItem("StaffList");
  // KIỂM TRA XEM DƯỚI LOCALSTORAGE ĐÃ LƯU DATA CHƯA
  if (!staffJSON) return;
  // JSON.parse : chuyển chuỗi sang mảng
  staffList = mapData(JSON.parse(staffJSON));
  renderStaff();
}
// Do hàm JSON.stringify : chuyển object sang chuỗi => object bị mất phương thức => tạo thêm hàm mapData : dể tạo mới object khác từ Staff
function mapData(staffListLocal) {
  var result = [];
  for (let i = 0; i < staffListLocal.length; i++) {
    var oldStaff = staffListLocal[i];
    var newStaffMapData = new Staff(
      oldStaff.staffId,
      oldStaff.fullName,
      oldStaff.email,
      oldStaff.password,
      oldStaff.date,
      oldStaff.totalSalary,
      oldStaff.position,
      oldStaff.workHour
    );
    result.push(newStaffMapData);
  }
  return result;
}
// Tìm ra vị trí để xóa hoặc search
function findById(staffId) {
  // Button xóa
  for (let i = 0; i < staffList.length; i++) {
    if (staffList[i].staffId === staffId) return i;
  }
  return -1; // Không tìm thấy thì trả về -1
}
//------------- XÓA ------------------
function deleteStaff(staffId) {
  var index = findById(staffId);
  if (index === -1) {
    alert("ID không tồn tại");
    return;
  }
  staffList.splice(index, 1); // Xóa 1 thằng nên là -> 1
  setLocalStorage();
  renderStaff();
}
//------------- SEARCH------------------ =>> ĐANG LỖI
function searchStaffs() {
  var keywordSearch = document
    .querySelector("#searchName")
    .value.toLowerCase()
    .trim();
  var result = [];
  console.log(keywordSearch);
  for (let i = 0; i < staffList.length; i++) {
    if (
      staffList[i].staffId === keywordSearch ||
      staffList[i].fullName.toLowerCase().includes(keywordSearch)
    )
      result.push(staffList[i]);
  }
  renderStaff(result);
}
//---------------- UPDATE1 -----------------------
// => Lấy thông tin sinh viên show lên form điền (khi nhấn nút SỬA)
function getUpdateStaff(staffId) {
  var index = findById(staffId);
  if (index === -1) return alert("Tài khoản đã có người dùng");
  var staff = staffList[index];
  // Lấy thông tin staff lên input
  document.getElementById("tknv").value = staff.staffId;
  document.getElementById("name").value = staff.fullName;
  document.getElementById("email").value = staff.email;
  document.getElementById("password").value = staff.password;
  document.getElementById("datepicker").value = staff.date;
  document.getElementById("luongCB").value = staff.totalSalary;
  document.getElementById("chucvu").value = staff.position;
  document.getElementById("gioLam").value = staff.workHour;
  //--- Ẩn nút thêm người dùng
  document.getElementById("btnThemNV").style.display = "none";
  document.getElementById("tknv").disabled = true;
  document.getElementsByClassName("sp-thongbao").style.display = "none";
  document.getElementById("myForm2").reset();
}
//---------------- UPDATE2 -----------------------
function updateStaff() {
  // Lấy lại hết thông tin khi user sửa
  var staffId = document.getElementById("tknv").value;
  var fullName = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  var date = document.getElementById("datepicker").value;
  var totalSalary = +document.getElementById("luongCB").value;
  var position = document.getElementById("chucvu").value;
  var workHour = +document.getElementById("gioLam").value;
  var index = findById(staffId);
  var staff = staffList[index];
  staff.fullName = fullName;
  staff.email = email;
  staff.password = password;
  staff.date = date;
  staff.totalSalary = totalSalary;
  staff.position = position;
  staff.workHour = workHour;
  renderStaff();
  setLocalStorage();
  document.getElementById("btnDong").addEventListener("click", function () {
    document.getElementById("btnThemNV").style.display = "inline-block";
  });
  document.getElementById("tknv").disabled = false;
  // Tắt modal khi nhấn nút cập nhật
  document.getElementById("btnDong").click();
  document.getElementById("myForm").reset();
}

//-------------- VALIDATION----- : KIỂM TRA DATA ĐẦU VÀO
// required : check user nhập chưa ?
function required(val, spanID) {
  if (val.length === 0) {
    document.getElementById(spanID).innerHTML = "*Thông tin bắt buộc nhập";
    document.getElementById(spanID).style.display = "block";
    return false;
  }
  document.getElementById(spanID).style.display = "none";
  document.getElementById(spanID).innerHTML = "";
  return true;
}
// length : check độ dài input của user nhập
function length(val, spanID, min, max) {
  if (val.length < min || val.length > max) {
    document.getElementById(
      spanID
    ).innerHTML = `*Độ dài phải từ ${min} tới ${max} kí tự`;
    return false;
  }
  document.getElementById(spanID).innerHTML = "";
  document.getElementById(spanID).style.display = "block";
  return true;
}
//----------- Pattern check name ---------------
function string(val, spanID) {
  var pattern = /^[A-z ]+$/g;
  if (pattern.test(val)) {
    document.getElementById(spanID).innerHTML = "";
    return true;
  }
  document.getElementById(spanID).innerHTML = `*Chỉ chấp nhận kí tự từ a -> z`;
  return false;
}
//----------- Pattern check email ---------------
function patternEmail(val, spanID) {
  var pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  if (pattern.test(val)) {
    document.getElementById(spanID).innerHTML = "";
    return true;
  }
  document.getElementById(spanID).innerHTML = `*Email không hợp lệ `;
  document.getElementById(spanID).style.display = "block";
  return false;
}
//----------- Pattern check password --------------
function patternPassword(val, spanID) {
  var pattern =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/g;
  if (pattern.test(val)) {
    document.getElementById(spanID).innerHTML = "";
    return true;
  }
  document.getElementById(
    spanID
  ).innerHTML = `*Tối thiểu tám ký tự, ít nhất một chữ cái, một số và một ký tự đặc biệt:`;
  document.getElementById(spanID).style.display = "block";
  return false;
}
//----------- Pattern check date ---------------
// function patternDate(val, spanID) {
//   var pattern = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
//   if (pattern.test(val)) {
//     document.getElementById(spanID).innerHTML = "";
//     return true;
//   }
//   document.getElementById(spanID).innerHTML = `*Vui lòng chọn ngày`;
//   document.getElementById(spanID).style.display = "block";
//   return false;
// }
//----------- Pattern check point ---------------
function patternPoint(val, spanID) {
  var pattern = /^[0-9]+$/g;
  if (pattern.test(val)) {
    document.getElementById(spanID).innerHTML = "";
    return true;
  }
  document.getElementById(spanID).innerHTML = `*Vui lòng nhập số`;
  return false;
}
//----------- Pattern check select option ---------------
// function patternSelectOption(val, spanID) {
//   var pattern = /^[-]{2} Select [-]{2}$/;
//   if (pattern.test(val)) {
//     document.getElementById(spanID).innerHTML = "";
//     return true;
//   }
//   document.getElementById(spanID).innerHTML = `*Vui lòng chọn chức vụ`;
//   document.getElementById(spanID).style.display = "block";
//   return false;
// }
//------- Tự đông lấy data khi Refresh lại trang -----
window.onload = function () {
  getLocalStorage();
};

// function ex1() {
//   var a = [1, 4, 2, 7, 5, 10, 9, 5];
//   var obj = {};
//   for (let i = 0; i < a.length; i++) {
//     var currentNumber = a[i];
//     var foundNumber = 10 - currentNumber;
//     if (foundNumber in obj) {
//       console.log(currentNumber, foundNumber);
//       delete obj[foundNumber];
//     } else {
//       obj[currentNumber] = true;
//     }
//   }
//   console.log("Khong co");
//   console.log(obj);
// }
// ex1();

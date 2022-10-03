function Staff(
  id,
  name,
  email,
  password,
  date,
  totalSalary,
  position,
  workHour
) {
  this.staffId = id;
  this.fullName = name;
  this.email = email;
  this.password = password;
  this.date = date;
  this.totalSalary = totalSalary;
  this.position = position;
  this.workHour = workHour;
  this.calcLuong = function () {
    if (this.position === "Sếp") return this.totalSalary * 3;
    else if (this.position === "Trưởng phòng") return this.totalSalary * 2;
    else {
      return this.totalSalary * 1;
    }
  };
  this.calcXepLoai = function () {
    if (this.workHour >= 192) return "Xuất sắc";
    else if (this.workHour >= 176) return "Giỏi";
    else if (this.workHour >= 160) return "Khá";
    else {
      return "Trung bình";
    }
  };
}

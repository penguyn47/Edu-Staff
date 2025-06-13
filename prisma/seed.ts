import { PrismaClient, StudentSex, IdentificationType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed Faculties
  const faculties = [
    { name: "Khoa Luật" },
    { name: "Khoa Tiếng Anh thương mại" },
    { name: "Khoa Tiếng Nhật" },
    { name: "Khoa Tiếng Pháp" },
  ];

  for (const faculty of faculties) {
    await prisma.faculty.create({
      data: faculty,
    });
  }

  // Seed Programs
  const programs = [
    { name: "Cử nhân Luật" },
    { name: "Cử nhân Tiếng Anh thương mại" },
    { name: "Cử nhân Tiếng Nhật" },
    { name: "Cử nhân Tiếng Pháp" },
  ];

  for (const program of programs) {
    await prisma.program.create({
      data: program,
    });
  }

  // Seed Student Statuses
  const statuses = [
    { name: "Đang học" },
    { name: "Đã tốt nghiệp" },
    { name: "Đã tạm dừng" },
    { name: "Đã thôi học" },
  ];

  for (const status of statuses) {
    await prisma.studentStatus.create({
      data: status,
    });
  }

  // Seed Addresses
  const addresses = [
    {
      houseNumber: "123",
      street: "Trần Hưng Đạo",
      ward: "Phường Cửa Nam",
      district: "Quận Hoàn Kiếm",
      city: "Hà Nội",
      country: "Việt Nam",
    },
    {
      houseNumber: "456",
      street: "Lê Lợi",
      ward: "Phường Bến Thành",
      district: "Quận 1",
      city: "TP. Hồ Chí Minh",
      country: "Việt Nam",
    },
    {
      houseNumber: "789",
      street: "Nguyễn Trãi",
      ward: "Phường Hòa Cường Bắc",
      district: "Quận Hải Châu",
      city: "Đà Nẵng",
      country: "Việt Nam",
    },
    {
      houseNumber: "101",
      street: "Lý Thường Kiệt",
      ward: "Phường Hàng Bài",
      district: "Quận Hoàn Kiếm",
      city: "Hà Nội",
      country: "Việt Nam",
    },
    {
      houseNumber: "202",
      street: "Hoàng Diệu",
      ward: "Phường Linh Chiểu",
      district: "Quận Thủ Đức",
      city: "TP. Hồ Chí Minh",
      country: "Việt Nam",
    },
    {
      houseNumber: "303",
      street: "Bà Triệu",
      ward: "Phường Lê Đại Hành",
      district: "Quận Hai Bà Trưng",
      city: "Hà Nội",
      country: "Việt Nam",
    },
    {
      houseNumber: "404",
      street: "Hai Bà Trưng",
      ward: "Phường Tân Định",
      district: "Quận 3",
      city: "TP. Hồ Chí Minh",
      country: "Việt Nam",
    },
    {
      houseNumber: "505",
      street: "Nguyễn Huệ",
      ward: "Phường Phú Khương",
      district: "Thành phố Huế",
      city: "Thừa Thiên Huế",
      country: "Việt Nam",
    },
    {
      houseNumber: "606",
      street: "Trần Phú",
      ward: "Phường 5",
      district: "Thành phố Cần Thơ",
      city: "Cần Thơ",
      country: "Việt Nam",
    },
    {
      houseNumber: "707",
      street: "Lê Lai",
      ward: "Phường An Khánh",
      district: "Quận Ninh Kiều",
      city: "Cần Thơ",
      country: "Việt Nam",
    },
  ];

  for (const address of addresses) {
    await prisma.address.create({
      data: address,
    });
  }

  // Fetch created records for mapping
  const facultyRecords = await prisma.faculty.findMany();
  const programRecords = await prisma.program.findMany();
  const statusRecords = await prisma.studentStatus.findMany();
  const addressRecords = await prisma.address.findMany();

  const facultyMap = new Map(facultyRecords.map((f) => [f.name, f.id]));
  const programMap = new Map(programRecords.map((p) => [p.name, p.id]));
  const statusMap = new Map(statusRecords.map((s) => [s.name, s.id]));
  const addressMap = new Map(
    addressRecords.map((a) => [`${a.houseNumber} ${a.street}`, a.id]),
  );

  // Seed Students (15 records)
  const students = [
    {
      studentId: "SV001",
      name: "Nguyễn Văn An",
      dob: new Date("2000-01-15"),
      sex: StudentSex.MALE,
      cohort: 2020,
      phone: "0912345678",
      email: "an.nguyen@edu.vn",
      zipCode: 100000,
      nationality: "Việt Nam",
      statusId: statusMap.get("Đang học")!,
      facultyId: facultyMap.get("Khoa Luật")!,
      programId: programMap.get("Cử nhân Luật")!,
      permaAddressId: addressMap.get("123 Trần Hưng Đạo")!,
      tempAddressId: addressMap.get("123 Trần Hưng Đạo")!,
    },
    {
      studentId: "SV002",
      name: "Trần Thị Bình",
      dob: new Date("2001-03-22"),
      sex: StudentSex.FEMALE,
      cohort: 2021,
      phone: "0987654321",
      email: "binh.tran@edu.vn",
      zipCode: 700000,
      nationality: "Việt Nam",
      statusId: statusMap.get("Đang học")!,
      facultyId: facultyMap.get("Khoa Tiếng Anh thương mại")!,
      programId: programMap.get("Cử nhân Tiếng Anh thương mại")!,
      permaAddressId: addressMap.get("456 Lê Lợi")!,
      tempAddressId: null,
    },
    {
      studentId: "SV003",
      name: "Lê Minh Châu",
      dob: new Date("1999-07-10"),
      sex: StudentSex.MALE,
      cohort: 2019,
      phone: "0935123456",
      email: "chau.le@edu.vn",
      zipCode: 550000,
      nationality: "Việt Nam",
      statusId: statusMap.get("Đã tốt nghiệp")!,
      facultyId: facultyMap.get("Khoa Tiếng Nhật")!,
      programId: programMap.get("Cử nhân Tiếng Nhật")!,
      permaAddressId: addressMap.get("789 Nguyễn Trãi")!,
      tempAddressId: addressMap.get("789 Nguyễn Trãi")!,
    },
    {
      studentId: "SV004",
      name: "Phạm Thị Dung",
      dob: new Date("2002-05-18"),
      sex: StudentSex.FEMALE,
      cohort: 2022,
      phone: "0901234567",
      email: "dung.pham@edu.vn",
      zipCode: 100000,
      nationality: "Việt Nam",
      statusId: statusMap.get("Đang học")!,
      facultyId: facultyMap.get("Khoa Tiếng Pháp")!,
      programId: programMap.get("Cử nhân Tiếng Pháp")!,
      permaAddressId: null,
      tempAddressId: null,
    },
    {
      studentId: "SV005",
      name: "Hoàng Văn Nam",
      dob: new Date("2000-11-30"),
      sex: StudentSex.MALE,
      cohort: 2020,
      phone: "0945678901",
      email: "nam.hoang@edu.vn",
      zipCode: 100000,
      nationality: "Việt Nam",
      statusId: statusMap.get("Đã tạm dừng")!,
      facultyId: facultyMap.get("Khoa Luật")!,
      programId: programMap.get("Cử nhân Luật")!,
      permaAddressId: addressMap.get("101 Lý Thường Kiệt")!,
      tempAddressId: addressMap.get("101 Lý Thường Kiệt")!,
    },
    {
      studentId: "SV006",
      name: "Vũ Thị Hoa",
      dob: new Date("2001-09-05"),
      sex: StudentSex.FEMALE,
      cohort: 2021,
      phone: "0923456789",
      email: "hoa.vu@edu.vn",
      zipCode: 700000,
      nationality: "Việt Nam",
      statusId: statusMap.get("Đang học")!,
      facultyId: facultyMap.get("Khoa Tiếng Anh thương mại")!,
      programId: programMap.get("Cử nhân Tiếng Anh thương mại")!,
      permaAddressId: addressMap.get("202 Hoàng Diệu")!,
      tempAddressId: addressMap.get("202 Hoàng Diệu")!,
    },
    {
      studentId: "SV007",
      name: "Đỗ Minh Quân",
      dob: new Date("1998-12-12"),
      sex: StudentSex.MALE,
      cohort: 2018,
      phone: null,
      email: "quan.do@edu.vn",
      zipCode: 100000,
      nationality: "Việt Nam",
      statusId: statusMap.get("Đã tốt nghiệp")!,
      facultyId: facultyMap.get("Khoa Tiếng Nhật")!,
      programId: programMap.get("Cử nhân Tiếng Nhật")!,
      permaAddressId: addressMap.get("303 Bà Triệu")!,
      tempAddressId: addressMap.get("303 Bà Triệu")!,
    },
    {
      studentId: "SV008",
      name: "Nguyễn Thị Lan",
      dob: new Date("2002-02-25"),
      sex: StudentSex.FEMALE,
      cohort: 2022,
      phone: "0971234567",
      email: null,
      zipCode: 700000,
      nationality: "Việt Nam",
      statusId: statusMap.get("Đang học")!,
      facultyId: facultyMap.get("Khoa Tiếng Pháp")!,
      programId: programMap.get("Cử nhân Tiếng Pháp")!,
      permaAddressId: addressMap.get("404 Hai Bà Trưng")!,
      tempAddressId: null,
    },
    {
      studentId: "SV009",
      name: "Trần Văn Khải",
      dob: new Date("2000-04-08"),
      sex: StudentSex.MALE,
      cohort: 2020,
      phone: "0967891234",
      email: "khai.tran@edu.vn",
      zipCode: 530000,
      nationality: "Việt Nam",
      statusId: statusMap.get("Đã thôi học")!,
      facultyId: facultyMap.get("Khoa Luật")!,
      programId: programMap.get("Cử nhân Luật")!,
      permaAddressId: addressMap.get("505 Nguyễn Huệ")!,
      tempAddressId: addressMap.get("505 Nguyễn Huệ")!,
    },
    {
      studentId: "SV010",
      name: "Lê Thị Mai",
      dob: new Date("2001-06-17"),
      sex: StudentSex.FEMALE,
      cohort: 2021,
      phone: "0956789012",
      email: "mai.le@edu.vn",
      zipCode: 700000,
      nationality: "Việt Nam",
      statusId: statusMap.get("Đang học")!,
      facultyId: facultyMap.get("Khoa Tiếng Anh thương mại")!,
      programId: programMap.get("Cử nhân Tiếng Anh thương mại")!,
      permaAddressId: null,
      tempAddressId: null,
    },
    {
      studentId: "SV011",
      name: "Phạm Văn Long",
      dob: new Date("1999-08-20"),
      sex: StudentSex.MALE,
      cohort: 2019,
      phone: "0916782345",
      email: "long.pham@edu.vn",
      zipCode: 900000,
      nationality: "Việt Nam",
      statusId: statusMap.get("Đã tốt nghiệp")!,
      facultyId: facultyMap.get("Khoa Tiếng Nhật")!,
      programId: programMap.get("Cử nhân Tiếng Nhật")!,
      permaAddressId: addressMap.get("606 Trần Phú")!,
      tempAddressId: addressMap.get("606 Trần Phú")!,
    },
    {
      studentId: "SV012",
      name: "Hoàng Thị Ngọc",
      dob: new Date("2002-10-03"),
      sex: StudentSex.FEMALE,
      cohort: 2022,
      phone: "0937894561",
      email: "ngoc.hoang@edu.vn",
      zipCode: 900000,
      nationality: "Việt Nam",
      statusId: statusMap.get("Đang học")!,
      facultyId: facultyMap.get("Khoa Tiếng Pháp")!,
      programId: programMap.get("Cử nhân Tiếng Pháp")!,
      permaAddressId: addressMap.get("707 Lê Lai")!,
      tempAddressId: addressMap.get("707 Lê Lai")!,
    },
    {
      studentId: "SV013",
      name: "Vũ Minh Tuấn",
      dob: new Date("2000-03-14"),
      sex: StudentSex.MALE,
      cohort: 2020,
      phone: null,
      email: "tuan.vu@edu.vn",
      zipCode: 700000,
      nationality: "Việt Nam",
      statusId: statusMap.get("Đã tạm dừng")!,
      facultyId: facultyMap.get("Khoa Luật")!,
      programId: programMap.get("Cử nhân Luật")!,
      permaAddressId: addressMap.get("404 Hai Bà Trưng")!,
      tempAddressId: addressMap.get("404 Hai Bà Trưng")!,
    },
    {
      studentId: "SV014",
      name: "Nguyễn Thị Thủy",
      dob: new Date("2001-01-27"),
      sex: StudentSex.FEMALE,
      cohort: 2021,
      phone: "0941237890",
      email: "thuy.nguyen@edu.vn",
      zipCode: 100000,
      nationality: "Việt Nam",
      statusId: statusMap.get("Đang học")!,
      facultyId: facultyMap.get("Khoa Tiếng Anh thương mại")!,
      programId: programMap.get("Cử nhân Tiếng Anh thương mại")!,
      permaAddressId: addressMap.get("123 Trần Hưng Đạo")!,
      tempAddressId: addressMap.get("123 Trần Hưng Đạo")!,
    },
    {
      studentId: "SV015",
      name: "Trần Văn Phúc",
      dob: new Date("1999-05-09"),
      sex: StudentSex.MALE,
      cohort: 2019,
      phone: "0926781234",
      email: "phuc.tran@edu.vn",
      zipCode: 530000,
      nationality: "Việt Nam",
      statusId: statusMap.get("Đã thôi học")!,
      facultyId: facultyMap.get("Khoa Tiếng Nhật")!,
      programId: programMap.get("Cử nhân Tiếng Nhật")!,
      permaAddressId: addressMap.get("505 Nguyễn Huệ")!,
      tempAddressId: addressMap.get("505 Nguyễn Huệ")!,
    },
  ];

  for (const student of students) {
    await prisma.student.create({
      data: student,
    });
  }

  // Fetch created students for mapping
  const studentRecords = await prisma.student.findMany();
  const studentMap = new Map(studentRecords.map((s) => [s.studentId, s.id]));

  // Seed Identifications
  const identifications = [
    {
      type: IdentificationType.CCCD,
      number: "012345678901",
      issueDate: new Date("2020-06-01"),
      expiryDate: new Date("2030-06-01"),
      issuePlace: "Hà Nội",
      hasChip: true,
      issuingCountry: null,
      notes: null,
      studentId: studentMap.get("SV001")!,
    },
    {
      type: IdentificationType.PASSPORT,
      number: "A12345678",
      issueDate: new Date("2021-08-15"),
      expiryDate: new Date("2031-08-15"),
      issuePlace: "TP. Hồ Chí Minh",
      hasChip: null,
      issuingCountry: "Việt Nam",
      notes: "Visa valid until 2025",
      studentId: studentMap.get("SV002")!,
    },
    {
      type: IdentificationType.CMND,
      number: "123456789",
      issueDate: new Date("2019-03-10"),
      expiryDate: null,
      issuePlace: "Đà Nẵng",
      hasChip: null,
      issuingCountry: null,
      notes: null,
      studentId: studentMap.get("SV003")!,
    },
    {
      type: IdentificationType.CCCD,
      number: "098765432109",
      issueDate: new Date("2022-01-20"),
      expiryDate: new Date("2032-01-20"),
      issuePlace: "Hà Nội",
      hasChip: false,
      issuingCountry: null,
      notes: null,
      studentId: studentMap.get("SV004")!,
    },
    {
      type: IdentificationType.PASSPORT,
      number: "B98765432",
      issueDate: new Date("2020-11-05"),
      expiryDate: new Date("2030-11-05"),
      issuePlace: "Hà Nội",
      hasChip: null,
      issuingCountry: "Việt Nam",
      notes: null,
      studentId: studentMap.get("SV005")!,
    },
    {
      type: IdentificationType.CCCD,
      number: "112233445566",
      issueDate: new Date("2021-04-10"),
      expiryDate: new Date("2031-04-10"),
      issuePlace: "TP. Hồ Chí Minh",
      hasChip: true,
      issuingCountry: null,
      notes: null,
      studentId: studentMap.get("SV006")!,
    },
    {
      type: IdentificationType.CMND,
      number: "987654321",
      issueDate: new Date("2018-09-15"),
      expiryDate: null,
      issuePlace: "Hà Nội",
      hasChip: null,
      issuingCountry: null,
      notes: null,
      studentId: studentMap.get("SV007")!,
    },
    {
      type: IdentificationType.PASSPORT,
      number: "C45678912",
      issueDate: new Date("2022-03-01"),
      expiryDate: new Date("2032-03-01"),
      issuePlace: "TP. Hồ Chí Minh",
      hasChip: null,
      issuingCountry: "Việt Nam",
      notes: null,
      studentId: studentMap.get("SV008")!,
    },
    {
      type: IdentificationType.CCCD,
      number: "223344556677",
      issueDate: new Date("2020-07-20"),
      expiryDate: new Date("2030-07-20"),
      issuePlace: "Thừa Thiên Huế",
      hasChip: true,
      issuingCountry: null,
      notes: null,
      studentId: studentMap.get("SV009")!,
    },
    {
      type: IdentificationType.CMND,
      number: "456789123",
      issueDate: new Date("2019-05-10"),
      expiryDate: null,
      issuePlace: "TP. Hồ Chí Minh",
      hasChip: null,
      issuingCountry: null,
      notes: null,
      studentId: studentMap.get("SV010")!,
    },
    {
      type: IdentificationType.PASSPORT,
      number: "D78912345",
      issueDate: new Date("2021-06-15"),
      expiryDate: new Date("2031-06-15"),
      issuePlace: "Cần Thơ",
      hasChip: null,
      issuingCountry: "Việt Nam",
      notes: "Student visa",
      studentId: studentMap.get("SV011")!,
    },
    {
      type: IdentificationType.CCCD,
      number: "334455667788",
      issueDate: new Date("2022-02-25"),
      expiryDate: new Date("2032-02-25"),
      issuePlace: "Cần Thơ",
      hasChip: false,
      issuingCountry: null,
      notes: null,
      studentId: studentMap.get("SV012")!,
    },
    {
      type: IdentificationType.CMND,
      number: "789123456",
      issueDate: new Date("2018-11-30"),
      expiryDate: null,
      issuePlace: "TP. Hồ Chí Minh",
      hasChip: null,
      issuingCountry: null,
      notes: null,
      studentId: studentMap.get("SV013")!,
    },
    {
      type: IdentificationType.PASSPORT,
      number: "E12345678",
      issueDate: new Date("2021-09-10"),
      expiryDate: new Date("2031-09-10"),
      issuePlace: "Hà Nội",
      hasChip: null,
      issuingCountry: "Việt Nam",
      notes: null,
      studentId: studentMap.get("SV014")!,
    },
    {
      type: IdentificationType.CCCD,
      number: "445566778899",
      issueDate: new Date("2020-05-05"),
      expiryDate: new Date("2030-05-05"),
      issuePlace: "Thừa Thiên Huế",
      hasChip: true,
      issuingCountry: null,
      notes: null,
      studentId: studentMap.get("SV015")!,
    },
  ];

  for (const identification of identifications) {
    await prisma.identification.create({
      data: identification,
    });
  }
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
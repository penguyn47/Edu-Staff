import { PrismaClient, StudentSex, StudentStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const faculties = [
    { name: 'Khoa Luật' },
    { name: 'Khoa Tiếng Anh thương mại' },
    { name: 'Khoa Tiếng Nhật' },
    { name: 'Khoa Tiếng Pháp' },
  ];

  for (const faculty of faculties) {
    await prisma.faculty.create({
      data: faculty,
    });
  }

  const programs = [
    { name: 'Cử nhân Luật' },
    { name: 'Cử nhân Tiếng Anh thương mại' },
    { name: 'Cử nhân Tiếng Nhật' },
    { name: 'Cử nhân Tiếng Pháp' },
  ];

  for (const program of programs) {
    await prisma.program.create({
      data: program,
    });
  }

  const statuses = [
    { name: 'Đang học' },
    { name: 'Đã tốt nghiệp' },
    { name: 'Đã tạm dừng' },
    { name: 'Đã thôi học' },
  ];

  for (const status of statuses) {
    await prisma.studentStatus.create({
      data: status,
    });
  }

  const facultyRecords = await prisma.faculty.findMany();
  const programRecords = await prisma.program.findMany();
  const statusRecords = await prisma.studentStatus.findMany();

  const facultyMap = new Map(facultyRecords.map(f => [f.name, f.id]));
  const programMap = new Map(programRecords.map(p => [p.name, p.id]));
  const statusMap = new Map(statusRecords.map(s => [s.name, s.id]));

  const students = [
    {
      studentId: 'SV001',
      name: 'Nguyễn Văn An',
      dob: new Date('2000-01-15'),
      sex: StudentSex.MALE,
      cohort: 2020,
      address: '123 Trần Hưng Đạo, Hà Nội',
      phone: '0912345678',
      email: 'an.nguyen@edu.vn',
      statusId: statusMap.get('Đang học')!,
      facultyId: facultyMap.get('Khoa Luật')!,
      programId: programMap.get('Cử nhân Luật')!,
    },
    {
      studentId: 'SV002',
      name: 'Trần Thị Bình',
      dob: new Date('2001-03-22'),
      sex: StudentSex.FEMALE,
      cohort: 2021,
      address: '456 Lê Lợi, TP. Hồ Chí Minh',
      phone: '0987654321',
      email: 'binh.tran@edu.vn',
      statusId: statusMap.get('Đang học')!,
      facultyId: facultyMap.get('Khoa Tiếng Anh thương mại')!,
      programId: programMap.get('Cử nhân Tiếng Anh thương mại')!,
    },
    {
      studentId: 'SV003',
      name: 'Lê Minh Châu',
      dob: new Date('1999-07-10'),
      sex: StudentSex.MALE,
      cohort: 2019,
      address: '789 Nguyễn Trãi, Đà Nẵng',
      phone: '0935123456',
      email: 'chau.le@edu.vn',
      statusId: statusMap.get('Đã tốt nghiệp')!,
      facultyId: facultyMap.get('Khoa Tiếng Nhật')!,
      programId: programMap.get('Cử nhân Tiếng Nhật')!,
    },
    {
      studentId: 'SV004',
      name: 'Phạm Thị Dung',
      dob: new Date('2002-05-18'),
      sex: StudentSex.FEMALE,
      cohort: 2022,
      address: null,
      phone: '0901234567',
      email: 'dung.pham@edu.vn',
      statusId: statusMap.get('Đang học')!,
      facultyId: facultyMap.get('Khoa Tiếng Pháp')!,
      programId: programMap.get('Cử nhân Tiếng Pháp')!,
    },
    {
      studentId: 'SV005',
      name: 'Hoàng Văn Nam',
      dob: new Date('2000-11-30'),
      sex: StudentSex.MALE,
      cohort: 2020,
      address: '101 Lý Thường Kiệt, Hà Nội',
      phone: '0945678901',
      email: 'nam.hoang@edu.vn',
      statusId: statusMap.get('Đã tạm dừng')!,
      facultyId: facultyMap.get('Khoa Luật')!,
      programId: programMap.get('Cử nhân Luật')!,
    },
    {
      studentId: 'SV006',
      name: 'Vũ Thị Hoa',
      dob: new Date('2001-09-05'),
      sex: StudentSex.FEMALE,
      cohort: 2021,
      address: '202 Hoàng Diệu, Huế',
      phone: '0923456789',
      email: 'hoa.vu@edu.vn',
      statusId: statusMap.get('Đang học')!,
      facultyId: facultyMap.get('Khoa Tiếng Anh thương mại')!,
      programId: programMap.get('Cử nhân Tiếng Anh thương mại')!,
    },
    {
      studentId: 'SV007',
      name: 'Đỗ Minh Quân',
      dob: new Date('1998-12-12'),
      sex: StudentSex.MALE,
      cohort: 2018,
      address: '303 Bà Triệu, Hà Nội',
      phone: null,
      email: 'quan.do@edu.vn',
      statusId: statusMap.get('Đã tốt nghiệp')!,
      facultyId: facultyMap.get('Khoa Tiếng Nhật')!,
      programId: programMap.get('Cử nhân Tiếng Nhật')!,
    },
    {
      studentId: 'SV008',
      name: 'Nguyễn Thị Lan',
      dob: new Date('2002-02-25'),
      sex: StudentSex.FEMALE,
      cohort: 2022,
      address: '404 Hai Bà Trưng, TP. Hồ Chí Minh',
      phone: '0971234567',
      email: null,
      statusId: statusMap.get('Đang học')!,
      facultyId: facultyMap.get('Khoa Tiếng Pháp')!,
      programId: programMap.get('Cử nhân Tiếng Pháp')!,
    },
    {
      studentId: 'SV009',
      name: 'Trần Văn Khải',
      dob: new Date('2000-04-08'),
      sex: StudentSex.MALE,
      cohort: 2020,
      address: '505 Nguyễn Huệ, Đà Nẵng',
      phone: '0967891234',
      email: 'khai.tran@edu.vn',
      statusId: statusMap.get('Đã thôi học')!,
      facultyId: facultyMap.get('Khoa Luật')!,
      programId: programMap.get('Cử nhân Luật')!,
    },
    {
      studentId: 'SV010',
      name: 'Lê Thị Mai',
      dob: new Date('2001-06-17'),
      sex: StudentSex.FEMALE,
      cohort: 2021,
      address: null,
      phone: '0956789012',
      email: 'mai.le@edu.vn',
      statusId: statusMap.get('Đang học')!,
      facultyId: facultyMap.get('Khoa Tiếng Anh thương mại')!,
      programId: programMap.get('Cử nhân Tiếng Anh thương mại')!,
    },
    {
      studentId: 'SV011',
      name: 'Phạm Văn Long',
      dob: new Date('1999-08-20'),
      sex: StudentSex.MALE,
      cohort: 2019,
      address: '606 Trần Phú, Cần Thơ',
      phone: '0916782345',
      email: 'long.pham@edu.vn',
      statusId: statusMap.get('Đã tốt nghiệp')!,
      facultyId: facultyMap.get('Khoa Tiếng Nhật')!,
      programId: programMap.get('Cử nhân Tiếng Nhật')!,
    },
    {
      studentId: 'SV012',
      name: 'Hoàng Thị Ngọc',
      dob: new Date('2002-10-03'),
      sex: StudentSex.FEMALE,
      cohort: 2022,
      address: '707 Lê Lai, Hà Nội',
      phone: '0937894561',
      email: 'ngoc.hoang@edu.vn',
      statusId: statusMap.get('Đang học')!,
      facultyId: facultyMap.get('Khoa Tiếng Pháp')!,
      programId: programMap.get('Cử nhân Tiếng Pháp')!,
    },
    {
      studentId: 'SV013',
      name: 'Vũ Minh Tuấn',
      dob: new Date('2000-03-14'),
      sex: StudentSex.MALE,
      cohort: 2020,
      address: '808 Võ Văn Kiệt, TP. Hồ Chí Minh',
      phone: null,
      email: 'tuan.vu@edu.vn',
      statusId: statusMap.get('Đã tạm dừng')!,
      facultyId: facultyMap.get('Khoa Luật')!,
      programId: programMap.get('Cử nhân Luật')!,
    },
    {
      studentId: 'SV014',
      name: 'Nguyễn Thị Thủy',
      dob: new Date('2001-01-27'),
      sex: StudentSex.FEMALE,
      cohort: 2021,
      address: '909 Nguyễn Văn Cừ, Hà Nội',
      phone: '0941237890',
      email: 'thuy.nguyen@edu.vn',
      statusId: statusMap.get('Đang học')!,
      facultyId: facultyMap.get('Khoa Tiếng Anh thương mại')!,
      programId: programMap.get('Cử nhân Tiếng Anh thương mại')!,
    },
    {
      studentId: 'SV015',
      name: 'Trần Văn Phúc',
      dob: new Date('1999-05-09'),
      sex: StudentSex.MALE,
      cohort: 2019,
      address: '1010 Lý Nam Đế, Huế',
      phone: '0926781234',
      email: 'phuc.tran@edu.vn',
      statusId: statusMap.get('Đã thôi học')!,
      facultyId: facultyMap.get('Khoa Tiếng Nhật')!,
      programId: programMap.get('Cử nhân Tiếng Nhật')!,
    },
  ];

  for (const student of students) {
    await prisma.student.create({
      data: student,
    });
  }
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
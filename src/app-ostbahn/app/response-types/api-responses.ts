export interface Student {
  id: number,
  name: string,
  grades: Grade[],
  warnings: Warning[]
}

export interface Grade {
  studentId: number,
  subject: string,
  value: number
  teacher: string,
}

export interface Subject {
  name: string
}

export interface Warning {
  studentId: number,
  subject: string,
  time: Date;
  teacher: string;
}

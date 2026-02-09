
export interface SignatureData {
  studentName: string;
  studentSignature: string; // Base64 image
  studentDate: string;
  teacherSignature: string; // Base64 image
  teacherDate: string;
}

export interface BookContent {
  title: string;
  pages: PageData[];
}

export interface PageData {
  id: number;
  title: string;
  content: string[];
  emoji: string;
  color: string;
}

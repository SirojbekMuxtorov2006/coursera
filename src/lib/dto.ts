export type CourseListItemDTO = {
  id: string;
  title: string;
  slug: string;
  shortDesc: string | null;
  thumbnail: string | null;
  price: number;
  isFree: boolean;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  category: string | null;
  tags: string[];
  createdAt: string;
  author: { name: string | null; image: string | null };
  totalLessons: number;
  totalDuration: number;
  averageRating: number;
  studentCount: number;
};

export type CourseDetailDTO = {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDesc: string | null;
  thumbnail: string | null;
  price: number;
  isFree: boolean;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  category: string | null;
  tags: string[];
  author: { id: string; name: string | null; image: string | null };
  entitled: boolean;
  sections: Array<{
    id: string;
    title: string;
    position: number;
    lessons: Array<{
      id: string;
      title: string;
      description: string | null;
      duration: number | null;
      position: number;
      isFree: boolean;
      videoUrl: string | null;
      content: string | null;
    }>;
  }>;
};


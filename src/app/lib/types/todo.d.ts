interface ITodo {
  id: string;
  userId: string;
  title: string;
  content?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

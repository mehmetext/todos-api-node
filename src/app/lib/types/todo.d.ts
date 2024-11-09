interface ITodo {
  id: string;
  title: string;
  content?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

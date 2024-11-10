import { Todo } from "@prisma/client";

const todos: Todo[] = [
  {
    id: "a1b2c3d4",
    userId: "user123",
    title: "Buy milk",
    content: "Buy milk from the store",
    completed: false,
    createdAt: new Date("2023-05-01T10:30:00Z"),
    updatedAt: new Date("2023-05-01T10:30:00Z"),
  },
  {
    id: "e5f6g7h8",
    userId: "user456",
    title: "Buy bread",
    content: "Buy bread from the store",
    completed: false,
    createdAt: new Date("2023-05-02T09:15:00Z"),
    updatedAt: new Date("2023-05-02T14:45:00Z"),
  },
  {
    id: "i9j0k1l2",
    userId: "user123",
    title: "Call dentist",
    content: "Make an appointment for dental check-up",
    completed: true,
    createdAt: new Date("2023-04-28T11:00:00Z"),
    updatedAt: new Date("2023-05-03T16:20:00Z"),
  },
  {
    id: "m3n4o5p6",
    userId: "user234",
    title: "Complete project report",
    content: "Finish quarterly project documentation",
    completed: false,
    createdAt: new Date("2023-04-25T08:00:00Z"),
    updatedAt: new Date("2023-05-04T17:30:00Z"),
  },
  {
    id: "q7r8s9t0",
    userId: "user567",
    title: "Exercise",
    content: null,
    completed: false,
    createdAt: new Date("2023-05-03T06:45:00Z"),
    updatedAt: new Date("2023-05-03T06:45:00Z"),
  },
  {
    id: "u1v2w3x4",
    userId: "user123",
    title: "Pay bills",
    content: "Pay electricity and water bills",
    completed: true,
    createdAt: new Date("2023-04-30T18:00:00Z"),
    updatedAt: new Date("2023-05-02T12:10:00Z"),
  },
  {
    id: "y5z6a7b8",
    userId: "user321",
    title: "Clean house",
    content: "Vacuum and dust the living room",
    completed: false,
    createdAt: new Date("2023-05-04T09:30:00Z"),
    updatedAt: new Date("2023-05-04T09:30:00Z"),
  },
];

export default todos;

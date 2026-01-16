export type ActivityResponse = {
  id: number;
  datetime: string;
  roomId: string;
  roomName: string;
  newState: 0 | 1;
  source: "api" | "button";
};

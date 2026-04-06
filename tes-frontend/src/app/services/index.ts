import { authService } from "@/app/services/auth.service";
import { bestiaryService } from "@/app/services/bestiary.service";
import { bookService } from "@/app/services/book.service";
import { mapService } from "@/app/services/map.service";
import { quizService } from "@/app/services/quiz.service";
import { tavernService } from "@/app/services/tavern.service";
import { userService } from "@/app/services/user.service";

export const appServices = {
  authService,
  userService,
  bestiaryService,
  mapService,
  bookService,
  tavernService,
  quizService,
};

export type AppServices = typeof appServices;


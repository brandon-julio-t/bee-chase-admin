import { createContext } from "react";
import Game from "../models/game";

export const currentlyViewedGameContext = createContext<Game | null>(null);

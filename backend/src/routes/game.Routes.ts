import { Router, RequestHandler } from "express";
import { gameController } from "../controllers/game.controller";
import { auth } from "../middleware/auth";

const router = Router();

// All routes require authentication
router.use(auth);

// Game routes
router.post("/create", gameController.createMatch as RequestHandler);
router.get("/active", gameController.getActiveGames as RequestHandler);
router.get("/history", gameController.getGameHistory as RequestHandler);
router.get("/:gameId", gameController.getGameById as RequestHandler);
router.post("/:gameId/join", gameController.joinMatch as RequestHandler);
router.post("/:matchId/forfeit", gameController.forfeitMatch as RequestHandler);
router.post("/:matchId/draw/offer", gameController.offerDraw as RequestHandler);
router.post(
  "/:matchId/draw/accept",
  gameController.acceptDraw as RequestHandler
);

export default router;

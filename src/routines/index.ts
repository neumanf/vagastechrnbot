import schedule from "node-schedule";
import { config } from "../config";
import { channelPostRoutine } from "./channel-post";

export function setupRoutines() {
    schedule.scheduleJob(config.channelPostingRoutineCron, channelPostRoutine);
}
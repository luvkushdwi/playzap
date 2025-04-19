import db from "db";

type UserMiningData = {
  initialMiningDateTime: number;
  unclaimedCoins: number;
  dailyClaimedCoins: number;
  totalMinedHours: number;
  totalClaimCount: number;
  totalEarnedCoins: number;
  timer?: NodeJS.Timeout | null;
};

const DAILY_COIN_LIMIT = Number(process.env.DAILY_COIN_LIMIT) || 100;
const COINS_PER_HOUR = Number(process.env.COINS_PER_HOUR) || 5;
const MAX_CLAIM_LIMIT = Number(process.env.MAX_CLAIM_LIMIT) || 10;

function isNewUTCDate(last: number, now: number): boolean {
  return (
    new Date(last).toISOString().split("T")[0] !==
    new Date(now).toISOString().split("T")[0]
  );
}

export class MiningService {
  async startMining(userId: string): Promise<void> {
    const now = Date.now();
    let userData: any = await db.UserMining.findOne({
      where: { userId },
      attributes: ["miningData"],
    });

    if (userData) {
      userData = userData.miningData;

      if (isNewUTCDate(userData.initialMiningDateTime, now)) {
        userData.dailyClaimedCoins = 0;
        userData.initialMiningDateTime = now;

        const { timer, ...dataToSave } = userData;
        await db.UserMining.update(
          { miningData: dataToSave },
          { where: { userId } }
        );
      }
    } else {
      userData = {
        initialMiningDateTime: now,
        unclaimedCoins: 0,
        dailyClaimedCoins: 0,
        totalMinedHours: 0,
        totalClaimCount: 0,
        totalEarnedCoins: 0,
        timer: null,
      };
      const { timer, ...dataToSave } = userData;

      await db.UserMining.create({
        userId,
        miningData: dataToSave,
      });
    }

    if (userData.timer) {
      clearInterval(userData.timer);
    }
    userData.timer = setInterval(async () => {
      const userRecord: any = await db.UserMining.findOne({
        where: { userId },
        attributes: ["miningData"],
      });
    
      if (!userRecord) {
        return;
      }
    
      const data = userRecord.miningData;
      const currentTime = Date.now();
    
      if (data.unclaimedCoins >= 10) {
        console.log("You have already mined 10 coins. Please claim them before mining more.");
        return;
      }
    
      if (isNewUTCDate(data.initialMiningDateTime, currentTime)) {
        data.dailyClaimedCoins = 0;
        data.initialMiningDateTime = currentTime;
      }
    
      if (data.dailyClaimedCoins + data.unclaimedCoins < DAILY_COIN_LIMIT) {
        const potentialTotal = data.dailyClaimedCoins + data.unclaimedCoins + COINS_PER_HOUR;
        const coinsToAdd =
          potentialTotal > DAILY_COIN_LIMIT
            ? DAILY_COIN_LIMIT - (data.dailyClaimedCoins + data.unclaimedCoins)
            : COINS_PER_HOUR;
    
        data.unclaimedCoins += coinsToAdd;
        data.totalMinedHours += 1;
    
        console.log(`Added ${coinsToAdd} coins. Total unclaimed coins: ${data.unclaimedCoins}`);
    
        await db.UserMining.update(
          { miningData: data },
          { where: { userId } }
        );
      }
    }, 2000);
    
  }

  async claimCoins(userId: string): Promise<{
    claimedCoins: number;
    remainingDailyLimit: number;
    // totalEarnedCoins: number;
  }> {
    const userRecord: any = await db.UserMining.findOne({
      where: { userId },
      attributes: ["miningData"],
    });

    if (!userRecord) {
      throw new Error("User has not started mining.");
    }

    const userData = userRecord.miningData;
    const now = Date.now();

    if (isNewUTCDate(userData.initialMiningDateTime, now)) {
      userData.dailyClaimedCoins = 0;
      userData.initialMiningDateTime = now;

      const { timer, ...dataToSave } = userData;
      await db.UserMining.update(
        { miningData: dataToSave },
        { where: { userId } }
      );
    }

    const coinsToClaim = Math.min(
      userData.unclaimedCoins,
      MAX_CLAIM_LIMIT,
      DAILY_COIN_LIMIT - userData.dailyClaimedCoins
    );

    userData.dailyClaimedCoins += coinsToClaim;
    userData.unclaimedCoins = 0;

    if (coinsToClaim > 0) {
      userData.totalClaimCount += 1;
      userData.totalEarnedCoins += coinsToClaim;

      const { timer, ...dataToSave } = userData;

      await db.UserMining.update(
        { miningData: dataToSave },
        { where: { userId } }
      );
    }

    return {
      claimedCoins:  userData.totalEarnedCoins,
      remainingDailyLimit: DAILY_COIN_LIMIT - userData.dailyClaimedCoins,
    };
  }
}

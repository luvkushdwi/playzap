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
  private userMiningData: Record<string, UserMiningData> = {};

  startMining(userId: string): void {
    const now = Date.now();
    let userData = this.userMiningData[userId];
  
    if (userData) {
     
      if (isNewUTCDate(userData.initialMiningDateTime, now)) {
        userData.dailyClaimedCoins = 0;
        userData.initialMiningDateTime = now;
      }
    } else {
   
      userData = {
        initialMiningDateTime: now,
        unclaimedCoins: 0,
        dailyClaimedCoins: 0,
        totalMinedHours: 0,
        totalClaimCount: 0,
        totalEarnedCoins: 0,
        timer: null
      };
      this.userMiningData[userId] = userData;
    }

    if (userData.timer) {
      clearInterval(userData.timer);
    }
  
  
    userData.timer = setInterval(() => {
      const currentTime = Date.now();

      if(userData.unclaimedCoins >= 10) {
        console.log('You have already mined 10 coins. Please claim them before mining more.');
        return;
      }
  
      if (isNewUTCDate(userData.initialMiningDateTime, currentTime)) {
        userData.dailyClaimedCoins = 0;
        userData.initialMiningDateTime = currentTime;
      }
  
      if (userData.dailyClaimedCoins + userData.unclaimedCoins < DAILY_COIN_LIMIT) {
        
        const potentialTotal = userData.dailyClaimedCoins + userData.unclaimedCoins + COINS_PER_HOUR;
        const coinsToAdd = potentialTotal > DAILY_COIN_LIMIT
          ? DAILY_COIN_LIMIT - (userData.dailyClaimedCoins + userData.unclaimedCoins)
          : COINS_PER_HOUR;
  
        userData.unclaimedCoins += coinsToAdd;

        console.log('coined collected',userData.unclaimedCoins);
        userData.totalMinedHours += 1;
      }
  
    }, 60 * 60 * 1000); 
  }
  

  claimCoins(userId: string): {
    claimedCoins: number;
    remainingDailyLimit: number;
  } {
    const userData = this.userMiningData[userId];
    if (!userData) {
      throw new Error("User has not started mining.");
    }

    const now = Date.now();

    if (isNewUTCDate(userData.initialMiningDateTime, now)) {
      userData.dailyClaimedCoins = 0;
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
    }

    return {
      claimedCoins: coinsToClaim,
      remainingDailyLimit: DAILY_COIN_LIMIT - userData.dailyClaimedCoins,
    };
  }


}

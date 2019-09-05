export default {
  page: {
    page: "Page",
    total1: ",",
    total2: " pages in total"
  },
  btn: {
    open:'Open',
    bet:'Bet',
    login:'Login',
    claim:'Claim',
    copy:'Copy',
    bind:'Bind',
    topup:'Top up',
    withdraw:'Withdraw',
    viewrecord:'History'
  },
  header: {
    login:'Login',
    qa:'Q&A',
    chest:'Treasure',
    invite:'Referral',
    bonus:'Bonus pool',
    topup:'Chip recharge',
    withdraw:'Chip withdrawal',
    loginout:'Loginout'
  },
  input: {
    placeholder: "Search for block height/hash/address/transaction id or domainname",
    domain: "Search for domain name"
  },
  rank:{
    title:'Leaderboard',
    time:'Countdown',
    rank:'Rank',
    address:'Address',
    bet:'Bet',
    reward:'Reward',
    mybet:'My bet account',    
  },
  ranklog:{
    p1:"The platform rewards three players with the most bet amount each day, and the bonus amount is related to the amount of the player's bet cgas. The bonus is distributed the next day.",
    p2:'The relationship between the ranking, the bet amount and the NNC bonus amount is as follows:',
    t1:'Bet amount',
    t2:'1st place',
    t3:'2nd place',
    t4:'3rd place'
  },
  lucky:{
    title:'Lucky 99',
    currentpool:'Current prize pool',
    remainblock:'Remaining block：',
    luckyboy:'Current lucky dog：',
    me:'Me',
  },
  luckylog:{
    p1:'1. The platform will put 0.5% of each bet into the prize pool.',
    p2:'2. If in the consecutive 99 blocks a number greater than 94 is not rolled, the last player who rolls a number greater than 94 receives a lucky 99 reward.',
    p3:'3. When multiple people roll lucky numbers at the same time, the player whose transaction is the last one to be included is the lucky player.',
    p4:'4. The winners can receive 80% of the amount in the current prize pool, and the remaining reward is accumulated into the next round of games.',
    p5:'5. If the player who rolls the lucky number this time is the same person as the player who rolled the lucky number last time, the countdown is not reset.'
  },
  chest:{    
    title:'Treasure',
    remain:'Remaining:',
    tips:'',
    tips2:' NNC is distributed completely daily. 95% obtain 0.1 NNC,',
    tips3:'4.9% obtain 1 NNC, and 0.1% obtain 50 NNC.'
  },
  bonus:{
    title:'Bonus pool',
    tips:'All CGAS income of the platform will be distributed to all NNC holders in proportion to their holdings.',
    current:'Current bonus pool',
    accumulated:'Accumulated bonus'
  },
  bet:{    
    odds:'Payout',
    win:'Win chance',
    betamount:'Bet amount',
    reward:'Win the reward',
    mychip:'My chips',
    get:'Get ',
    bybet:' NNC by betting',
    tips:"Roll under",
    tips2:'Bet now and get 1.8x NNC!'    
  },
  invite:{
    title:'Referral',
    reward:'reward claimable',
    mycode:'My ID',
    myinviter:'Inviter ID',
    tips:"After inviting new players to play the game, both Inviter and Invitee can get an additional 11% of the NNC gained from the new player's betting mining respectively."
  },
  topup:{
    title:'Chip recharge',
    balance:'Balance in the wallet：',
    asset:'Asset',
    amount:'Amount'
  },
  withdraw:{
    title:'Chip withdrawal',
    balance:'Chip balance：',
    asset:'Asset',
    amount:'Amount'
  },
  record:{
    allbet:'All bets',
    mybet:'My bets',
    exchange:'Chip exchange',
    lucky:'Lucky 99',
    invite:'Invited',
    reward:'Referral reward'
  },
  allbet:{
    player:'Player',
    betamount:'Bet amount',
    betresult:'Bet/Result',
    reward:'Reward',
    betreward:'Bet reward',
    blockhash:'Block hash'
  },
  mybet:{
    betamount:'Bet amount',
    betresult:'Bet/Result',
    reward:'Reward',
    betreward:'Bet reward',
    blockhash:'Block hash',
    settlement:'In settlement',
    betfail:'Bet failed',
    settling:'Settling',
    settled:'Settled', 
  },
  exchange:{
    time:'Redemption time',
    type:'Types',
    content:'Content',
    status:'Status',
    topup:'Topup',
    withdraw:'Withdraw',
    check:'Success',
    fail:'Failed'
  },
  luckyrecord:{
    time:'Settlement time',
    player:'Player',
    height:'Block height',
    reward:'Reward amount'
  },
  inviterecord:{
    from:'Source',
    bet:'Accumulated bet',
    myreward:'My reward'
  }, 
  reward:{
    time:'Claiming time',
    amount:'Amount claimable',
    status:'Reward status',
    issuing:'Issuing',
    issued:'Issued',
    failed:'Failed'
  },
  qa:{
    q1:'1.How to play the game?',
    q2:'2.Why do you need to redeem chips first? Will there be an extra charge for redeeming chips or withdrawing cash?',
    q3:'3.Are the bonus distributed immediately?',
    q4:'4.Why do you need to set a betting fee?',
    q5:'5.Why is there a limit on the maximum bet amount?',
    q6:'6.How to ensure the fairness of the game?',
    a11:'1.Log in to the game using the Teemo wallet.',
    a12:'2.Redeem chips for the game. The chips include Cgas chips and NNC chips.',
    a13:'3.Select the currency you want to bet. You can choose either Cgas or NNC.',
    a14:'4.Set the amount you need to bet.',
    a15:'5.Adjust the slider to change the bet number and change the chance of winning.',
    a16:'6.Press the "Bet" button to place a bet. If the result number is less than the bet number, you win.',
    a17:'7. After you win, the settlement program will automatically send a settlement transaction to the smart contract to settle your bonus. Due to network delay, settlement transactions may be confirmed after 2~3 blocks.~3个块后被确认。',
    tips:'To ensure that the fainess of the game, the resulting number is determined by the block hash. We take the last two digits at the end of the hash of the block where the bet transaction is. For example, if the block hash of the bet transaction is confirmed to be 0x6ea00b9f33aa6e67c482a3f794ca75ca3cd50735889684619496d50fa0c33b4e, then the bet result number is 34.',
    a2:'Our game is run on the smart contract. In order to avoid the system charging fee, we need to recharge the contract before playing the game. The chip redemption is actually to recharge your contract account, the withdrawal is a transfer from your contract account to the wallet. There is no extra charge for these.',
    a3:'Your bet bonus and mining bonus are all distributed by smart contract. The automatic settlement program will send you a settlement transaction after the game, as long as the transaction is confirmed and the bonus will be received. Ranking rewards, daily treasure chests, and referral are distributed by our operators. Treasure chests and referral bonus need to be claimed manually.',
    a4:'There is only 20 free transaction per block on NEO, and it needs to wait in line for the next block if there are more than 20 transactions. Setting a fee can prevent your transactions from being queued. NEO requires a minimum fee of 0.001gas..001gas。',
    a5:'Large bets may empty the bonus pool at one time and others will not be able to continue the game, so we temporarily limit the maximum bonus to 100cgas or 10000nnc per round of game.',
    a6:'The entire game is run on the smart contract, with the bet transaction confirmed in the block as the coordinates and the block hash as the game result. The entire process from betting to the outcome cannot be controlled unless someone controls the operation of the entire blockchain. And since the bet transaction is confirmed before the bet result is known, the bet result is unpredictable.'
  },
  toast:{
    chest1:'Congratulations on getting ',
    chest2:' NNC, the reward will be issued later',
    chestfail:'Lottery failed',
    invitecopy:'Copied',
    bind:'Binding success',
    bindfail:'Binding failed',
    inreward:'The application has been submitted, and you can claim again after receiving the reward',
    inrewardfail:'Failed to claim, please try again later',
    topuperror:'Error:  Not filled recharge amount',
    topupfail1:'Error:  Insufficient ',
    withdrawfail1:'Error:  Insufficient ',
    fail2:' balance',
    withdrawerror:' Error:  Not Filled withdrawals amount',
    beterror1:'Bet at least 0.1 CGAS',
    beterror2:'Insufficient chips, please recharge',
    beterror3:'Bet at least 1 NNC',
    success:'The transaction has been sent, please wait for the block confirmation',
    fail:'Operation failed! And You can try it again later!'
  }
}
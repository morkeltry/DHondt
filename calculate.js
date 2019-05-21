
const defaultSeats = 'L';
const seatsNumber = {L: 8, SE: 10, SW: 6, W: 4, WM: 7, EM: 5, E: 7, Y: 6, YH: 6, NW: 8, NE: 3, S: 6, X: 8};

const guessSeats = args => {
  var seats = args[0];
  if (seats%1 >0) {
    seats = defaultSeats || args.length;
    console.log('float');
    return seats
  }
  if (seats>10){
    seats = defaultSeats || args.length;
    console.log('many');
    return seats
  }
  if (seats<3){
    seats = defaultSeats || args.length;
    console.log('few');
    return seats
  }
}

const addParties = (votes, partiesList = ['blue', 'red', 'yellow', 'gold', 'darkgreen',  'green', 'purple', 'lightblue', 'grey', 'pink']) => {
  const votesList = {};
  votes.forEach ((vote,idx) => votesList[partiesList[idx]]=1*vote);
  return votesList
}


const SeatObject = function () {
  return {
    party: undefined,
    // seatNumber: undefined,
    votes: undefined,
    // cost: undefined,
    // etc: undefined
  }
}

const populateSeatData = (seat, thisSeatGoesTo, movingTally, seatNumber ) => {
  seat.party = thisSeatGoesTo;
  seat.votes = movingTally[thisSeatGoesTo];
  seat.seatNumber = seatNumber;
}

const keyOfObjectMax = obj =>
  Object.keys(obj).reduce((a, b) => obj[a] > obj[b] ? a : b);

const trimEmptiesFromObject = (obj) => {
  const trimZeroes = true;
  Object.keys(obj).forEach (key => {
    if ((trimZeroes && (obj[key]===0 || obj[key]==='0'))
      || !obj[key]
      || obj[key] == {}
      || !obj[key].length
    )
      delete obj[key];
    });
};

const calculateResults = (seats, votes) => {
  const votesList = addParties(votes);
  const movingTally = Object.assign ({},votesList);
  const resultsBySeat = new Array(seats).fill().map(()=>new SeatObject());
  const resultsByParty = {};
  // Object.keys(votesList).forEach (key => {
  //   resultsByParty[key] = [];
  // });

  console.log(votesList);

  resultsBySeat.forEach ((seat, idx) => {
    const thisSeatGoesTo = keyOfObjectMax(movingTally);
    populateSeatData (seat, thisSeatGoesTo, movingTally, idx+1 );
    if (!resultsByParty[thisSeatGoesTo])
      resultsByParty[thisSeatGoesTo] = [];
    resultsByParty[thisSeatGoesTo].push (seat);

    // console.log(resultsBySeat, 'should update with:', seat);

    // this line is for the weird arbitrary way the D'Hondt system allocates a party multiple seats.
    movingTally[thisSeatGoesTo] = votesList[thisSeatGoesTo]/(resultsByParty[thisSeatGoesTo].length+1) ;
    // console.log('movingTally',movingTally);
  });

  const loserSuxx = {};
  populateSeatData (loserSuxx, keyOfObjectMax(movingTally), movingTally);

  trimEmptiesFromObject (resultsByParty);

  return {resultsBySeat, resultsByParty, neededForNextSeat : movingTally, loserSuxx }
}


if (require.main === module) {
  const args = process.argv.slice (2);
  var seats = guessSeats(args) || args.splice(0,1)[0];
  if (seatsNumber[seats])
    console.log('seatsNumber: ',seats);
  (seats = seatsNumber[seats] || seats);
  console.log('seats:',seats);
  console.log('votes:',args.join(', '));

  const results=calculateResults (seats, args)
  console.log(results);
  console.log(results.resultsByParty);
  if (results.resultsByParty[results.loserSuxx.party].length<2)
    console.log(`..and ${results.loserSuxx.party} is screwing -  ${results.loserSuxx.votes} did not cut it.`);
}

module.exports = { calculateResults, seatsNumber, trimEmptiesFromObject }

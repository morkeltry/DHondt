const d3 = require('d3');
const fs = require('fs');
if (typeof fetch !== 'function') {
    global.fetch = require('node-fetch-polyfill');
}

const seatsNumber = {L: 8, SE: 10, SW: 6, W: 4, WM: 7, EM: 5, E: 7, Y: 6, YH: 6, NW: 8, NE: 3, S: 6, X: 8};
const seatsName = {
  L: 'London',
  SE: 'SouthEast',
  E: 'East',
  NE: 'NorthEast',
}
//   SW: '',
//   W: '',
//   WM: '',
//   EM: '',
//   Y: '',
//   YH: '',
//   NW: '',
//   S: '',
// };
const years = [2019, 2014, 2009, 2004, 1999];
let filesCount = 0;
const files = [];
results = {};

const transpose = (data => {
  const result={};
  data.forEach (partyRow => {
  ['NE', 'NW', 'YH', 'EM', 'WM', 'E', 'L', 'SE', 'SW', 'W', 'S' ]
    .forEach (region => {
      if (!result[region])
        result[region]={};
      result[region][partyRow.party]= partyRow[region];
      // result[region][colour[partyRow.party]]= partyRow[region];
    })
  });
  return result
});

const keepFrom = (original, fields) => {
  returnable = {};
  // console.log(`original${JSON.stringify(original)}`);
  // console.log('original',original);
  // your could probably do clever spread and destructure here...
  fields.forEach (field => returnable[field] = original[field]);
  // console.log(`returnable${JSON.stringify(returnable)}`);
  // console.log('returnable',returnable);
  return returnable;
}

stringToNumberIfPoss = data =>
  (typeof data === 'string' && 1*data == data) ?
    1*data
  : data ;


numberify = object => {
  returnable = {};
  Object.keys(object).forEach (field => {
    returnable[field] = stringToNumberIfPoss(object[field])
  })
  return returnable;
}

const guesstimateThreshold = (seats, winnersTotal) =>
  winnersTotal / (seats*1.5);

const calculateWinners = (seats, votes) => {
  let winnerThreshold;
  let winnersTotal=0;
  let seatWinnerIdx;
  const seatsWon = new Array(seats).fill(undefined);
  const numberOfSeats = votes.map(()=>0)
  applyReduction = (total, idx) => total/(numberOfSeats[idx]+1);
  seatsWon.forEach ((seat,idx) => {
    seatWinnerIdx = votes.reduce((iMax, curr, i, arr) =>
      (applyReduction(curr, i) > applyReduction(arr[iMax], iMax)) ?
      i
      : iMax
    , 0) ;
    winnerThreshold=applyReduction(votes[seatWinnerIdx],seatWinnerIdx);
    numberOfSeats[seatWinnerIdx]++ ;
    seatsWon[idx]=seatWinnerIdx;
  });

  winnersTotal = numberOfSeats.reduce ((acc,curr,idx) => {
    if (numberOfSeats[idx]) {
      winnerThreshold = votes[idx];
      return acc + winnerThreshold
    }
    else
      return acc
  }
  , 0);

  const guessThreshold = guesstimateThreshold (seats, winnersTotal);

  return {
    votes: votes.slice(0,8),
    seats,
    seatDistribution: numberOfSeats.filter (x=>x),
    winnersTotal,
    winnerThreshold,
    guessThreshold,
    correct: winnerThreshold>=guessThreshold && (numberOfSeats.filter (x=>x>=guessThreshold).length === numberOfSeats.filter (x=>x>=winnerThreshold).length) ,
    errorSquared: Math.pow(0.5*(votes[numberOfSeats.indexOf(0)]+votes[numberOfSeats.indexOf(0)-1])-guessThreshold, 2) ,
    closeness: winnerThreshold-guessThreshold
  };
}



Object.keys(seatsName).forEach (seat => {
  years.forEach (year => {
    const contestName = `${seatsName[seat]}-${year}`;
    const inputFile = `./data/${contestName}.csv`;
    filesCount++;
    console.log(`Opening ${inputFile}`);
    fs.readFile (inputFile, 'utf8', (err, data) => {
      // console.log(`${inputFile} got summat`);
      if (err)
        throw err;
      results[contestName] = [];
      d3.csvParse(data)
        .forEach (vote => {
          // console.log(vote);
          vote = numberify(keepFrom (vote, ['Party','Vote','Percentage']));
          // console.log(vote);
          results[contestName].push(vote);
        });
      console.log('\n',contestName,':');
      // console.log(results);
      const resultsDigest = calculateWinners (seatsNumber[seat], results[contestName].map(result=>result.Percentage))
      if (1 || !resultsDigest.correct){
        console.log('\n',contestName,':');
        // console.log(results);
          console.log(resultsDigest);
      }
      filesCount--;
    });
  });
});

setInterval (()=>{
  if (filesCount) console.log((filesCount))
    else {
      process.exit()




    }
}, 500);

// while (filesCount) {
// };

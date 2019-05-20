
const defaultSeats = 'L';

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

if (require.main === module) {
  const args = process.argv.slice (2);
  var seats = guessSeats(args) || args.splice(0,1)[0];
  const region = {L: 8, SE: 10, SW: 6, W: 4, WM: 7, EM: 5, E: 7, Y: 6, YH: 6, NW: 8, NE: 3, S: 6, X: 8};
  if (region[seats])
    console.log('region: ',seats);
  (seats = region[seats] || seats);
  console.log('seats be:',seats);
  console.log('votes be:',args.join(', '));

}

const doStuff = params => {
}

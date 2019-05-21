const d3 = require('d3');
const fs = require('fs');
if (typeof fetch !== 'function') {
    global.fetch = require('node-fetch-polyfill');
}
const { calculateResults, seatsNumber, trimEmptiesFromObject } = require ('./calculate.js');
const colour = {
  'Con' : 'blue',
  'Lab' : 'red',
  'Lib Dem' : 'yellow',
  'SNP' :'gold',
  'Plaid Cymru' : 'darkgreen',
  'Green' : 'green',
  'UKIP' : 'purple',
  'Brexit Party' : 'lightblue',
  'Change UK' : 'grey',
  'Other' : 'pink'
};

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

const inputFile = './regional_data.csv';
fs.readFile (inputFile, 'utf8', (err, data) => {
  if (err)
    throw err;
  data = (transpose(d3.csvParse(data)));
  console.log(data);

  Object.keys(data).forEach (region => {
    trimEmptiesFromObject(data[region]);
    console.log(Object.values(data[region]));
    const result = calculateResults (seatsNumber[region], Object.values(data[region]))
    console.log(data[region]);
    console.log(result);
  });


  // trimEmptiesFromObject();
});

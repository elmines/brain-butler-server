const assert = require("assert");

function toSubtraction(augend, addend) { return [augend+addend, addend]; }
function hasCarry(a, b) { return (a % 10) + (b % 10) >= 10; }
function swapOperands(pair) { return [pair[1], pair[0]]; }
function randomSwap(pair) { return (Math.random() <= .5) ? pair : swapOperands(pair);}

function pairs(sum) {
  var opPairs = [];
  for (var augend = 0; augend <= sum; ++augend) opPairs.push([augend, sum-augend]);
  return opPairs;
}

function pairsLE(sum) {
  return Array.from(Array(sum).keys())
        .map(index => pairs(index + 1))
        .reduce((store, next) => store.concat(next));
}

function largeSums() {
    var opPairs = [];
    const MIN_SUM = 11;
    const MAX_SUM = 37;
    for (var sum = MIN_SUM; sum <= MAX_SUM; ++sum) opPairs.push(...pairs(sum));
    return opPairs;
}

//Fisher-Yates Shuffle
function randomIndices(n) {
  var indices = [];
  var struck = Array(n).fill(false);
  var numUnstruck = n;
  do {
    const steps = Math.trunc( 1 + Math.random()*numUnstruck );
    let i, j;
    for (i = 0, j = 0; j < steps; ++i) {
      if (!struck[i]) ++j;
    }
    struck[i-1] = true;
    indices.push(i-1);
    --numUnstruck;
  } while (numUnstruck > 0);
  return indices;
}

function choose(items, r) {
  const indices = randomIndices(items.length);
  var combination = Array(r).fill(null);
  for (var i = 0; i < r; ++i) combination[i] = items[indices[i]];
  return combination;
}

function problemSet() {
  function bigOperand(pair) { return pair[0] > 1 && pair[1] > 1; }
  function noTie(pair) {return pair[0] != pair[1];}

  var small = pairsLE(10).filter(bigOperand).filter(noTie);
  assert(small.length == 24);

  small = small.concat(choose(small,small.length / 2));

  var large = [];
  for (var i = 11; i < 40; i += 10) {
    var decade = [];
    for (var sum = i; sum < i + 9; ++sum) decade = decade.concat(pairs(sum));
    large = large.concat( choose( decade.filter(pair => hasCarry(...pair)), 16) );
  }
  assert(large.length == 48);

  const sums = small.concat(large);
  const differences = sums.map(pair => toSubtraction(...pair));

  return {sums, differences};
}

console.log(JSON.stringify(problemSet()));

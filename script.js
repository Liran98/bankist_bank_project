'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2023-03-24T21:31:17.178Z',
    '2023-03-23T07:42:02.383Z',
    '2023-01-28T09:15:04.904Z',
    '2023-01-01T10:17:24.185Z',
    '2023-03-26T14:11:59.604Z',
    '2023-01-27T17:01:17.194Z',
    '2023-03-25T23:36:17.929Z',
    '2023-01-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
  eurtoPHP: 58.40,
  eurtoUSD: 1.08
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'ILS',
  locale: 'he-IL',
  usdtoPHP: 54.13,
  usdtoEUR: 0.93
};
const account3 = {
  owner: 'kuya smith',
  movements: [12000, 3400, -150, -790, -3210, -8000, 100, -30],
  interestRate: 1.5,
  pin: 3333,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'PHP',
  locale: 'tl-PH',
  phptoUSD: 0.018,
  phptoEUR: 0.017
};


const accounts = [account1, account2, account3];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');
const labelLogout = document.querySelector('.logout-timer');
const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////

//? display currency depends on the country
const displayCurrency = function (locale, currency, movements) {
  const options = {
    style: 'currency',
    currency: currency
  }
  return new Intl.NumberFormat(locale, options).format(movements);
}


//? check movements dates
const displaydateformat = function (date, locale) {

  const calcdaypassed = function (date1, date2) {
    return Math.round(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));
  }
  // compares the curenct date
  //with the movementsdate array  
  const passed = calcdaypassed(new Date(), date);
  if (passed === 0) return 'today';
  if (passed === 1) return 'yesterday';
  if (passed <= 7) return `${passed} days ago`;
  // else{
  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();
  // return `${day}/${month}/${year}`;
  return new Intl.DateTimeFormat(locale).format(date);
  // }                 //each account has a different locale 

}
////////////////////////////////////////////////////

//? display movements array
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = displaydateformat(date, acc.locale);
    const Acc_currency = displayCurrency(acc.locale, acc.currency, mov);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">
        ${i + 1} ${type}</div>
      <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${Acc_currency}</div>
      
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
////////////////////////////////////////////////////

//? calculate total balance
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = displayCurrency(acc.locale, acc.currency, acc.balance);
};
////////////////////////////////////////////////////

//? display the incomes , outcomes , and interests 
const calcDisplaySummary = function (acc) {

  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = displayCurrency(acc.locale, acc.currency, incomes);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = displayCurrency(acc.locale, acc.currency, Math.abs(out));

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = displayCurrency(acc.locale, acc.currency, interest);
};
////////////////////////////////////////////////////
//? CREATE USER
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);
///////////////////////////////////////////////////



/////////////////////////////////////////////////////
//? UPDATE UI
const updateUI = function (acc) {

  // Display movements
  displayMovements(acc);
  // Display balance
  calcDisplayBalance(acc);
  // Display summary
  calcDisplaySummary(acc);



};

//? LOGOUT TIMER
const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    // `${time % 60}`.padStart(2,0); either way work
    const sec = String(time % 60).padStart(2, 0);
    // in each call print the remaining time to the UI
    labelTimer.textContent = `${min}:${sec}`
    //when 0 seconds stop timer and log out user
    if (time === 0) {
      clearInterval(timer)
      containerApp.style.opacity = 0;
      labelWelcome.textContent = ' Log in to get started';
    };
    //decrease 1 second
    time = time - 1;
  }
  //  set time to 5 minutes 
  let time = 300;
  //call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
}

///////////////////////////////////////

let currentAccount, timer;
// //!FAKE LOGIN 
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;



////////////////////////////////////////////////////////
// Event handlers

//? lOGIN 
btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]
      }`;
    containerApp.style.opacity = 100;
    //? LABEL DATE 

    // formatting date with api 
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: '2-digit',
      year: 'numeric',
      // weekday: 'short' // narrow , long , short , numeric , 2-digit
    }

    labelDate.textContent = new Intl.DateTimeFormat
      (currentAccount.locale, options).format(now);

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //start timer
    if (timer) {
      clearInterval(timer)
    }
    timer = startLogOutTimer();
 
 
  
       // Update UI
       updateUI(currentAccount);
  }
});
///////////////////////////////////////////////////////////
//? TRANSFER
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );


  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    setTimeout(function () {
      currentAccount.movements.push(-amount);
      receiverAcc.movements.push(amount);

      //transfer date 
      currentAccount.movementsDates.push(new Date().toISOString());
      receiverAcc.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);
      inputTransferAmount.value = inputTransferTo.value = '';
    }, 2500)


    //resting the timer when doing the transfer
    clearInterval(timer);
    timer = startLogOutTimer();


  }
});
///////////////////////////////////////////////////////////

//? LOAN
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    setTimeout(function () {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
      inputLoanAmount.value = '';
    }, 2500)
    // Update UI

    //resting the timer when requsting a loan
    clearInterval(timer);
    timer = startLogOutTimer();
  }

});
///////////////////////////////////////////////////////////

//? CLOSE ACCOUNT
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});
///////////////////////////////////////////////////////////

//? SORT MOVEMENTS ARRAY
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});


///////////////////////////////////
//? recolor movements rows 
labelBalance.addEventListener('click', function (e) {
  e.preventDefault();

  [...document.querySelectorAll('.movements__row')]
    .forEach(function (row, i) {
      // 0 , 2 , 4 , 6 
      if (i % 1 === 0) row.style.backgroundColor = 'lightgreen';
      // 0, 3 , 6 , 9
      if (i % 2 === 0) row.style.backgroundColor = 'lightyellow';

      else {
        row.style.backgroundColor = 'lightblue';

      }
    });
});
///////////////////////////////





import moment from 'moment';

export const parseNumber = (numberStr) => {
  const momentDate = moment(numberStr);
  if (numberStr && !momentDate.isValid()) {
    const number = numberStr.split(',').join('');
    const numberReal = parseFloat(number);
    if (numberReal) {
      return numberReal;
    }
  }
  return numberStr;
};

export const getDataListAndTitleFromTable = (table, index) => {
  const headers = table.querySelectorAll('th');
  const tableBody = table.querySelector('tbody');
  // console.log(headers[index].innerText);

  if (index > headers.length - 1) {
    return {
      data: null,
      title: '',
    };
  }
  const title = headers[index].innerText;

  // console.log(title);

  const rows = tableBody.querySelectorAll('tr');
  // console.log(rows);
  const columns = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 1; i < rows.length; i++) {
    const tds = rows[i].querySelectorAll('td');
    // console.log(tds[index]);
    if (tds[index] && tds[index].innerText) {
      columns.push(parseNumber(tds[index].innerText));
    }
  }
  // console.log(columns);
  // rows.forEach((row) => {

  // });
  // console.log(columns);

  return {
    title,
    data: columns,
  };
};

// check wheather the items are of float datatype
// Assuming there is consistency across the data. if first item is okay then rest of the colum is okay
export const isValidYAxis = (data) => {
  // console.log(data);

  if (data && data.length > 0) {
    if (typeof data[0] === 'number') {
      return true;
    }
    const momentDate = moment(data[0]);
    if (momentDate.isValid()) {
      return false;
    }
    const firstItem = data[0].split(',').join('');
    if (parseFloat(firstItem)) {
      return true;
    }
  }
  return false;
};

// const isValidXAxis = (data) => {

// }

export function getBody() {
  return document.getElementsByTagName('body')[0];
}

export default function removeDuplicate(arr, getidentifier) {
  const identyfierState = {};

  return arr.filter(element => {
    if (arr === undefined || arr.length === 0) {
      return [];
    } else {
      const identyfier = JSON.stringify(getidentifier(element));
      if (identyfierState[identyfier]) {
        return false;
      }
      identyfierState[identyfier] = true;
      return true;
    }
  });
}

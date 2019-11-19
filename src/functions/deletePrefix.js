export default function deletePrefix(str) {
  if (str.includes('CCAA')) {
    return str.replace('CCAA ', '');
  }

  if (str.includes('Com.')) {
    return str.replace('Com. ', '');
  } else {
    return str;
  }
}

export default function getFirstTwoChars(str) {
  if (str.length >= 2) {
    return str.substring(0, 2)
  } else {
    return str
  }
}

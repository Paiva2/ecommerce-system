import { Decimal } from "decimal.js"

export function convertBigNumber(number: number) {
  const removeAllNumberDots = String(number).replaceAll(".", "" )

  const bigN = new Decimal(Number(removeAllNumberDots))

  return bigN.toFixed(2)
}

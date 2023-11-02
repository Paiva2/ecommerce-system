import { StoreItemRequestPayload } from "../api/@types/types"
import fs from "fs"
import { parse } from "csv-parse"

interface StoreItemRowSchema {
  name: string
  value: string
  quantity: string
  description: string
  promotion: string
  promotionalValue: string
  itemImage: string
  colors: string
  sizes: string
}

function readCsv(path: string) {
  let csvRows = [] as StoreItemRequestPayload[]

  return new Promise((resolve, reject) => {
    fs.readFile(`${path}`, (_, fileData) => {
      parse(
        fileData,
        { columns: true },
        function (errorParsing, rows: StoreItemRowSchema[]) {
          if (errorParsing) {
            reject(new Error("Error while reading CSV file."))
          }

          try {
            for (let row of rows) {
              csvRows.push({
                itemName: row.name,
                colors: row.colors,
                description: row.description,
                quantity: Number(row.quantity),
                sizes: row.sizes,
                value: Number(row.value),
                itemImage: row.itemImage ?? null,
                promotion: Boolean(row.promotion) ?? false,
                promotionalValue: Number(row.promotionalValue) ?? 0,
              })
            }

            resolve(csvRows)
          } catch {
            throw new Error("Error while reading CSV file.")
          } finally {
            fs.unlink(path, (errorDeleting) => {
              if (errorDeleting) {
                throw new Error("Error while removing csv file.")
              }
            })
          }
        }
      )
    })
  }) as Promise<StoreItemRequestPayload[]>
}

export default readCsv

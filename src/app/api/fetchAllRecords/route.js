import { NextResponse } from "next/server"
import Airtable from "airtable"

export async function GET() {
  try {
    // Initialize Airtable
    const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID)

    // Fetch all records from the 'data' table
    const records = await getAllRecords(base)

    // Return success response
    return NextResponse.json(records, { status: 200 })
  } catch (error) {
    console.error("Error fetching records:", error)

    // Return error response
    return NextResponse.json({ error: "Failed to fetch records" }, { status: 500 })
  }
}

// Helper function to get all records from a table
async function getAllRecords(base) {
  return new Promise((resolve, reject) => {
    const allRecords = []

    base("data")
      .select({
        view: "Grid view",
      })
      .eachPage(
        function page(records, fetchNextPage) {
          // Add these records to our array
          allRecords.push(...records)
          console.log(records)
          // Get the next page of records
          fetchNextPage()
        },
        function done(err) {
          if (err) {
            reject(err)
            return
          }

          resolve(allRecords)
        },
      )
  })
}


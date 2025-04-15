import Airtable from 'airtable';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ message: 'Email and password are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Initialize Airtable with the API key and base ID
    const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
      .base(process.env.AIRTABLE_BASE_ID);

    // Check if a record exists in Airtable where both email and password match
    const records = await new Promise((resolve, reject) => {
      const allRecords = [];
      base('admin_access')
        .select({
          filterByFormula: `AND({Name} = '${email}', {password} = '${password}')`,
          view: 'Grid view',
        })
        .eachPage(
          (records, fetchNextPage) => {
            allRecords.push(...records);
            fetchNextPage();
          },
          (err) => {
            if (err) reject(err);
            else resolve(allRecords);
          }
        );
    });

    if (records.length === 0) {
      return new Response(JSON.stringify({ message: 'Invalid email or password' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const user = records[0];

    return new Response(
      JSON.stringify({
        message: 'Login successful',
        user: {
          email: user.get('Name'),
          id: user.id,
        },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({ message: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

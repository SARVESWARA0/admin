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

    // Initialize Airtable
    const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
      .base('app1LJNvLgSJaHCgU');

    // Check if the user exists in Airtable
    const records = await new Promise((resolve, reject) => {
      const allRecords = [];
      base('admin_access')
        .select({
          filterByFormula: `{Name} = '${email}'`,
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
    const storedPassword = user.get('Password'); 

    if (password !== storedPassword) {
      return new Response(JSON.stringify({ message: 'Invalid email or password' }), {
        
        headers: { 'Content-Type': 'application/json' },
      });
    }

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

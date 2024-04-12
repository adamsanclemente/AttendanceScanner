/** @type {import('./$types').RequestHandler} */

export function GET() {

    // Return a 200 status code and the string 'online'
    return new Response('online', {
        status: 200
    });
}
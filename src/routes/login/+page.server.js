/** @type {import('./$types').PageServerLoad} 
export async function load({ cookies }) {
    const user = await db.getUserFromSession(cookies.get('sessionid'));
    return { user };
  }*/ 

/** @type {import('./$types').Actions} */
export const actions = {
    login: async ({ cookies, request }) => {
        console.log("Request Recieved: Login")
        const data = await request.formData();
        const name = data.get('name');
        const password = data.get('password');

        // const user = await db.getUser('name');
        // cookies.set('sessionid', await db.createSession(user));
        
        console.log("Successfully logged in " + name)

        return {success: true, name: name};
      }
  };
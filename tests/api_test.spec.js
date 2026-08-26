import { test, expect } from '@playwright/test';


test('API delete request test', async ({ request }) => {

    const response = await request.delete('https://jsonplaceholder.typicode.com/posts/1');

    expect(response.status()).toBe(200);

})



test('API put request test', async ({ request }) => {

    const response = await request.put('https://jsonplaceholder.typicode.com/posts/1', {
        data: {
            title: 'Sunil',
            body: 'bar',
            userId: 1,
        }
    })
    
    expect(response.status()).toBe(200);
    const text = await response.text();
    expect(text).toContain('Sunil');
    console.log(await response.json());
})





test('API post request test', async ({ request }) => {

    const response = await request.post('https://jsonplaceholder.typicode.com/posts', {
        data: {
            title: 'foo',
            body: 'bar',
            userId: 1,
        },
    });

    expect(response.status()).toBe(201);
    console.log(await response.json());
})

test('API get request test', async ({ request }) => {

    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');

    expect(response.status()).toBe(200);

    const text = await response.text();
    expect(text).toContain('sunt aut facere repellat provident occaecati excepturi optio reprehenderit');
   //test change
})

# Back-end Assessment
- [Back-end Assessment](#back-end-assessment)
  - [How to run?](#how-to-run)
  - [How to run tests?](#how-to-run-tests)
    - [Run tests inside the container](#run-tests-inside-the-container)
    - [Run tests from the machine](#run-tests-from-the-machine)
  - [Stack](#stack)
  - [Author](#author)
  - [EndPoints](#endpoints)
    - [User](#user)
      - [Get User By ID](#get-user-by-id)
      - [Create User](#create-user)
    - [Post](#post)
      - [Create a Post](#create-a-post)
      - [Create a Repost](#create-a-repost)
      - [Create a Quote](#create-a-quote)
      - [Find Posts](#find-posts)
  - [Self-critique & Scaling](#self-critique--scaling)

## How to run?
- Download and install Docker
- Open your terminal and enter the project folder `backend-assessment`
- Run the comand:
  > docker-compose up -d
- The server will be up in the URL `http://localhost:3000`

## How to run tests?
To run tests you can chose: run inside the container or in your machine.

### Run tests inside the container
- Firs get the containers up, run the command:
  > docker-compose up -d
- Attach your terminal to the docker container, run the command:
  > docker attach backend-assessment-node
- Enter the folder `usr/app` and run the command:
  > npm test

### Run tests from the machine
- First you need to install `NodeJS` and `npm`: https://nodejs.org/en/
- Open the terminal and enter the project folder `backend-assessment`
- Enter the folder `app`
  > cd app
- Install the project packages:
  > npm i
- Execute the tests:
  > npm test
- A folder with the coverage will be generated `app/coverage`


## Stack
- NodeJS
- Express
- TypeScript
- MongoDB
- Jest
- Git & GitHub
- Docker & DockerCompose
- API Service

## Author
- Name: Ruhan de Oliveira Baiense
- Contact: rdgitarra@gmail.com

## EndPoints

### User

#### Get User By ID

> Returns a User based on given ID

PATH
```
GET http://localhost:3000/api/v1/users/{user_id}
```

RESPONSE
```
{
    "id": "62ac9c168ba3c8e97dcbff04",
    "username": "fooBar",
    "countPosts": 6,
    "createdAt": "2022-06-17T15:21:58.578Z",
    "createdAtFormated": "Jun 17, 2022"
}
```
---
#### Create User
> Create a User

PATH
```
POST http://localhost:3000/api/v1/users/
```
BODY
```
{
    "username": "fooBar"
}
```
RESPONSE
```
{
    "id": "62ae0de10bb22791bef40ff1",
    "username": "fooBar",
    "createdAt": "2022-06-18T17:39:45.579Z"
}
```
---
### Post

#### Create a Post
> Create a Post of type **ORIGINAL**

PATH
```
POST http://localhost:3000/api/v1/posts/
```
BODY
```
{
    "message": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    "authorId": "62ac9c168ba3c8e97dcbff04"
}
```
RESPONSE
```
{
    "id": "62ae0f1a0bb22791bef40ff5",
    "type": "original",
    "message": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    "author": "62ac9c168ba3c8e97dcbff04",
    "createdAt": "2022-06-18T17:44:58.513Z"
}
```
---
#### Create a Repost
> Create a Post of type **REPOST**

PATH
```
POST http://localhost:3000/api/v1/posts/{original_post_id}/reposts
```
BODY
```
{
    "authorId": "62ad26ddcf02c24311a16376"
}
```
RESPONSE
```
{
    "id": "62ae0fba0bb22791bef40ffa",
    "type": "repost",
    "author": "62ad26ddcf02c24311a16376",
    "originalPost": "62acc7adb7aeee7f19e65991",
    "createdAt": "2022-06-18T17:47:38.851Z"
}
```
---
#### Create a Quote
> Create a Post of type **QUOTE**

PATH
```
POST http://localhost:3000/api/v1/posts/{original_post_id}/quotes
```
BODY
```
{
    "authorId": "62ad26ddcf02c24311a16376",
    "message": "Lorem Ipsum is simply dummy text of the printing and typesetting industry."
}
```
RESPONSE
```
{
    "id": "62ae0fba0bb22791bef40ffa",
    "type": "quote",
    "author": "62ad26ddcf02c24311a16376",
    "message": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    "originalPost": "62acc7adb7aeee7f19e65991",
    "createdAt": "2022-06-18T17:47:38.851Z"
}
```
---
#### Find Posts
> Returns a list of Posts based on query params, ordered from newer to older. All params are optional.

PARAMS
```
- page: 1 // Current pag of search
- perPage: 10 // Total of itens per page. Maximum of 10
- userId: 62ae0fba0bb22791bef40ffa // Id of User. Filter the posts by User Id
- startDate: 2022-06-17T00:00:57.224Z // Date in ISO format. Filter itens that are created after this Date.
- endDate: 2022-06-17T00:00:57.224Z // Date in ISO format. Filter itens that are created before this Date.
```

PATH
```
GET http://localhost:3000/api/v1/posts?page={page}&perPage={perPage}&userId={userId}&endDate={endDate}&startDate={startDate}
```
RESPONSE
```
[
  {
      "_id": "62ae0fba0bb22791bef40ffa",
      "type": "repost",
      "author": {
          "_id": "62ad26ddcf02c24311a16376",
          "username": "foo1b22ar33333",
          "createdAt": "2022-06-18T01:14:05.826Z",
          "updatedAt": "2022-06-18T01:14:05.826Z",
          "__v": 0
      },
      "originalPost": {
          "_id": "62acc7adb7aeee7f19e65991",
          "type": "original",
          "message": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
          "author": {
              "_id": "62ac9c168ba3c8e97dcbff04",
              "username": "foo1bar",
              "createdAt": "2022-06-17T15:21:58.578Z",
              "updatedAt": "2022-06-17T15:21:58.578Z",
              "__v": 0
          },
          "createdAt": "2022-06-17T18:27:57.024Z",
          "updatedAt": "2022-06-17T18:27:57.024Z",
          "__v": 0
      },
      "createdAt": "2022-06-18T17:47:38.851Z",
      "updatedAt": "2022-06-18T17:47:38.851Z",
      "__v": 0
  }
]
```
---

## Self-critique & Scaling
- **Increase the code coverage:** Although I have wrote many tests, there still many corner cases that need to be fully tested to ensure maximum security about the app behaviour.
- **Improve app documentation:** I wrote the API documentation in the README, but a better solution would be used a tool to standarize and optimize the documentation like Swagger.
- **Add observability tolls:** Although the API have many tests, we still need some level of observability, to ensure the healthiness of the application. We can add some logs in key points. Add some tools to keep tracking about the app performance (response time, error rate, throughput, etc) like DataDog or NewRelic for example. This tools can warn us  about any problem happen on app.
- **Improve app performance:** As the use of the application increase, we need to improve the performance. We can add some indexes on the database to improve our query time. We can use data-replication rather than reference to improver our querys, like on quote references to originalPost for example. Another strategie is to add some cache level on the application, with that we can reduce the number of querys on databse. We can use a shared cached with Redis for example. Some routines that can be cached for example are: the user data most recently or most used, the post data that are most replyed or quoted.
- **Improve the app availability and healthiness:** 
To ensure our app can handle as many users as it need, we need to think how we can scale up. One way to achieve that is by have an infrastructure that  allow us to have multiple instances of our application. As our throughput increases, we can scale up our app instances, and with a loadbalancer, we can share the requests between all instances, to not overload one single instance.
- **Improve the database:** As our database increases in data, it start to get slower, and we have a limit that we can scale  up the database server. So one strategie we can adopt is shard the data, we can have one database server with posts from users from A to F, and other from G to L, and so on so far. With that we decrease the load of one single server, but that strategie have many challenges, and not all companys have an infrastructure to do that. Another strategie wold be have database servers optimized for querys and anothers for data insertion, for sure we will need some strategie to equalize both databases, but that can optimize our query time.

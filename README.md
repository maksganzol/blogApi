# Blog api

## Authorization

- Test account:

  - usrname: `alan_norton`
  - password: `password`
  - token `YWxhbl9ub3J0b246cGFzc3dvcmQ=`

- Type: `Authorization: Bearer {token}` (token - {username}:{password} in base64)

- Sign up:
  - `POST /signup`
  - body `{username, password}`

## Posts:

- Create post

  - `POST /posts`
  - body: `{content, title}`

- Get post info

  - `GET /posts/{id}`

- Update post

  - `PUT /posts`
  - body `{content, title}`

- Delete post

  - `DELETE /posts/{id}`

- Posts list
  - `GET /posts?page=0`

## Comments:

- Create post

  - `POST /comments`
  - body: `{content, parent, parentType}` (parentType: `Post` | `Comment`)

- Get post info

  - `GET /comments/{id}`

- Update post

  - `PUT /comments`
  - body `{content}`

- Delete post
  - `DELETE /comments/{id}`
